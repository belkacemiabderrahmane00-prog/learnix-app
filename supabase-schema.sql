-- ============================================================
-- LEARNIX CERTIFY — Schéma Supabase complet
-- Coller dans : Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ── 1. PROFILS UTILISATEURS (étend auth.users) ──────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE TO authenticated USING (true);

-- Trigger : créer le profil automatiquement lors de l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'admin')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ── 2. APPRENANTS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.apprenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL DEFAULT '',
  prenom TEXT NOT NULL DEFAULT '',
  date_naissance DATE,
  lieu_naissance TEXT DEFAULT '',
  email TEXT,
  telephone TEXT,
  adresse TEXT,
  entreprise TEXT,
  photo TEXT,
  notes TEXT,
  civilite TEXT DEFAULT 'M.',
  pays_naissance TEXT,
  statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'archive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.apprenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "apprenants_select" ON public.apprenants
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "apprenants_write" ON public.apprenants
  FOR ALL TO authenticated USING (true);

-- Seed : apprenant RAKIB (démo)
INSERT INTO public.apprenants (
  id, nom, prenom, date_naissance, lieu_naissance, email, telephone,
  civilite, pays_naissance, statut
) VALUES (
  'a1000000-0000-0000-0000-000000000001',
  'RAKIB', 'MUSTAPHA', '1977-01-01', 'TALMEST ESSAOUIRA',
  'mustapha.rakib@example.com', '+33 6 00 00 00 00',
  'M.', 'MAROC', 'actif'
) ON CONFLICT (id) DO NOTHING;


-- ── 3. FORMATIONS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.formations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL CHECK (type IN ('diplome', 'attestation', 'certificat')),
  duree_validite_mois INTEGER DEFAULT 0,
  template_id TEXT DEFAULT 'ssiap-portrait',
  orientation TEXT DEFAULT 'portrait' CHECK (orientation IN ('portrait', 'landscape')),
  texte_officiel TEXT DEFAULT '',
  sous_titre TEXT DEFAULT '',
  rncp TEXT,
  niveau_rncp TEXT,
  code_nsf TEXT,
  certificateur_nom TEXT,
  certificateur_representant TEXT,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "formations_select" ON public.formations
  FOR SELECT USING (true);

CREATE POLICY "formations_write" ON public.formations
  FOR ALL TO authenticated USING (true);

-- Seed formations
INSERT INTO public.formations (id, code, nom, type, duree_validite_mois, template_id, orientation, texte_officiel, sous_titre, actif)
VALUES
  ('f1000000-0000-0000-0000-000000000001',
   'SSIAP1',
   'SSIAP 1 — Agent de sécurité incendie et d''assistance à personnes',
   'diplome', 36, 'ssiap-portrait', 'portrait',
   'Vu le procès-verbal du Jury d''examen en date du {{date_examen}} déclarant que Nom : {{nom}}  Prénom : {{prenom}}, Né le {{date_naissance}}, à {{lieu_naissance}}. A subi avec succès les épreuves exigées pour l''obtention du DIPLÔME D''AGENT DES SERVICES DE SÉCURITÉ INCENDIE ET D''ASSISTANCE À PERSONNES tel que défini dans l''arrêté du 02 mai 2005 modifié.',
   'Agent de sécurité incendie et d''assistance à personnes', TRUE),

  ('f1000000-0000-0000-0000-000000000002',
   'SSIAP2',
   'SSIAP 2 — Chef d''équipe de sécurité incendie',
   'diplome', 36, 'ssiap-portrait', 'portrait',
   'Vu le procès-verbal du Jury d''examen en date du {{date_examen}} déclarant que Nom : {{nom}}  Prénom : {{prenom}}, Né le {{date_naissance}}, à {{lieu_naissance}}. A subi avec succès les épreuves exigées pour l''obtention du DIPLÔME DE CHEF D''ÉQUIPE DE SÉCURITÉ INCENDIE tel que défini dans l''arrêté du 02 mai 2005 modifié.',
   'Chef d''équipe de sécurité incendie et d''assistance à personnes', TRUE),

  ('f1000000-0000-0000-0000-000000000003',
   'SSIAP3',
   'SSIAP 3 — Chef de service de sécurité incendie',
   'diplome', 36, 'ssiap-portrait', 'portrait',
   'Vu le procès-verbal du Jury d''examen en date du {{date_examen}} déclarant que Nom : {{nom}}  Prénom : {{prenom}}, Né le {{date_naissance}}, à {{lieu_naissance}}. A subi avec succès les épreuves exigées pour l''obtention du DIPLÔME DE CHEF DE SERVICE DE SÉCURITÉ INCENDIE tel que défini dans l''arrêté du 02 mai 2005 modifié.',
   'Chef de service de sécurité incendie', TRUE),

  ('f1000000-0000-0000-0000-000000000004',
   'CQPAPS',
   'TFP APS — Titre à Finalité Professionnelle Agent de Prévention et de Sécurité',
   'diplome', 0, 'cqp-aps', 'landscape',
   'Procès-verbal du jury d''examen en date du {{date_examen}} à la suite de la formation Titre Agent de Prévention et de Sécurité du {{date_debut}} au {{date_fin}}.',
   'Agent de Prévention et de Sécurité', TRUE),

  ('f1000000-0000-0000-0000-000000000005',
   'SST',
   'SST — Sauveteur Secouriste du Travail',
   'certificat', 24, 'ssiap-portrait', 'portrait',
   'A suivi avec succès la formation de Sauveteur Secouriste du Travail conformément au programme de l''INRS et a obtenu le certificat correspondant.',
   'Sauveteur Secouriste du Travail', TRUE),

  ('f1000000-0000-0000-0000-000000000006',
   'H0B0',
   'H0B0 — Habilitation électrique non électricien',
   'attestation', 36, 'ssiap-portrait', 'portrait',
   'A suivi avec succès la formation à la prévention des risques électriques pour personnel non électricien conformément à la norme NF C 18-510.',
   'Habilitation électrique pour personnel non électricien', TRUE)
