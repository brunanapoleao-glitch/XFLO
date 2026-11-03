/*
# Editable services and main photo

Plain-English summary: lets the administrator manage the list of services shown on the site and change the main photo at the top of the homepage from the admin panel.

1. New Tables
- `servicos`: services shown in the "Serviços" section and in the quote form (title, description, icon, pricing type, display order, created date).

2. Modified Tables
- `settings`: new column `imagem_hero` holding the address of the main homepage photo. Defaults to the photo already bundled with the site.

3. Seed data
- The five services currently shown on the site are inserted once, only if the table is empty, so nothing disappears after this change.

4. Security
- Row Level Security is enabled on `servicos`.
- Anyone (including visitors who are not signed in) can read services and the main photo address.
- Only the administrator can insert, update or delete services.
- The administrator can update the main photo column in `settings`; the existing admin-only policy on `settings` still applies.

5. Important notes
- 5.1 `tipo_preco` controls the price text: 'site' uses the website starting price, 'invite' uses the invitation starting price, 'quote' shows "Sob orçamento".
- 5.2 All statements are idempotent, so this migration can be safely re-applied.
*/

ALTER TABLE settings ADD COLUMN IF NOT EXISTS imagem_hero text NOT NULL DEFAULT '/Retrato_profissional_no_escritorio_com_foco_e_planos.png';

GRANT UPDATE (imagem_hero) ON settings TO authenticated;

CREATE TABLE IF NOT EXISTS servicos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  descricao text NOT NULL,
  icone text NOT NULL DEFAULT 'sparkles',
  tipo_preco text NOT NULL CHECK (tipo_preco IN ('site', 'invite', 'quote')),
  ordem integer NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS servicos_ordem_idx ON servicos (ordem);

ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON servicos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON servicos TO authenticated;

DROP POLICY IF EXISTS "servicos_select_public" ON servicos;
CREATE POLICY "servicos_select_public" ON servicos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "servicos_insert_admin" ON servicos;
CREATE POLICY "servicos_insert_admin" ON servicos FOR INSERT
  TO authenticated WITH CHECK (is_admin());

DROP POLICY IF EXISTS "servicos_update_admin" ON servicos;
CREATE POLICY "servicos_update_admin" ON servicos FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "servicos_delete_admin" ON servicos;
CREATE POLICY "servicos_delete_admin" ON servicos FOR DELETE
  TO authenticated USING (is_admin());

INSERT INTO servicos (titulo, descricao, icone, tipo_preco, ordem)
SELECT v.titulo, v.descricao, v.icone, v.tipo_preco, v.ordem
FROM (VALUES
  ('Sites profissionais', 'Sites rápidos, responsivos e bem organizados, que apresentam sua marca com clareza e transmitem confiança.', 'globe', 'site', 1),
  ('Catálogos', 'Catálogos digitais elegantes para mostrar produtos e serviços de forma simples para o seu cliente.', 'book-open', 'quote', 2),
  ('Identidade de negócios', 'Logo, cores e tipografia alinhadas, para que a sua marca seja reconhecida em qualquer lugar.', 'palette', 'quote', 3),
  ('Convites interativos', 'Convites personalizados com animações e os detalhes do seu evento, prontos para encantar os convidados.', 'gift', 'invite', 4),
  ('Social media', 'Artes, legendas e publicações planejadas para manter a sua marca presente, relevante e conectada ao seu público.', 'megaphone', 'quote', 5)
) AS v (titulo, descricao, icone, tipo_preco, ordem)
WHERE NOT EXISTS (SELECT 1 FROM servicos);
