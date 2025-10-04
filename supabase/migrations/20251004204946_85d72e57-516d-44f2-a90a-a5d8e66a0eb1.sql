-- Fix Critical Security Issues

-- 1. Fix api_limits RLS policy to prevent rate limit manipulation
DROP POLICY IF EXISTS "System can manage rate limits" ON api_limits;

CREATE POLICY "Service role can manage rate limits" 
ON api_limits 
FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 2. Fix quiz_questions overly permissive policy that exposes answers
DROP POLICY IF EXISTS "Users can view quiz questions" ON quiz_questions;

-- Users should only view questions for quizzes they own
CREATE POLICY "Users can view questions for their own quizzes" 
ON quiz_questions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM quizzes 
    WHERE quizzes.id = quiz_questions.quiz_id 
    AND quizzes.user_id = auth.uid()
  )
);

-- 3. Fix function search paths for security
CREATE OR REPLACE FUNCTION public.increment_library_views(item_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.library_items
  SET views = views + 1
  WHERE id = item_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_library_downloads(item_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.library_items
  SET downloads = downloads + 1
  WHERE id = item_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.check_rate_limit(max_requests integer, window_minutes integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO api_limits (user_id, endpoint)
  VALUES (auth.uid(), current_setting('app.current_endpoint', TRUE))
  ON CONFLICT (user_id, endpoint) 
  DO UPDATE SET 
    request_count = CASE 
      WHEN api_limits.last_request > NOW() - (window_minutes || ' minutes')::INTERVAL
      THEN api_limits.request_count + 1
      ELSE 1
    END,
    last_request = NOW()
  WHERE api_limits.user_id = auth.uid();
  
  RETURN (
    SELECT request_count <= max_requests 
    FROM api_limits 
    WHERE user_id = auth.uid() 
    AND endpoint = current_setting('app.current_endpoint', TRUE)
  );
END;
$function$;