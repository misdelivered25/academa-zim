-- Revoke PUBLIC EXECUTE on SECURITY DEFINER functions to prevent anonymous callers
REVOKE EXECUTE ON FUNCTION public.audit_table_changes() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.sync_user_metadata() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.rls_auto_enable() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.increment_library_views(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.increment_library_downloads(uuid) FROM PUBLIC, anon;

-- Re-grant the RPC helpers to authenticated callers only (used by client app)
GRANT EXECUTE ON FUNCTION public.increment_library_views(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_library_downloads(uuid) TO authenticated;