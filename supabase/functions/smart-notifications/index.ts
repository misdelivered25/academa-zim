import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action } = await req.json();
    const authenticatedUserId = user.id;

    if (action === 'analyze') {
      // Fetch user's study patterns using verified user ID (not client-supplied)
      const { data: assignments } = await supabaseClient
        .from('assignments')
        .select('*')
        .eq('user_id', authenticatedUserId)
        .order('created_at', { ascending: false })
        .limit(50);

      const { data: sessions } = await supabaseClient
        .from('study_sessions')
        .select('*')
        .eq('user_id', authenticatedUserId)
        .order('session_date', { ascending: false })
        .limit(30);

      const { data: progress } = await supabaseClient
        .from('assignment_progress')
        .select('*')
        .eq('user_id', authenticatedUserId)
        .order('updated_at', { ascending: false })
        .limit(30);

      // Use Lovable AI to analyze patterns
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      const analysisPrompt = `Analyze this student's study patterns and provide 1-2 actionable study recommendations:

Assignments: ${assignments?.length || 0} total
Recent Study Sessions: ${sessions?.length || 0}
Assignment Progress: ${progress?.length || 0} tracked

Recent assignment details:
${assignments?.slice(0, 5).map(a => `- ${a.title}: ${a.status}, due ${a.due_date}`).join('\n')}

Provide brief, specific recommendations in this JSON format:
{
  "recommendations": [
    {"message": "Brief actionable suggestion", "priority": "high|medium|low"}
  ]
}`;

      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are a helpful study assistant. Provide brief, actionable study recommendations based on student patterns.' },
            { role: 'user', content: analysisPrompt }
          ],
          response_format: { type: "json_object" }
        }),
      });

      if (!aiResponse.ok) {
        console.error('AI API error:', await aiResponse.text());
        return new Response(
          JSON.stringify({ recommendations: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const aiData = await aiResponse.json();
      const recommendations = JSON.parse(aiData.choices[0].message.content);

      return new Response(
        JSON.stringify(recommendations),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in smart-notifications:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
