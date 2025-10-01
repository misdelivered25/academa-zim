-- Create quizzes table
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  total_questions INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  passing_score INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create quiz questions table
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')) DEFAULT 'multiple_choice',
  correct_answer TEXT NOT NULL,
  options JSONB,
  points INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create library/study materials table
CREATE TABLE IF NOT EXISTS public.library_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  type TEXT CHECK (type IN ('document', 'video', 'article', 'documentary')) NOT NULL,
  url TEXT,
  file_path TEXT,
  author TEXT,
  subject TEXT,
  university TEXT,
  uploaded_by UUID REFERENCES profiles(id),
  views INTEGER DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Zimbabwe universities courses catalog
CREATE TABLE IF NOT EXISTS public.zim_university_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_name TEXT NOT NULL,
  course_code TEXT,
  course_name TEXT NOT NULL,
  faculty TEXT,
  department TEXT,
  level TEXT CHECK (level IN ('undergraduate', 'postgraduate', 'diploma', 'certificate')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create assignment templates table
CREATE TABLE IF NOT EXISTS public.assignment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_hours NUMERIC,
  description TEXT,
  subject TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create study reminders table
CREATE TABLE IF NOT EXISTS public.study_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  reminder_type TEXT CHECK (reminder_type IN ('study_session', 'assignment_due', 'quiz_scheduled', 'custom')) NOT NULL,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT,
  is_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Add AI review fields to assignments
ALTER TABLE public.assignments
ADD COLUMN IF NOT EXISTS difficulty_rating TEXT CHECK (difficulty_rating IN ('easy', 'medium', 'hard')),
ADD COLUMN IF NOT EXISTS estimated_hours NUMERIC,
ADD COLUMN IF NOT EXISTS ai_analysis JSONB,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Enable RLS
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zim_university_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for quizzes
CREATE POLICY "Users can manage their own quizzes"
ON public.quizzes FOR ALL
USING (auth.uid() = user_id);

-- RLS Policies for quiz questions
CREATE POLICY "Users can view quiz questions for their quizzes"
ON public.quiz_questions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = quiz_questions.quiz_id
    AND quizzes.user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage quiz questions for their quizzes"
ON public.quiz_questions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.quizzes
    WHERE quizzes.id = quiz_questions.quiz_id
    AND quizzes.user_id = auth.uid()
  )
);

-- RLS Policies for library items
CREATE POLICY "Anyone can view public library items"
ON public.library_items FOR SELECT
USING (is_public = true OR uploaded_by = auth.uid());

CREATE POLICY "Authenticated users can upload library items"
ON public.library_items FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own library items"
ON public.library_items FOR UPDATE
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own library items"
ON public.library_items FOR DELETE
USING (auth.uid() = uploaded_by);

-- RLS Policies for zim university courses (public read)
CREATE POLICY "Anyone can view university courses"
ON public.zim_university_courses FOR SELECT
USING (true);

-- RLS Policies for assignment templates (public read)
CREATE POLICY "Anyone can view assignment templates"
ON public.assignment_templates FOR SELECT
USING (true);

-- RLS Policies for study reminders
CREATE POLICY "Users can manage their own reminders"
ON public.study_reminders FOR ALL
USING (auth.uid() = user_id);

-- Insert sample Zimbabwe universities and courses
INSERT INTO public.zim_university_courses (university_name, course_code, course_name, faculty, department, level, description) VALUES
-- University of Zimbabwe
('University of Zimbabwe', 'ECON101', 'Introduction to Economics', 'Commerce', 'Economics', 'undergraduate', 'Fundamental principles of micro and macroeconomics'),
('University of Zimbabwe', 'LAW101', 'Introduction to Law', 'Law', 'Law', 'undergraduate', 'Basic principles of Zimbabwean law'),
('University of Zimbabwe', 'MED101', 'Human Anatomy', 'Medicine', 'Medicine', 'undergraduate', 'Study of human body structure'),
('University of Zimbabwe', 'ENG101', 'Engineering Mathematics', 'Engineering', 'Engineering', 'undergraduate', 'Mathematical principles for engineering'),
('University of Zimbabwe', 'COMP101', 'Introduction to Computer Science', 'Science', 'Computer Science', 'undergraduate', 'Fundamentals of programming and algorithms'),

-- National University of Science and Technology (NUST)
('NUST', 'IT201', 'Software Engineering', 'Technology', 'Information Technology', 'undergraduate', 'Software development lifecycle and practices'),
('NUST', 'ENG201', 'Structural Engineering', 'Engineering', 'Civil Engineering', 'undergraduate', 'Design and analysis of structures'),
('NUST', 'BUS101', 'Business Management', 'Commerce', 'Business', 'undergraduate', 'Principles of business and management'),
('NUST', 'TECH101', 'Industrial Technology', 'Technology', 'Industrial Technology', 'undergraduate', 'Manufacturing and industrial processes'),
('NUST', 'APSC101', 'Applied Sciences', 'Science', 'Applied Sciences', 'undergraduate', 'Practical applications of scientific principles'),

