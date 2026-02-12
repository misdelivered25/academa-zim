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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { quiz_id, answers, attempt_id } = await req.json();

    if (!quiz_id || !answers) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: quiz_id and answers' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch quiz questions to validate answers and calculate score
    const { data: questions, error: questionsError } = await supabaseClient
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz_id);

    if (questionsError) throw questionsError;

    if (!questions || questions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No questions found for this quiz' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate score
    let score = 0;
    let totalPoints = 0;
    const gradedAnswers = answers.map((answer: any) => {
      const question = questions.find(q => q.id === answer.question_id);
      if (!question) return { ...answer, is_correct: false, points_earned: 0 };

      const isCorrect = answer.selected_answer === question.correct_answer;
      const pointsEarned = isCorrect ? (question.points || 1) : 0;
      
      score += pointsEarned;
      totalPoints += (question.points || 1);

      return {
        ...answer,
        is_correct: isCorrect,
        correct_answer: question.correct_answer,
        points_earned: pointsEarned,
      };
    });

    const now = new Date().toISOString();

    let result;
    if (attempt_id) {
      // Update existing attempt
      const { data: existingAttempt } = await supabaseClient
        .from('quiz_attempts')
        .select('started_at')
        .eq('id', attempt_id)
        .single();

      const timeSpent = existingAttempt?.started_at 
        ? Math.round((new Date(now).getTime() - new Date(existingAttempt.started_at).getTime()) / 60000)
        : 0;

      const { data, error } = await supabaseClient
        .from('quiz_attempts')
        .update({
          status: 'completed',
          score,
          total_points: totalPoints,
          answers: gradedAnswers,
          completed_at: now,
          time_spent_minutes: timeSpent,
          updated_at: now,
        })
        .eq('id', attempt_id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new attempt
      const { data, error } = await supabaseClient
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id,
          status: 'completed',
          score,
          total_points: totalPoints,
          answers: gradedAnswers,
          started_at: now,
          completed_at: now,
          time_spent_minutes: 0,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

    console.log(`Quiz submitted for user ${user.id}, quiz ${quiz_id}, score: ${score}/${totalPoints} (${percentage}%)`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result,
        score,
        total_points: totalPoints,
        percentage,
        passed: percentage >= 50, // Assuming 50% is passing score
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in submit-quiz:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
