-- ============================================================
-- SEED FORMATIONS — à exécuter dans Supabase SQL Editor
-- Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Supprime d'abord les formations existantes pour repartir proprement
DELETE FROM public.formations WHERE code IN (
  'SSIAP1','SSIAP2','SSIAP3',
  'RECYCLAGE1','RECYCLAGE2','RECYCLAGE3',
  'CQPAPS','SST','H0B0'
);

INSERT INTO public.formations (
  id, code, nom, type, duree_validite_mois,
  template_id, orientation, texte_officiel, sous_titre, actif
) VALUES

-- ── SSIAP 1 : Agent de Sécurité Incendie et d'Assistance à Personnes ──
(
  'f1000000-0000-0000-0000-000000000001',
  'SSIAP1',
  'SSIAP 1 — Agent de Sécurité Incendie et d''Assistance à Personnes',
  'diplome', 36, 'ssiap-portrait', 'portrait',
  'Vu le procès-verbal du Jury d''examen en date du {{date_examen}} déclarant que Nom : {{nom}}  Prénom : {{prenom}}, Né le {{date_naissance}}, à {{lieu_naissance}}. A subi avec succès les épreuves exigées pour l''obtention du DIPLÔME D''AGENT DES SERVICES DE SÉCURITÉ INCENDIE ET D''ASSISTANCE À PERSONNES tel que défini dans l''arrêté du 02 mai 2005 modifié.',
  'Agent de Sécurité Incendie et d''Assistance à Personnes',
  TRUE
),

-- ── SSIAP 2 : Chef d'Équipe de Sécurité Incendie ──
(
  'f1000000-0000-0000-0000-000000000002',
  'SSIAP2',
  'SSIAP 2 — Chef d''Équipe de Sécurité Incendie',
  'diplome', 36, 'ssiap-portrait', 'portrait',
  'Vu le procès-verbal du Jury d''examen en date du {{date_examen}} déclarant que Nom : {{nom}}  Prénom : {{prenom}}, Né le {{date_naissance}}, à {{lieu_naissance}}. A subi avec succès les épreuves exigées pour l''obtention du DIPLÔME DE CHEF D''ÉQUIPE DE SÉCURITÉ INCENDIE ET D''ASSISTANCE À PERSONNES tel que défini dans l''arrêté du 02 mai 2005 modifié.',
  'Chef d''Équipe de Sécurité Incendie',
  TRUE
),

-- ── SSIAP 3 : Chef de Service de Sécurité Incendie ──
(
  'f1000000-0000-0000-0000-000000000003',
  'SSIAP3',
  'SSIAP 3 — Chef de Service de Sécurité Incendie',
  'diplome', 36, 'ssiap-portrait', 'portrait',
  'Vu le procès-verbal du Jury d''examen en date du {{date_examen}} déclarant que Nom : {{nom}}  Prénom : {{prenom}}, Né le {{date_naissance}}, à {{lieu_naissance}}. A subi avec succès les épreuves exigées pour l''obtention du DIPLÔME DE CHEF DE SERVICE DE SÉCURITÉ INCENDIE tel que défini dans l''arrêté du 02 mai 2005 modifié.',
  'Chef de Service de Sécurité Incendie',
  TRUE
),

-- ── RECYCLAGE SSIAP 1 ──
(
  'f1000000-0000-0000-0000-000000000011',
  'RECYCLAGE1',
  'Recyclage SSIAP 1 — Agent de Sécurité Incendie et d''Assistance à Personnes',
  'attestation', 36, 'ssiap-portrait', 'portrait',
  'Vu le procès-verbal du Jury en date du {{date_examen}} déclarant que Nom : {{nom}}  Prénom : {{prenom}}, Né le {{date_naissance}}, à {{lieu_naissance}}. A suivi avec succès la formation de RECYCLAGE SSIAP 1 conformément à l''arrêté du 02 mai 2005 modifié.',
  'Recyclage — Agent de Sécurité Incendie et d''Assistance à Personnes',
  TRUE
),

