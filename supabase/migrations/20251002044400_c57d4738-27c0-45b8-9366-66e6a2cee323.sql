-- Fix function search_path issues and enable RLS on all tables

-- Fix search_path for check_rate_limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(max_requests integer, window_minutes integer)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Fix search_path for audit_table_changes function
CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO security_audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    user_id,
    ip_address
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
    current_setting('request.jwt.claim.sub', true),
    current_setting('request.headers', true)::json->>'x-real-ip'
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$;

-- Fix search_path for update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$;

-- Enable RLS on api_limits
ALTER TABLE public.api_limits ENABLE ROW LEVEL SECURITY;

-- Enable RLS on security_audit_log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for api_limits
CREATE POLICY "Users can view their own rate limits"
ON public.api_limits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage rate limits"
ON public.api_limits FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for security_audit_log (admin only)
CREATE POLICY "Admins can view all audit logs"
ON public.security_audit_log FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policies for user data management
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all courses"
ON public.courses FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all assignments"
ON public.assignments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all quizzes"
ON public.quizzes FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all study sessions"
ON public.study_sessions FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all study reminders"
ON public.study_reminders FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all study reminders"
ON public.study_reminders FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));