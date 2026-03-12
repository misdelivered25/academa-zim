import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // User client for auth verification and user-scoped writes
    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Service role client to read quiz_questions (bypasses RLS)
    const adminClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: { user }, error: userError } = await userClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { quiz_id } = await req.json();

    if (!quiz_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required field: quiz_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch quiz details using admin client (RLS blocks non-owner reads on quiz_questions)
    const { data: quiz, error: quizError } = await adminClient
      .from('quizzes')
      .select('*, quiz_questions(id, question_text, options, points, question_type)')
      .eq('id', quiz_id)
      .single();

    if (quizError) throw quizError;

    if (!quiz) {
      return new Response(
        JSON.stringify({ error: 'Quiz not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create new quiz attempt using user client (RLS enforces user_id match)
    const { data: attempt, error: attemptError } = await userClient
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        quiz_id,
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (attemptError) throw attemptError;

    console.log(`Quiz attempt started for user ${user.id}, quiz ${quiz_id}, attempt ${attempt.id}`);

    // Return quiz WITHOUT correct_answer — already excluded from the select above
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: {
          attempt_id: attempt.id,
          quiz,
        }
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in start-quiz-attempt:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
