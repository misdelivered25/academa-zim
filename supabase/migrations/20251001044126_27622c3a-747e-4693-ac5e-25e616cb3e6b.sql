-- Fix search_path for library functions
CREATE OR REPLACE FUNCTION increment_library_views(item_id UUID)
RETURNS VOID 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.library_items
  SET views = views + 1
  WHERE id = item_id;
END;
$$;

CREATE OR REPLACE FUNCTION increment_library_downloads(item_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.library_items
  SET downloads = downloads + 1
  WHERE id = item_id;
END;
$$;