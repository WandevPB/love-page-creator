-- Simulação da criação da tabela 'pages' no Supabase
CREATE TABLE IF NOT EXISTS public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  content text,
  created_at timestamp with time zone DEFAULT now()
);

-- Buckets de storage recomendados:
-- photos
-- music

-- Para criar no painel Supabase:
-- 1. Vá em Table Editor > New Table
-- 2. Nome: pages
-- 3. Campos: id (uuid, PK, default gen_random_uuid()), title (text), content (text), created_at (timestamp, default now())
-- 4. Crie buckets em Storage: photos, music
