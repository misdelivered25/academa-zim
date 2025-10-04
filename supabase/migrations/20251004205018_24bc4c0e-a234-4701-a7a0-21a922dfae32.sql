-- Fix remaining function search paths

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
    current_setting('request.jwt.claim.sub', true),
    current_setting('request.headers', true)::json->>'x-real-ip'
  );
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT public.has_role(auth.uid(), 'admin'::app_role)
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
begin
  insert into public.profiles (id, student_email, full_name, phone_number, avatar_url)
  values (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'phone_number',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$function$;

CREATE OR REPLACE FUNCTION public.sync_user_metadata()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
begin
  update public.profiles
  set 
    full_name   = new.raw_user_meta_data->>'full_name',
    avatar_url  = new.raw_user_meta_data->>'avatar_url'
  where id = new.id;
  return new;
end;
$function$;