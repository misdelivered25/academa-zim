import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { assignment_id, status, progress_percentage, notes } = await req.json();

    if (!assignment_id || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: assignment_id and status' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate status
    const validStatuses = ['not_started', 'in_progress', 'submitted', 'completed'];
    if (!validStatuses.includes(status)) {
      return new Response(
        JSON.stringify({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if progress record exists
    const { data: existing } = await supabaseClient
      .from('assignment_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('assignment_id', assignment_id)
      .single();

    const now = new Date().toISOString();
    const updateData: any = {
      status,
      progress_percentage: progress_percentage ?? existing?.progress_percentage ?? 0,
      notes: notes ?? existing?.notes,
      updated_at: now,
    };

    // Set timestamps based on status
    if (status === 'in_progress' && !existing?.started_at) {
      updateData.started_at = now;
    }
    if (status === 'submitted' && !existing?.submitted_at) {
      updateData.submitted_at = now;
    }
    if (status === 'completed' && !existing?.completed_at) {
      updateData.completed_at = now;
      updateData.progress_percentage = 100;
    }

    let result;
    if (existing) {
      // Update existing record
      const { data, error } = await supabaseClient
        .from('assignment_progress')
        .update(updateData)
        .eq('user_id', user.id)
        .eq('assignment_id', assignment_id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Insert new record
      const { data, error } = await supabaseClient
        .from('assignment_progress')
        .insert({
          user_id: user.id,
          assignment_id,
          ...updateData,
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    console.log(`Assignment progress updated for user ${user.id}, assignment ${assignment_id}, status: ${status}`);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in update-assignment-progress:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
