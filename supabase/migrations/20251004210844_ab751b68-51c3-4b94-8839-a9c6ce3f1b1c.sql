-- Fix: UUID type casting issue in audit_table_changes function
-- The function was trying to insert TEXT into UUID column causing login failures

CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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
    -- FIX: Cast the JWT claim to UUID instead of using TEXT
    CASE 
      WHEN current_setting('request.jwt.claim.sub', true) IS NOT NULL 
      THEN current_setting('request.jwt.claim.sub', true)::uuid
      ELSE NULL 
    END,
    current_setting('request.headers', true)::json->>'x-real-ip'
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$;