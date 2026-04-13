
-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  department text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  completed_modules text[] NOT NULL DEFAULT '{}',
  badges text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabla de intentos de quiz (answers como JSONB)
CREATE TABLE public.quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  module_id text NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]',
  total_points integer NOT NULL DEFAULT 0,
  average_time double precision NOT NULL DEFAULT 0,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(profile_id, module_id)
);

-- RLS: permitir acceso público (app interna sin Supabase Auth)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to quiz_attempts" ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);

-- Habilitar realtime para rankings en vivo
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
