-- Sample Zimbabwe courses data
-- These are common courses in Zimbabwean O-Level and A-Level curriculum

-- Note: This migration will insert sample courses that users can use as templates
-- Users should replace these with their actual enrolled courses

-- Insert sample O-Level courses
INSERT INTO public.courses (course_name, semester, user_id) 
SELECT 
  course_name,
  'Current Semester' as semester,
  auth.uid() as user_id
FROM (
  VALUES 
    ('Mathematics'),
    ('English Language'),
    ('English Literature'),
    ('Physical Science'),
    ('Biology'),
    ('Chemistry'),
    ('Physics'),
    ('Geography'),
    ('History'),
    ('Commerce'),
    ('Accounts'),
    ('Computer Science'),
    ('Shona'),
    ('French'),
    ('Religious Studies')
) AS sample_courses(course_name)
WHERE NOT EXISTS (
  SELECT 1 FROM public.courses WHERE user_id = auth.uid()
)
LIMIT 5;

-- Insert sample assignments for demonstration
-- These will only be inserted if the user has courses
INSERT INTO public.assignments (title, course_id, due_date, status, user_id)
SELECT 
  assignment_title,
  c.id as course_id,
  CURRENT_DATE + (row_number * 7)::integer as due_date,
  'pending' as status,
  auth.uid() as user_id
FROM (
  VALUES 
    ('Chapter Review Questions', 1),
    ('Essay Assignment', 2),
    ('Lab Report', 3),
    ('Research Project', 4),
    ('Practice Problems', 5)
) AS sample_assignments(assignment_title, row_number)
CROSS JOIN LATERAL (
  SELECT id FROM public.courses WHERE user_id = auth.uid() LIMIT 1
) c
WHERE EXISTS (
  SELECT 1 FROM public.courses WHERE user_id = auth.uid()
)
LIMIT 3;