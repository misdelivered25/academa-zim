import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing assignment document...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { 
            role: "system", 
            content: "You are an academic assignment analyzer. Analyze documents and provide structured analysis."
          },
          {
            role: "user",
            content: `Analyze this assignment document:\n\n${documentText}`
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_assignment",
              description: "Analyze an assignment and provide difficulty rating, time estimate, topics, tips, and resources",
              parameters: {
                type: "object",
                properties: {
                  difficulty: {
                    type: "string",
                    enum: ["easy", "medium", "hard"],
                    description: "Difficulty level of the assignment"
                  },
                  hours: {
                    type: "number",
                    description: "Estimated hours needed to complete"
                  },
                  topics: {
                    type: "array",
                    items: { type: "string" },
                    description: "Key topics and skills required"
                  },
                  tips: {
                    type: "string",
                    description: "Detailed study tips"
                  },
                  resources: {
                    type: "array",
                    items: { type: "string" },
                    description: "Recommended study resources"
                  }
                },
                required: ["difficulty", "hours", "topics", "tips", "resources"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "analyze_assignment" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices[0].message.tool_calls?.[0];
    
    if (!toolCall || !toolCall.function?.arguments) {
      throw new Error("No valid tool call response from AI");
    }
    
    const parsedAnalysis = JSON.parse(toolCall.function.arguments);
    console.log("Analysis complete:", parsedAnalysis);

    return new Response(
      JSON.stringify({ analysis: parsedAnalysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Assignment analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
