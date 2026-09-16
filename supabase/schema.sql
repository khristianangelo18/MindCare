-- =============================================================================
-- MindCare Platform - Clean PostgreSQL Schema Migration for Supabase
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  fullname TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Patient' CHECK (role IN ('Patient', 'Specialist', 'Admin')),
  age INTEGER,
  gender TEXT,
  phone TEXT,
  bio TEXT,
  specialization TEXT DEFAULT 'Clinical Psychologist',
  experience TEXT DEFAULT '5 Years',
  location TEXT DEFAULT 'Metro Manila',
  avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialist_id TEXT NOT NULL,
  specialist_name TEXT,
  specialist_role TEXT,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_appointments_user ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_specialist ON public.appointments(specialist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);

-- 3. ASSESSMENTS TABLE (Mental Health Clinical Screening)
CREATE TABLE IF NOT EXISTS public.assessments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  summary TEXT NOT NULL DEFAULT '',
  orientation_0 TEXT,
  orientation_1 TEXT,
  orientation_2 TEXT,
  orientation_3 TEXT,
  orientation_4 TEXT,
  emotions_0 TEXT,
  emotions_1 TEXT,
  emotions_2 TEXT,
  emotions_3 TEXT,
  emotions_4 TEXT,
  memory_initial TEXT,
  memory_recall TEXT,
  thoughts_0 TEXT,
  thoughts_1 TEXT,
  thoughts_2 TEXT,
  thoughts_3 TEXT,
  decisions_0 TEXT,
  decisions_1 TEXT,
  decisions_2 TEXT,
  q1 INTEGER DEFAULT 0,
  q2 INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_assessments_user ON public.assessments(user_id);

-- 4. PRE_ASSESSMENTS TABLE (Public/Anonymous screening)
CREATE TABLE IF NOT EXISTS public.pre_assessments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  q1 INTEGER NOT NULL DEFAULT 0,
  q2 INTEGER NOT NULL DEFAULT 0,
  q3 INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  summary TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);

-- 6. SUPPORT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.support_messages (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. TRIGGER: Automatically create profile on auth.users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    fullname,
    email,
    role,
    age,
    gender,
    avatar_url
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'fullname', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'Patient'),
    CASE WHEN (NEW.raw_user_meta_data->>'age') ~ '^[0-9]+$' THEN (NEW.raw_user_meta_data->>'age')::INTEGER ELSE NULL END,
    NEW.raw_user_meta_data->>'gender',
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200')
  )
  ON CONFLICT (id) DO UPDATE SET
    fullname = EXCLUDED.fullname,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Appointments Policies
DROP POLICY IF EXISTS "Users and specialists can view their appointments" ON public.appointments;
CREATE POLICY "Users and specialists can view their appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid()::text = specialist_id);

DROP POLICY IF EXISTS "Patients can insert their appointments" ON public.appointments;
CREATE POLICY "Patients can insert their appointments"
  ON public.appointments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Participants can update appointment status or notes" ON public.appointments;
CREATE POLICY "Participants can update appointment status or notes"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid()::text = specialist_id);

-- Assessments Policies
DROP POLICY IF EXISTS "Users can view their own assessments" ON public.assessments;
CREATE POLICY "Users can view their own assessments"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('Specialist', 'Admin')
  ));

DROP POLICY IF EXISTS "Users can insert their own assessments" ON public.assessments;
CREATE POLICY "Users can insert their own assessments"
  ON public.assessments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Notifications Policies
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;
CREATE POLICY "Users can view their notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "System and users can insert notifications" ON public.notifications;
CREATE POLICY "System and users can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their notifications" ON public.notifications;
CREATE POLICY "Users can update their notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Pre-assessments Policies
DROP POLICY IF EXISTS "Pre-assessments readable and insertable by anyone" ON public.pre_assessments;
CREATE POLICY "Pre-assessments readable and insertable by anyone"
  ON public.pre_assessments FOR ALL
  TO authenticated, anon
  USING (true)
  WITH CHECK (true);

-- Support messages Policies
DROP POLICY IF EXISTS "Support messages insertable by anyone" ON public.support_messages;
CREATE POLICY "Support messages insertable by anyone"
  ON public.support_messages FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- 9. OPTIONAL: STORAGE BUCKET
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('avatars', 'avatars', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;
