-- Add updated_at column to assignments table
ALTER TABLE public.assignments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_assignments_updated_at ON public.assignments;

CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();