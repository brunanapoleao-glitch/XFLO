/*
# XFLO institutional site: settings, portfolio, testimonials and admin access

Plain-English summary: creates everything the public website and the private admin panel need. Visitors can read the content; only the signed-in administrator can change it.

1. New Tables
- `admins`: lists which authentication account is the site administrator (one row per admin).
- `settings`: single-row table with WhatsApp number, Instagram link, and "starting at" prices for websites and invitations.
- `portfolio`: projects shown in the portfolio (title, type, image URL, display order, created date).
- `depoimentos`: client testimonials (client name, text, rating from 1 to 5, created date).

2. Storage
- Public bucket `portfolio` for project images. Anyone can view files; only the administrator can upload, replace or delete them.

3. Security
- Row Level Security is enabled on every table.
- Public content (settings, portfolio, testimonials) can be read by anyone, including visitors who are not signed in.
- Only the administrator can insert, update or delete portfolio and testimonial rows, and update settings.
- `admins` has no direct access; it is only read through secure functions.
- `is_admin()` checks whether the current signed-in user is an administrator.
- `claim_admin()` registers the first signed-in account as administrator when no administrator exists yet. After that it does nothing.
- `admin_exists()` tells the login page whether an administrator has already been set up.

4. Important notes
- 4.1 The first account created through the admin page becomes the administrator. Create it before sharing the site.
- 4.2 All statements are idempotent, so this migration can be safely re-applied.
*/

CREATE TABLE IF NOT EXISTS admins (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  criado_em timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

REVOKE EXECUTE ON FUNCTION is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

CREATE OR REPLACE FUNCTION admin_exists()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.admins);
$$;

REVOKE EXECUTE ON FUNCTION admin_exists() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION admin_exists() TO anon, authenticated;

CREATE OR REPLACE FUNCTION claim_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid := auth.uid();
BEGIN
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;

  INSERT INTO public.admins (user_id)
  SELECT current_user_id
  WHERE NOT EXISTS (SELECT 1 FROM public.admins);

  RETURN EXISTS (SELECT 1 FROM public.admins WHERE user_id = current_user_id);
END;
$$;

REVOKE EXECUTE ON FUNCTION claim_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION claim_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS settings (
  id smallint PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  whatsapp text NOT NULL DEFAULT '[SEU NÚMERO]',
  instagram text NOT NULL DEFAULT '',
  preco_site numeric(10,2) NOT NULL DEFAULT 249.99,
  preco_convite numeric(10,2) NOT NULL DEFAULT 9.99
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON settings TO anon, authenticated;
GRANT UPDATE (whatsapp, instagram, preco_site, preco_convite) ON settings TO authenticated;

DROP POLICY IF EXISTS "settings_select_public" ON settings;
CREATE POLICY "settings_select_public" ON settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "settings_update_admin" ON settings;
CREATE POLICY "settings_update_admin" ON settings FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE TABLE IF NOT EXISTS portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  tipo text NOT NULL,
  imagem_url text NOT NULL,
  ordem integer NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS portfolio_ordem_idx ON portfolio (ordem);

ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON portfolio TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON portfolio TO authenticated;

DROP POLICY IF EXISTS "portfolio_select_public" ON portfolio;
CREATE POLICY "portfolio_select_public" ON portfolio FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "portfolio_insert_admin" ON portfolio;
CREATE POLICY "portfolio_insert_admin" ON portfolio FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "portfolio_update_admin" ON portfolio;
CREATE POLICY "portfolio_update_admin" ON portfolio FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "portfolio_delete_admin" ON portfolio;
CREATE POLICY "portfolio_delete_admin" ON portfolio FOR DELETE
  TO authenticated USING (is_admin());

CREATE TABLE IF NOT EXISTS depoimentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  texto text NOT NULL,
  nota smallint NOT NULL CHECK (nota BETWEEN 1 AND 5),
  criado_em timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE depoimentos ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON depoimentos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON depoimentos TO authenticated;

DROP POLICY IF EXISTS "depoimentos_select_public" ON depoimentos;
CREATE POLICY "depoimentos_select_public" ON depoimentos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "depoimentos_insert_admin" ON depoimentos;
CREATE POLICY "depoimentos_insert_admin" ON depoimentos FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "depoimentos_update_admin" ON depoimentos;
CREATE POLICY "depoimentos_update_admin" ON depoimentos FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "depoimentos_delete_admin" ON depoimentos;
CREATE POLICY "depoimentos_delete_admin" ON depoimentos FOR DELETE
  TO authenticated USING (is_admin());

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "portfolio_files_admin_select" ON storage.objects;
CREATE POLICY "portfolio_files_admin_select" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'portfolio' AND is_admin());

DROP POLICY IF EXISTS "portfolio_files_admin_insert" ON storage.objects;
CREATE POLICY "portfolio_files_admin_insert" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'portfolio' AND is_admin());

DROP POLICY IF EXISTS "portfolio_files_admin_update" ON storage.objects;
CREATE POLICY "portfolio_files_admin_update" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'portfolio' AND is_admin())
  WITH CHECK (bucket_id = 'portfolio' AND is_admin());

DROP POLICY IF EXISTS "portfolio_files_admin_delete" ON storage.objects;
CREATE POLICY "portfolio_files_admin_delete" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'portfolio' AND is_admin());
