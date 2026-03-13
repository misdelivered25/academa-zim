-- Fix: Make assignments.user_id NOT NULL to prevent orphaned records bypassing RLS
-- First update any existing NULL user_id rows (shouldn't exist but safety)
UPDATE public.assignments SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

-- Make column NOT NULL
ALTER TABLE public.assignments ALTER COLUMN user_id SET NOT NULL;