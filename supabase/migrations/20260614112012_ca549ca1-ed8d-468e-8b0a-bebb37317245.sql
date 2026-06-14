
-- =========================================================
-- ACADEMA ZIM — Stage 1 foundational schema
-- =========================================================

-- Shared trigger (already exists as public.update_updated_at_column)

-- ---------- UNIVERSITIES ----------
CREATE TABLE public.universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  short_name text,
  city text,
  website text,
  emergency_number text,
  primary_color text,
  secondary_color text,
  logo_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.universities TO anon, authenticated;
GRANT ALL ON public.universities TO service_role;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Universities are publicly readable" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Admins manage universities" ON public.universities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_universities_updated BEFORE UPDATE ON public.universities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- CAMPUS BUILDINGS ----------
CREATE TABLE public.campus_buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id uuid NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text,
  description text,
  latitude double precision,
  longitude double precision,
  contact text,
  hours text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.campus_buildings TO anon, authenticated;
GRANT ALL ON public.campus_buildings TO service_role;
ALTER TABLE public.campus_buildings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buildings publicly readable" ON public.campus_buildings FOR SELECT USING (true);
CREATE POLICY "Admins manage buildings" ON public.campus_buildings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_campus_buildings_uni ON public.campus_buildings(university_id);
CREATE TRIGGER trg_campus_buildings_updated BEFORE UPDATE ON public.campus_buildings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- LIBRARY RESOURCES ----------
CREATE TABLE public.library_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  url text NOT NULL,
  resource_type text,
  subject text,
  access_type text,
  university_id uuid REFERENCES public.universities(id) ON DELETE SET NULL,
  course_tag text,
  is_open_access boolean NOT NULL DEFAULT false,
  is_verified boolean NOT NULL DEFAULT false,
  is_broken boolean NOT NULL DEFAULT false,
  last_checked_at timestamptz,
  thumbnail_url text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.library_resources TO anon, authenticated;
GRANT ALL ON public.library_resources TO service_role;
ALTER TABLE public.library_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verified library resources are public" ON public.library_resources FOR SELECT
  USING (is_verified = true AND is_broken = false);
