-- Drop the overly broad policy that lets any authenticated user read quiz answers
DROP POLICY IF EXISTS "Allow read access for authenticated users" ON public.quiz_questions;

-- Drop redundant duplicate SELECT policies
DROP POLICY IF EXISTS "Users can view questions for their own quizzes" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can view quiz questions for their quizzes" ON public.quiz_questions;