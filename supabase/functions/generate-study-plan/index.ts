import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Per-isolate rate limiter — 10 plan generations / hour / user
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 10;
const WINDOW_MS = 60 * 60 * 1000;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= MAX_REQUESTS;
}

function isoDay(weekStart: string, dayOfWeek: number): string {
  const d = new Date(weekStart);
  d.setDate(d.getDate() + dayOfWeek);
  return d.toISOString().slice(0, 10);
}

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      token,
    );
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Try again in an hour.",
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = await req.json().catch(() => ({}));
    const weekStart: string =
      body?.weekStart ?? new Date().toISOString().slice(0, 10);
    const focusNotes: string =
      typeof body?.focusNotes === "string" ? body.focusNotes.slice(0, 1000) : "";

    // Load user's academic context (RLS scopes everything to this user)
    const [coursesRes, assignmentsRes, sessionsRes] = await Promise.all([
      supabase.from("courses").select("id, course_name, semester"),
      supabase
        .from("assignments")
        .select("id, title, due_date, status, course_id")
        .neq("status", "completed")
        .order("due_date", { ascending: true })
        .limit(20),
      supabase
        .from("study_sessions")
        .select("course_id, hours, session_date")
        .order("session_date", { ascending: false })
        .limit(30),
    ]);

    const courses = coursesRes.data ?? [];
    const assignments = assignmentsRes.data ?? [];
    const sessions = sessionsRes.data ?? [];

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const context = {
      weekStart,
      focusNotes,
      courses: courses.map((c) => ({ id: c.id, name: c.course_name })),
      pendingAssignments: assignments.map((a) => ({
        id: a.id,
        title: a.title,
        due_date: a.due_date,
        course_id: a.course_id,
      })),
      recentHoursByCourse: sessions.reduce<Record<string, number>>((acc, s) => {
        const k = s.course_id ?? "none";
        acc[k] = (acc[k] ?? 0) + (s.hours ?? 0);
        return acc;
      }, {}),
    };

    const aiResp = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
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
              content:
                "You are a study planner for Zimbabwean university students. Create a realistic weekly study plan tailored to the student's courses, pending assignments, and study history. Spread sessions across days, prioritize urgent assignments, and balance courses that have had less recent study time. Each session should be 25-90 minutes.",
            },
            {
              role: "user",
              content: `Generate a weekly study plan starting ${weekStart}.\n\nContext:\n${
                JSON.stringify(context, null, 2)
              }`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "create_study_plan",
                description: "Create a structured weekly study plan",
                parameters: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    summary: {
                      type: "string",
                      description: "Brief overview of the strategy",
                    },
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          day_of_week: {
                            type: "integer",
                            description:
                              "0 = Sunday, 1 = Monday ... 6 = Saturday",
                          },
                          start_time: {
                            type: "string",
                            description: "HH:MM 24h, e.g. 18:00",
                          },
                          duration_minutes: { type: "integer" },
                          title: { type: "string" },
                          description: { type: "string" },
                          course_id: { type: "string" },
                          assignment_id: { type: "string" },
                        },
                        required: [
                          "day_of_week",
                          "duration_minutes",
                          "title",
                        ],
                      },
                    },
                  },
                  required: ["title", "summary", "items"],
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "create_study_plan" },
          },
        }),
      },
    );

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI rate limit. Try again soon." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      if (aiResp.status === 402) {
        return new Response(
          JSON.stringify({
            error: "AI credits depleted. Please add credits.",
          }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      const txt = await aiResp.text();
      console.error("AI gateway error", aiResp.status, txt);
      throw new Error("AI gateway error");
    }

    const data = await aiResp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("AI returned no plan");
    }
    const parsed = JSON.parse(toolCall.function.arguments) as {
      title: string;
      summary: string;
      items: Array<{
        day_of_week: number;
        start_time?: string;
        duration_minutes: number;
        title: string;
        description?: string;
        course_id?: string;
        assignment_id?: string;
      }>;
    };

    // Validate references against the user's actual data (defence in depth)
    const validCourseIds = new Set(courses.map((c) => c.id));
    const validAssignmentIds = new Set(assignments.map((a) => a.id));

    // Persist plan + items under user's auth (RLS enforces ownership)
    const { data: plan, error: planErr } = await supabase
      .from("study_plans")
      .insert({
        user_id: user.id,
        title: parsed.title?.slice(0, 200) || "Weekly study plan",
        week_start: weekStart,
        ai_summary: parsed.summary?.slice(0, 2000) ?? null,
        source_model: "google/gemini-2.5-flash",
      })
      .select()
      .single();
    if (planErr || !plan) throw planErr ?? new Error("Plan insert failed");

    const itemsToInsert = (parsed.items ?? []).slice(0, 50).map((it, i) => ({
      plan_id: plan.id,
      user_id: user.id,
      day_of_week: Math.max(0, Math.min(6, Number(it.day_of_week) || 0)),
      start_time: it.start_time ?? null,
      duration_minutes: Math.max(
        10,
        Math.min(240, Number(it.duration_minutes) || 30),
      ),
      title: String(it.title).slice(0, 200),
      description: it.description?.slice(0, 1000) ?? null,
      course_id: it.course_id && validCourseIds.has(it.course_id)
        ? it.course_id
        : null,
      assignment_id:
        it.assignment_id && validAssignmentIds.has(it.assignment_id)
          ? it.assignment_id
          : null,
      position: i,
    }));

    if (itemsToInsert.length) {
      const { error: itemsErr } = await supabase
        .from("study_plan_items")
        .insert(itemsToInsert);
      if (itemsErr) throw itemsErr;
    }

    return new Response(
      JSON.stringify({ plan_id: plan.id, summary: parsed.summary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-study-plan error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