-- ── RECYCLAGE SSIAP 2 ──
(
  'f1000000-0000-0000-0000-000000000012',
  'RECYCLAGE2',
  'Recyclage SSIAP 2 — Chef d''Équipe de Sécurité Incendie',
  'attestation', 36, 'ssiap-portrait', 'portrait',
  'Vu le procès-verbal du Jury en date du {{date_examen}} déclarant que Nom : {{nom}}  Prénom : {{prenom}}, Né le {{date_naissance}}, à {{lieu_naissance}}. A suivi avec succès la formation de RECYCLAGE SSIAP 2 conformément à l''arrêté du 02 mai 2005 modifié.',
  'Recyclage — Chef d''Équipe de Sécurité Incendie',
  TRUE
),

-- ── RECYCLAGE SSIAP 3 ──
(
  'f1000000-0000-0000-0000-000000000013',
  'RECYCLAGE3',
  'Recyclage SSIAP 3 — Chef de Service de Sécurité Incendie',
  'attestation', 36, 'ssiap-portrait', 'portrait',
  'Vu le procès-verbal du Jury en date du {{date_examen}} déclarant que Nom : {{nom}}  Prénom : {{prenom}}, Né le {{date_naissance}}, à {{lieu_naissance}}. A suivi avec succès la formation de RECYCLAGE SSIAP 3 conformément à l''arrêté du 02 mai 2005 modifié.',
  'Recyclage — Chef de Service de Sécurité Incendie',
  TRUE
),

-- ── TFP APS (CQP APS) ──
(
  'f1000000-0000-0000-0000-000000000004',
  'CQPAPS',
  'TFP APS — Titre à Finalité Professionnelle Agent de Prévention et de Sécurité',
  'diplome', 0, 'cqp-aps', 'landscape',
  'Procès-verbal du jury d''examen en date du {{date_examen}} à la suite de la formation Titre Agent de Prévention et de Sécurité du {{date_debut}} au {{date_fin}}.',
  'Agent de Prévention et de Sécurité',
  TRUE
),

-- ── SST ──
(
  'f1000000-0000-0000-0000-000000000005',
  'SST',
  'SST — Sauveteur Secouriste du Travail',
  'certificat', 24, 'ssiap-portrait', 'portrait',
  'A suivi avec succès la formation de Sauveteur Secouriste du Travail conformément au programme de l''INRS.',
  'Sauveteur Secouriste du Travail',
  TRUE
),

-- ── H0B0 ──
(
  'f1000000-0000-0000-0000-000000000006',
  'H0B0',
  'H0B0 — Habilitation Électrique Personnel Non Électricien',
  'attestation', 36, 'ssiap-portrait', 'portrait',
  'A suivi avec succès la formation à la prévention des risques électriques pour personnel non électricien conformément à la norme NF C 18-510.',
  'Habilitation Électrique pour Personnel Non Électricien',
  TRUE
)

ON CONFLICT (id) DO UPDATE SET
  code = EXCLUDED.code,
  nom = EXCLUDED.nom,
  type = EXCLUDED.type,
  duree_validite_mois = EXCLUDED.duree_validite_mois,
  template_id = EXCLUDED.template_id,
  orientation = EXCLUDED.orientation,
  texte_officiel = EXCLUDED.texte_officiel,
  sous_titre = EXCLUDED.sous_titre,
  actif = EXCLUDED.actif;

-- Champs spécifiques CQP APS
UPDATE public.formations SET
  rncp = 'RNCP37035',
  niveau_rncp = 'Niveau 3',
  code_nsf = '344t',
  certificateur_nom = 'IESC Formation',
  certificateur_representant = 'Dino Brunori'
WHERE code = 'CQPAPS';

-- Vérification
SELECT code, nom, template_id, orientation, duree_validite_mois FROM public.formations ORDER BY code;