CREATE POLICY "Admins read all library resources" ON public.library_resources FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage library resources" ON public.library_resources FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_library_resources_subject ON public.library_resources(subject);
CREATE INDEX idx_library_resources_uni ON public.library_resources(university_id);
CREATE TRIGGER trg_library_resources_updated BEFORE UPDATE ON public.library_resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- LIBRARY BOOKMARKS ----------
CREATE TABLE public.library_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_id uuid NOT NULL REFERENCES public.library_resources(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, resource_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_bookmarks TO authenticated;
GRANT ALL ON public.library_bookmarks TO service_role;
ALTER TABLE public.library_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their library bookmarks" ON public.library_bookmarks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ---------- OPPORTUNITIES ----------
CREATE TABLE public.opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  opportunity_type text NOT NULL, -- scholarship | internship | attachment | competition | grant | career_event
  organization text,
  university_id uuid REFERENCES public.universities(id) ON DELETE SET NULL,
  program text,
  location text,
  deadline timestamptz,
  apply_url text,
  contact_email text,
  amount text,
  eligibility text,
  is_active boolean NOT NULL DEFAULT true,
  posted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.opportunities TO anon, authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active opportunities are public" ON public.opportunities FOR SELECT
  USING (is_active = true);
CREATE POLICY "Admins read all opportunities" ON public.opportunities FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage opportunities" ON public.opportunities FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_opportunities_type ON public.opportunities(opportunity_type);
CREATE INDEX idx_opportunities_deadline ON public.opportunities(deadline);
CREATE TRIGGER trg_opportunities_updated BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- OPPORTUNITY BOOKMARKS ----------
CREATE TABLE public.opportunity_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  opportunity_id uuid NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  remind_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, opportunity_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.opportunity_bookmarks TO authenticated;
GRANT ALL ON public.opportunity_bookmarks TO service_role;
ALTER TABLE public.opportunity_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage opportunity bookmarks" ON public.opportunity_bookmarks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ---------- STUDY PLANS ----------
CREATE TABLE public.study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  week_start date NOT NULL,
  status text NOT NULL DEFAULT 'active', -- active | archived | completed
  ai_summary text,
  source_model text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_plans TO authenticated;
GRANT ALL ON public.study_plans TO service_role;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their plans" ON public.study_plans FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_study_plans_user ON public.study_plans(user_id, week_start DESC);
CREATE TRIGGER trg_study_plans_updated BEFORE UPDATE ON public.study_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- STUDY PLAN ITEMS ----------
CREATE TABLE public.study_plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES public.study_plans(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time,
  duration_minutes integer NOT NULL DEFAULT 30,
  title text NOT NULL,
  description text,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  assignment_id uuid REFERENCES public.assignments(id) ON DELETE SET NULL,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.study_plan_items TO authenticated;
GRANT ALL ON public.study_plan_items TO service_role;
ALTER TABLE public.study_plan_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their plan items" ON public.study_plan_items FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_plan_items_plan ON public.study_plan_items(plan_id);
CREATE TRIGGER trg_plan_items_updated BEFORE UPDATE ON public.study_plan_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- ASSIGNMENT CHECKLIST ITEMS ----------
CREATE TABLE public.assignment_checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignment_checklist_items TO authenticated;
GRANT ALL ON public.assignment_checklist_items TO service_role;
ALTER TABLE public.assignment_checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their checklist items" ON public.assignment_checklist_items FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_checklist_assignment ON public.assignment_checklist_items(assignment_id);
CREATE TRIGGER trg_checklist_updated BEFORE UPDATE ON public.assignment_checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- ASSIGNMENT ATTACHMENTS ----------
CREATE TABLE public.assignment_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label text NOT NULL,
  storage_path text,
  external_url text,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assignment_attachments TO authenticated;
GRANT ALL ON public.assignment_attachments TO service_role;
ALTER TABLE public.assignment_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their assignment attachments" ON public.assignment_attachments FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ---------- COMMUNITIES ----------
CREATE TABLE public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  community_type text NOT NULL DEFAULT 'course', -- course | study_group | tutoring | general
  university_id uuid REFERENCES public.universities(id) ON DELETE SET NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  is_private boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.communities TO authenticated;
GRANT ALL ON public.communities TO service_role;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_communities_updated BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- COMMUNITY MEMBERS ----------
CREATE TABLE public.community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_role text NOT NULL DEFAULT 'member', -- owner | moderator | member
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (community_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_members TO authenticated;
GRANT ALL ON public.community_members TO service_role;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

-- Security-definer helper to avoid recursive RLS between communities and community_members
CREATE OR REPLACE FUNCTION public.is_community_member(_user uuid, _community uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_members
    WHERE user_id = _user AND community_id = _community
  );
$$;

CREATE OR REPLACE FUNCTION public.community_member_role(_user uuid, _community uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT member_role FROM public.community_members
   WHERE user_id = _user AND community_id = _community
   LIMIT 1;
$$;

CREATE POLICY "View public communities or member of private" ON public.communities FOR SELECT TO authenticated
  USING (is_private = false OR public.is_community_member(auth.uid(), id) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated create communities" ON public.communities FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners and admins update communities" ON public.communities FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Owners and admins delete communities" ON public.communities FOR DELETE TO authenticated
  USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "View memberships of accessible communities" ON public.community_members FOR SELECT TO authenticated
  USING (public.is_community_member(auth.uid(), community_id) OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users join communities" ON public.community_members FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave communities" ON public.community_members FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Moderators update memberships" ON public.community_members FOR UPDATE TO authenticated
  USING (public.community_member_role(auth.uid(), community_id) IN ('owner','moderator') OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.community_member_role(auth.uid(), community_id) IN ('owner','moderator') OR public.has_role(auth.uid(), 'admin'::app_role));

-- ---------- COMMUNITY POSTS ----------
CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  tags text[] DEFAULT '{}',
  is_pinned boolean NOT NULL DEFAULT false,
  is_locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT ALL ON public.community_posts TO service_role;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read posts in accessible communities" ON public.community_posts FOR SELECT TO authenticated
  USING (
    public.is_community_member(auth.uid(), community_id)
    OR EXISTS (SELECT 1 FROM public.communities c WHERE c.id = community_id AND c.is_private = false)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );
CREATE POLICY "Members create posts" ON public.community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id AND public.is_community_member(auth.uid(), community_id));
CREATE POLICY "Authors and moderators update posts" ON public.community_posts FOR UPDATE TO authenticated
  USING (auth.uid() = author_id
         OR public.community_member_role(auth.uid(), community_id) IN ('owner','moderator')
         OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = author_id
         OR public.community_member_role(auth.uid(), community_id) IN ('owner','moderator')
         OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authors and moderators delete posts" ON public.community_posts FOR DELETE TO authenticated
  USING (auth.uid() = author_id
         OR public.community_member_role(auth.uid(), community_id) IN ('owner','moderator')
         OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_posts_community ON public.community_posts(community_id, created_at DESC);
CREATE TRIGGER trg_posts_updated BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- COMMUNITY POST REPLIES ----------
CREATE TABLE public.community_post_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  parent_reply_id uuid REFERENCES public.community_post_replies(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_post_replies TO authenticated;
GRANT ALL ON public.community_post_replies TO service_role;
ALTER TABLE public.community_post_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read replies in accessible communities" ON public.community_post_replies FOR SELECT TO authenticated
  USING (
    public.is_community_member(auth.uid(), community_id)
    OR EXISTS (SELECT 1 FROM public.communities c WHERE c.id = community_id AND c.is_private = false)
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );
CREATE POLICY "Members reply" ON public.community_post_replies FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id AND public.is_community_member(auth.uid(), community_id));
CREATE POLICY "Authors and moderators update replies" ON public.community_post_replies FOR UPDATE TO authenticated
  USING (auth.uid() = author_id
         OR public.community_member_role(auth.uid(), community_id) IN ('owner','moderator')
         OR public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (auth.uid() = author_id
         OR public.community_member_role(auth.uid(), community_id) IN ('owner','moderator')
         OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authors and moderators delete replies" ON public.community_post_replies FOR DELETE TO authenticated
  USING (auth.uid() = author_id
         OR public.community_member_role(auth.uid(), community_id) IN ('owner','moderator')
         OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE INDEX idx_replies_post ON public.community_post_replies(post_id, created_at);
CREATE TRIGGER trg_replies_updated BEFORE UPDATE ON public.community_post_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- CONTENT REPORTS ----------
CREATE TABLE public.content_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type text NOT NULL, -- post | reply | user | resource
  target_id uuid NOT NULL,
  reason text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'pending', -- pending | reviewed | resolved | dismissed
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.content_reports TO authenticated;
GRANT ALL ON public.content_reports TO service_role;
ALTER TABLE public.content_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users submit reports" ON public.content_reports FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);
CREATE POLICY "Reporters see their reports" ON public.content_reports FOR SELECT TO authenticated
  USING (auth.uid() = reporter_id OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins resolve reports" ON public.content_reports FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins delete reports" ON public.content_reports FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ---------- ANNOUNCEMENTS ----------
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body text NOT NULL,
  audience text NOT NULL DEFAULT 'all', -- all | university | course
  university_id uuid REFERENCES public.universities(id) ON DELETE SET NULL,
  course_id uuid REFERENCES public.courses(id) ON DELETE SET NULL,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated read published announcements" ON public.announcements FOR SELECT TO authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins manage announcements" ON public.announcements FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));
CREATE TRIGGER trg_announcements_updated BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------- PUSH SUBSCRIPTIONS ----------
CREATE TABLE public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth_key text NOT NULL,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, endpoint)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.push_subscriptions TO authenticated;
GRANT ALL ON public.push_subscriptions TO service_role;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage their push subscriptions" ON public.push_subscriptions FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_push_updated BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
