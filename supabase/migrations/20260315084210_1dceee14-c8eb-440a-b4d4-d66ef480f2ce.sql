-- 1. Restrict profiles UPDATE to prevent self-elevation of is_admin
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND is_admin = false);

-- 2. Fix quiz_questions admin INSERT policy to use has_role()
DROP POLICY IF EXISTS "Admins can insert quiz questions" ON quiz_questions;
CREATE POLICY "Admins can insert quiz questions" ON quiz_questions
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix quiz_questions admin ALL policy to use has_role()
DROP POLICY IF EXISTS "Allow admins to manage quiz questions" ON quiz_questions;
CREATE POLICY "Allow admins to manage quiz questions" ON quiz_questions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));