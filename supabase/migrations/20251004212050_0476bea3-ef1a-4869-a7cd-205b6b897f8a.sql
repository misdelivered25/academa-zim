-- Fix: Cast ip_address to inet type in audit_table_changes function
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
    CASE 
      WHEN current_setting('request.jwt.claim.sub', true) IS NOT NULL 
      THEN current_setting('request.jwt.claim.sub', true)::uuid
      ELSE NULL 
    END,
    -- FIX: Cast the IP address from TEXT to INET
    CASE 
      WHEN current_setting('request.headers', true)::json->>'x-real-ip' IS NOT NULL
      THEN (current_setting('request.headers', true)::json->>'x-real-ip')::inet
      ELSE NULL
    END
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$;