-- Fix increment_library_views: only allow incrementing public items or items owned by caller
CREATE OR REPLACE FUNCTION public.increment_library_views(item_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.library_items 
  SET views = COALESCE(views, 0) + 1 
  WHERE id = item_id
    AND (is_public = true OR uploaded_by = auth.uid());
END;
$$;

-- Fix increment_library_downloads: only allow incrementing public items or items owned by caller
CREATE OR REPLACE FUNCTION public.increment_library_downloads(item_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.library_items 
  SET downloads = COALESCE(downloads, 0) + 1 
  WHERE id = item_id
    AND (is_public = true OR uploaded_by = auth.uid());
END;
$$;