ON CONFLICT (code) DO NOTHING;

-- CQP : champs supplémentaires
UPDATE public.formations SET
  rncp = 'RNCP37035',
  niveau_rncp = 'Niveau 3',
  code_nsf = '344t',
  certificateur_nom = 'IESC Formation',
  certificateur_representant = 'Dino Brunori'
WHERE code = 'CQPAPS';


-- ── 4. DOCUMENTS GÉNÉRÉS ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.documents_generes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT UNIQUE NOT NULL,
  apprenant_id UUID REFERENCES public.apprenants(id) ON DELETE SET NULL,
  formation_id UUID REFERENCES public.formations(id) ON DELETE SET NULL,
  template_id TEXT DEFAULT 'ssiap-portrait',
  date_examen DATE,
  date_obtention DATE,
  date_expiration DATE,
  lieu TEXT DEFAULT '',
  president_nom TEXT DEFAULT '',
  representant_nom TEXT DEFAULT '',
  representant_grade TEXT DEFAULT '',
  statut TEXT DEFAULT 'valide' CHECK (statut IN ('valide', 'expire', 'annule', 'remplace')),
  cnaps_numero TEXT,
  date_debut_formation DATE,
  date_fin_formation DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.documents_generes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_select" ON public.documents_generes
  FOR SELECT USING (true);

CREATE POLICY "documents_write" ON public.documents_generes
  FOR ALL TO authenticated USING (true);

-- Seed : diplôme SSIAP1 RAKIB (démo)
INSERT INTO public.documents_generes (
  id, numero, apprenant_id, formation_id, template_id,
  date_examen, date_obtention, date_expiration,
  lieu, president_nom, representant_nom, representant_grade, statut
) VALUES (
  'd1000000-0000-0000-0000-000000000001',
  '059-0060-1-2025-00035',
  'a1000000-0000-0000-0000-000000000001',
  'f1000000-0000-0000-0000-000000000001',
  'ssiap-portrait',
  '2025-11-24', '2025-11-24', '2028-11-24',
  'LILLE', 'Imad BELARBI', 'Smezzzyk', 'LTN', 'valide'
) ON CONFLICT (numero) DO NOTHING;

-- Seed : diplôme CQP APS RAKIB (démo)
INSERT INTO public.documents_generes (
  id, numero, apprenant_id, formation_id, template_id,
  date_examen, date_obtention,
  lieu, president_nom, cnaps_numero, date_debut_formation, date_fin_formation, statut
) VALUES (
  'd1000000-0000-0000-0000-000000000002',
  '0112-2025-81785',
  'a1000000-0000-0000-0000-000000000001',
  'f1000000-0000-0000-0000-000000000004',
  'cqp-aps',
  '2025-03-07', '2025-04-14',
  'Hagondange', 'Imad BELARBI',
  'PRE-059-2025-06-09-20240934237',
  '2024-12-31', '2025-02-28', 'valide'
) ON CONFLICT (numero) DO NOTHING;


