
-- 1. Fix privilege escalation: prevent self-promotion to admin on profile INSERT
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id AND is_admin = false);

-- 2. Revoke anon SELECT from user-scoped/private tables (RLS already restricts, but
-- removing the grant prevents GraphQL exposure and reduces attack surface)
DO $$
DECLARE t text;
DECLARE private_tables text[] := ARRAY[
  'announcements','api_limits','app_data','assignment_attachments',
  'assignment_checklist_items','assignment_progress','assignment_templates',
  'assignments','community_members','community_post_replies','community_posts',
  'content_reports','courses','library_bookmarks','library_items',
  'opportunity_bookmarks','profiles','push_subscriptions','quiz_attempts',
  'quiz_questions','quizzes','security_audit_log','study_plan_items',
  'study_plans','study_reminders','study_sessions','user_roles',
  'zim_university_courses'
];
BEGIN
  FOREACH t IN ARRAY private_tables LOOP
    EXECUTE format('REVOKE SELECT ON public.%I FROM anon', t);
  END LOOP;
END $$;

-- 3. Revoke EXECUTE on SECURITY DEFINER helper functions from anon.
-- These are only needed in RLS contexts for authenticated users.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_community_member(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.community_member_role(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_library_views(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_library_downloads(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(integer, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(integer, integer) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_community_member(uuid, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.community_member_role(uuid, uuid) FROM PUBLIC;