-- Midlands State University
('Midlands State University', 'COMM101', 'Mass Communication', 'Arts', 'Media Studies', 'undergraduate', 'Introduction to media and communication'),
('Midlands State University', 'ACC101', 'Financial Accounting', 'Commerce', 'Accounting', 'undergraduate', 'Basic accounting principles and practices'),
('Midlands State University', 'EDU101', 'Education Studies', 'Education', 'Education', 'undergraduate', 'Teaching methods and educational theory'),
('Midlands State University', 'DEV101', 'Development Studies', 'Social Sciences', 'Development Studies', 'undergraduate', 'Economic and social development'),
('Midlands State University', 'MINE101', 'Mining Engineering', 'Engineering', 'Mining', 'undergraduate', 'Mining operations and safety'),

-- Africa University
('Africa University', 'THEO101', 'Theology Studies', 'Theology', 'Theology', 'undergraduate', 'Religious and theological studies'),
('Africa University', 'AGR101', 'Agricultural Science', 'Agriculture', 'Agriculture', 'undergraduate', 'Modern farming techniques'),
('Africa University', 'HEALTH101', 'Public Health', 'Health Sciences', 'Public Health', 'undergraduate', 'Community health and wellness'),
('Africa University', 'BIO101', 'Biology', 'Science', 'Biological Sciences', 'undergraduate', 'Life sciences and biology'),
('Africa University', 'PEACE101', 'Peace Studies', 'Social Sciences', 'Peace & Governance', 'undergraduate', 'Conflict resolution and peacebuilding'),

-- Chinhoyi University of Technology
('Chinhoyi University of Technology', 'HOSP101', 'Hospitality Management', 'Hospitality', 'Hospitality', 'undergraduate', 'Hotel and tourism management'),
('Chinhoyi University of Technology', 'ENV101', 'Environmental Science', 'Science', 'Environmental Science', 'undergraduate', 'Environmental conservation and management'),
('Chinhoyi University of Technology', 'WILD101', 'Wildlife Management', 'Science', 'Wildlife', 'undergraduate', 'Conservation and wildlife management'),
('Chinhoyi University of Technology', 'CHEM101', 'Industrial Chemistry', 'Science', 'Chemistry', 'undergraduate', 'Chemical processes and applications'),
('Chinhoyi University of Technology', 'MATHS101', 'Mathematics', 'Science', 'Mathematics', 'undergraduate', 'Pure and applied mathematics');

-- Insert sample assignment templates
INSERT INTO public.assignment_templates (title, category, difficulty, estimated_hours, description, subject) VALUES
('Essay Writing', 'Written Assignment', 'medium', 3, 'Analytical essay on given topic', 'General'),
('Research Paper', 'Research', 'hard', 15, 'Comprehensive research with citations', 'General'),
('Lab Report', 'Practical', 'medium', 4, 'Scientific experiment documentation', 'Science'),
('Case Study Analysis', 'Analysis', 'hard', 6, 'Detailed case study evaluation', 'Business'),
('Problem Set', 'Practice', 'medium', 2, 'Mathematical or logical problems', 'Mathematics'),
('Book Review', 'Written Assignment', 'easy', 2, 'Critical review of assigned reading', 'Literature'),
('Presentation', 'Oral', 'medium', 5, 'Multimedia presentation preparation', 'General'),
('Group Project', 'Collaborative', 'hard', 20, 'Team-based project work', 'General'),
('Quiz Preparation', 'Study', 'easy', 1, 'Prepare for upcoming quiz', 'General'),
('Final Exam Review', 'Study', 'hard', 10, 'Comprehensive exam preparation', 'General');

-- Insert sample library items
INSERT INTO public.library_items (title, description, category, type, url, author, subject, university, is_public) VALUES
('Introduction to Zimbabwean History', 'Comprehensive overview of Zimbabwe''s history from pre-colonial to modern times', 'History', 'document', 'https://example.com/zim-history', 'Prof. T. Ranger', 'History', 'University of Zimbabwe', true),
('Mathematics for Engineers', 'Essential mathematical concepts for engineering students', 'Mathematics', 'document', 'https://example.com/eng-math', 'Dr. J. Mpofu', 'Mathematics', 'NUST', true),
('African Economics Documentary', 'Documentary on economic development in Africa', 'Economics', 'documentary', 'https://example.com/africa-econ', 'Various', 'Economics', 'General', true),
('Computer Science Fundamentals', 'Basic programming and algorithm concepts', 'Computer Science', 'article', 'https://example.com/cs-basics', 'Prof. S. Chimedza', 'Computer Science', 'University of Zimbabwe', true),
('Zimbabwean Literature Collection', 'Selected works from Zimbabwean authors', 'Literature', 'document', 'https://example.com/zim-lit', 'Various Authors', 'Literature', 'General', true);

-- Create function to increment library item views
CREATE OR REPLACE FUNCTION increment_library_views(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.library_items
  SET views = views + 1
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment library item downloads
CREATE OR REPLACE FUNCTION increment_library_downloads(item_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.library_items
  SET downloads = downloads + 1
  WHERE id = item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;