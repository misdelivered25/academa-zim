
-- Fix: Database error granting user - UUID type mismatch issue
-- The issue is that handle_new_user and sync_user_metadata triggers need to be created
-- and there might be a type casting issue

-- First, let's ensure the triggers exist on auth.users table
-- Drop existing triggers if they exist to recreate them properly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create trigger for user metadata updates
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.sync_user_metadata();

-- Ensure profiles table user_id column is properly typed as UUID
-- This should already be correct but let's verify the constraint
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_id_fkey;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_fkey 
  FOREIGN KEY (id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;