-- ── 5. HISTORIQUE ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.historique (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  document_id UUID REFERENCES public.documents_generes(id) ON DELETE SET NULL,
  apprenant_id UUID REFERENCES public.apprenants(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.historique ENABLE ROW LEVEL SECURITY;

CREATE POLICY "historique_select" ON public.historique
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "historique_insert" ON public.historique
  FOR INSERT TO authenticated WITH CHECK (true);


-- ── 6. PARAMÈTRES (une seule ligne) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.parametres (
  id INTEGER PRIMARY KEY DEFAULT 1,
  centre_nom TEXT DEFAULT 'LEARNIX',
  centre_adresse TEXT DEFAULT '47 rue de cannes 59000 Lille',
  centre_tel TEXT DEFAULT '03 74 69 39 41',
  centre_email TEXT DEFAULT 'info@groupe-kelel.com',
  centre_siret TEXT DEFAULT '978 657 625 00015',
  centre_activite TEXT DEFAULT '32 59 1104 59',
  centre_agrement TEXT DEFAULT '059/060',
  centre_declaration TEXT DEFAULT '32 59 1190459',
  president_nom TEXT DEFAULT 'Imad BELARBI',
  representant_nom TEXT DEFAULT 'Smezzzyk',
  representant_grade TEXT DEFAULT 'LTN',
  verification_base_url TEXT DEFAULT '',
  centre_for_code TEXT DEFAULT 'FOR-059-2123-11-16-20240930970',
  centre_qualiopi TEXT DEFAULT 'Certificat Qualiopi n°2957 OF Ind 0',
  centre_aps TEXT DEFAULT '069-2024APS',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.parametres ENABLE ROW LEVEL SECURITY;

CREATE POLICY "parametres_select" ON public.parametres
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "parametres_write" ON public.parametres
  FOR ALL TO authenticated USING (true);

INSERT INTO public.parametres (id) VALUES (1) ON CONFLICT (id) DO NOTHING;


-- ── 7. FONCTION : numéro diplôme auto ────────────────────────
CREATE OR REPLACE FUNCTION public.next_diploma_number(p_formation_code TEXT, p_agrement TEXT)
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE
  v_year INTEGER := EXTRACT(YEAR FROM NOW())::INTEGER;
  v_code_num TEXT;
  v_count INTEGER;
  v_seq TEXT;
BEGIN
  IF p_formation_code = 'CQPAPS' THEN
    SELECT COUNT(*) INTO v_count FROM public.documents_generes dg
      JOIN public.formations f ON dg.formation_id = f.id
      WHERE f.code = 'CQPAPS';
    v_seq := LPAD((v_count + 1)::TEXT, 5, '0');
    RETURN '0112-' || v_year || '-' || v_seq;
  END IF;
  v_code_num := CASE p_formation_code
    WHEN 'SSIAP1' THEN '1'
    WHEN 'SSIAP2' THEN '2'
    WHEN 'SSIAP3' THEN '3'
    WHEN 'SST'    THEN '4'
    WHEN 'H0B0'   THEN '5'
    ELSE '9'
  END;
  SELECT COUNT(*) INTO v_count FROM public.documents_generes
    WHERE numero LIKE '%-' || v_code_num || '-' || v_year || '-%';
  v_seq := LPAD((v_count + 36)::TEXT, 5, '0');
  RETURN REPLACE(p_agrement, '/', '-') || '-' || v_code_num || '-' || v_year || '-' || v_seq;
END;
$$;

-- ── FIN DU SCHÉMA ─────────────────────────────────────────────
-- Après avoir exécuté ce SQL, créez vos comptes admin dans :
-- Supabase Dashboard → Authentication → Users → Add user
--   Email : super@learnix.fr   Password : (choisissez)   Metadata : {"name":"Super Admin","role":"super_admin"}
--   Email : admin@learnix.fr   Password : (choisissez)   Metadata : {"name":"Imad BELARBI","role":"admin"}
