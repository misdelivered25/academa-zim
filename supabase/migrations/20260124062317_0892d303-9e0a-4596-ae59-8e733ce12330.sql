-- Fix function search_path security issues
-- Set search_path for all functions that are missing it

-- Fix handle_new_user function
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

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix increment_library_views function
CREATE OR REPLACE FUNCTION public.increment_library_views(item_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.library_items 
  SET views = COALESCE(views, 0) + 1 
  WHERE id = item_id;
END;
$function$;

-- Fix increment_library_downloads function
CREATE OR REPLACE FUNCTION public.increment_library_downloads(item_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  UPDATE public.library_items 
  SET downloads = COALESCE(downloads, 0) + 1 
  WHERE id = item_id;
END;
$function$;