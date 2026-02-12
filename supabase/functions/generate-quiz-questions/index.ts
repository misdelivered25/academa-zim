import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as pdfParse from "npm:pdf-parse@1.1.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function extractTextFromPDF(base64Data: string): Promise<string> {
  try {
    // Remove data URL prefix if present
    const base64Clean = base64Data.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Uint8Array.from(atob(base64Clean), c => c.charCodeAt(0));
    
    const data = await pdfParse.default(pdfBuffer);
    return data.text || '';
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF document');
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, documentText, pdfBase64, numberOfQuestions = 5, difficulty = "medium" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    let materialText = documentText || '';
    
    // Parse PDF if provided
    if (pdfBase64) {
      console.log("Parsing PDF document...");
      const pdfText = await extractTextFromPDF(pdfBase64);
      materialText = pdfText;
      console.log(`Extracted ${pdfText.length} characters from PDF`);
    }

    const content = materialText 
      ? `Based on this document/material:\n\n${materialText.slice(0, 15000)}\n\nGenerate ${numberOfQuestions} quiz questions that test understanding of the key concepts.`
      : `Generate ${numberOfQuestions} quiz questions about: ${topic}`;

    console.log("Generating quiz questions...", { topic, hasDocument: !!materialText, numberOfQuestions, difficulty });

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
            content: `You are an educational quiz generator specializing in creating high-quality multiple-choice questions. 
Create questions that are:
- Clear and unambiguous
- Appropriate for ${difficulty} difficulty level
- Educational and test understanding, not just memorization
- Have exactly 4 answer options each
- Have one clearly correct answer
- Based directly on the provided material when available

For Zimbabwean students, consider local context when relevant.`
          },
          {
            role: "user",
            content: content
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_questions",
              description: "Generate multiple choice quiz questions",
              parameters: {
                type: "object",
                properties: {
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question_text: {
                          type: "string",
                          description: "The question text"
                        },
                        options: {
                          type: "array",
                          items: { type: "string" },
                          description: "Exactly 4 answer options"
                        },
                        correct_answer: {
                          type: "string",
                          description: "The correct answer (must match one of the options exactly)"
                        },
                        points: {
                          type: "number",
                          description: "Points for this question (1-3 based on difficulty)"
                        }
                      },
                      required: ["question_text", "options", "correct_answer", "points"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["questions"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "generate_questions" } }
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
    
    const parsedResult = JSON.parse(toolCall.function.arguments);
    console.log("Generated questions:", parsedResult.questions?.length);

    return new Response(
      JSON.stringify({ questions: parsedResult.questions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Question generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
