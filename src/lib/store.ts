import { create } from "zustand";
import type {
  Apprenant,
  DocumentGenere,
  Formation,
  HistoryEntry,
  Settings,
} from "./types";
import { supabase } from "./supabase";
import seedPhoto from "@/assets/seed-photo.jpg";

interface AppState {
  apprenants: Apprenant[];
  formations: Formation[];
  documents: DocumentGenere[];
  history: HistoryEntry[];
  settings: Settings;
  initialized: boolean;
  // actions
  initFromSupabase: () => Promise<void>;
  upsertApprenant: (a: Apprenant) => Promise<void>;
  deleteApprenant: (id: string) => Promise<void>;
  upsertFormation: (f: Formation) => Promise<void>;
  addDocument: (d: DocumentGenere) => Promise<void>;
  updateDocument: (id: string, patch: Partial<DocumentGenere>) => Promise<void>;
  log: (e: Omit<HistoryEntry, "id" | "createdAt">) => Promise<void>;
  updateSettings: (s: Partial<Settings>) => Promise<void>;
  nextDiplomaNumber: (formationCode: string) => Promise<string>;
}

const defaultSettings: Settings = {
  centreNom: "LEARNIX",
  centreAdresse: "47 rue de cannes 59000 Lille",
  centreTel: "03 74 69 39 41",
  centreEmail: "info@groupe-kelel.com",
  centreSiret: "978 657 625 00015",
  centreActivite: "32 59 1104 59",
  centreAgrement: "059/060",
  centreDeclaration: "32 59 1190459",
  presidentNom: "Imad BELARBI",
  representantNom: "Smezzzyk",
  representantGrade: "LTN",
  verificationBaseUrl: typeof window !== "undefined" ? window.location.origin : "",
  centreForCode: "FOR-059-2123-11-16-20240930970",
  centreQualiopi: "Certificat Qualiopi n°2957 OF Ind 0",
  centreAps: "069-2024APS",
};

// ── Supabase row mappers ──────────────────────────────────────

function rowToApprenant(r: Record<string, unknown>): Apprenant {
  return {
    id: r.id as string,
    nom: r.nom as string,
    prenom: r.prenom as string,
    dateNaissance: (r.date_naissance as string) ?? "",
    lieuNaissance: (r.lieu_naissance as string) ?? "",
    email: r.email as string | undefined,
    telephone: r.telephone as string | undefined,
    adresse: r.adresse as string | undefined,
    entreprise: r.entreprise as string | undefined,
    photo: (r.photo as string | undefined) || seedPhoto,
    notes: r.notes as string | undefined,
    civilite: r.civilite as string | undefined,
    paysNaissance: r.pays_naissance as string | undefined,
    statut: (r.statut as "actif" | "archive") ?? "actif",
    createdAt: r.created_at as string,
  };
}

function apprenantToRow(a: Apprenant) {
  return {
    id: a.id,
    nom: a.nom,
    prenom: a.prenom,
    date_naissance: a.dateNaissance || null,
    lieu_naissance: a.lieuNaissance || "",
    email: a.email || null,
    telephone: a.telephone || null,
    adresse: a.adresse || null,
    entreprise: a.entreprise || null,
    photo: a.photo === seedPhoto ? null : (a.photo || null),
    notes: a.notes || null,
    civilite: a.civilite || null,
    pays_naissance: a.paysNaissance || null,
    statut: a.statut,
  };
}

function rowToFormation(r: Record<string, unknown>): Formation {
  return {
    id: r.id as string,
    code: r.code as string,
    nom: r.nom as string,
    type: r.type as Formation["type"],
    dureeValiditeMois: (r.duree_validite_mois as number) ?? 0,
    templateId: (r.template_id as string) ?? "ssiap-portrait",
    orientation: (r.orientation as "portrait" | "landscape") ?? "portrait",
    texteOfficiel: (r.texte_officiel as string) ?? "",
    sousTitre: (r.sous_titre as string) ?? "",
    actif: (r.actif as boolean) ?? true,
    rncp: r.rncp as string | undefined,
    niveauRncp: r.niveau_rncp as string | undefined,
    codeNsf: r.code_nsf as string | undefined,
    certificateurNom: r.certificateur_nom as string | undefined,
    certificateurRepresentant: r.certificateur_representant as string | undefined,
  };
}

function rowToDocument(r: Record<string, unknown>): DocumentGenere {
  return {
    id: r.id as string,
    numero: r.numero as string,
    apprenantId: r.apprenant_id as string,
    formationId: r.formation_id as string,
    templateId: (r.template_id as string) ?? "ssiap-portrait",
    dateExamen: (r.date_examen as string) ?? "",
    dateObtention: (r.date_obtention as string) ?? "",
    dateExpiration: r.date_expiration as string | undefined,
    lieu: (r.lieu as string) ?? "",
    presidentNom: (r.president_nom as string) ?? "",
    representantNom: (r.representant_nom as string) ?? "",
    representantGrade: (r.representant_grade as string) ?? "",
    statut: (r.statut as DocumentGenere["statut"]) ?? "valide",
    createdAt: r.created_at as string,
    createdBy: (r.created_by as string) ?? "",
    cnapsNumero: r.cnaps_numero as string | undefined,
    dateDebutFormation: r.date_debut_formation as string | undefined,
    dateFinFormation: r.date_fin_formation as string | undefined,
  };
}

function documentToRow(d: DocumentGenere, userId: string) {
  return {
    id: d.id,
    numero: d.numero,
    apprenant_id: d.apprenantId,
    formation_id: d.formationId,
    template_id: d.templateId,
    date_examen: d.dateExamen || null,
    date_obtention: d.dateObtention || null,
    date_expiration: d.dateExpiration || null,
    lieu: d.lieu || "",
    president_nom: d.presidentNom || "",
    representant_nom: d.representantNom || "",
    representant_grade: d.representantGrade || "",
    statut: d.statut,
    created_by: userId,
    cnaps_numero: d.cnapsNumero || null,
    date_debut_formation: d.dateDebutFormation || null,
    date_fin_formation: d.dateFinFormation || null,
  };
}

function rowToSettings(r: Record<string, unknown>): Settings {
  return {
    centreNom: (r.centre_nom as string) ?? defaultSettings.centreNom,
    centreAdresse: (r.centre_adresse as string) ?? defaultSettings.centreAdresse,
    centreTel: (r.centre_tel as string) ?? defaultSettings.centreTel,
    centreEmail: (r.centre_email as string) ?? defaultSettings.centreEmail,
    centreSiret: (r.centre_siret as string) ?? defaultSettings.centreSiret,
    centreActivite: (r.centre_activite as string) ?? defaultSettings.centreActivite,
    centreAgrement: (r.centre_agrement as string) ?? defaultSettings.centreAgrement,
    centreDeclaration: (r.centre_declaration as string) ?? defaultSettings.centreDeclaration,
    presidentNom: (r.president_nom as string) ?? defaultSettings.presidentNom,
    representantNom: (r.representant_nom as string) ?? defaultSettings.representantNom,
    representantGrade: (r.representant_grade as string) ?? defaultSettings.representantGrade,
    verificationBaseUrl: (r.verification_base_url as string) || (typeof window !== "undefined" ? window.location.origin : ""),
    centreForCode: r.centre_for_code as string | undefined,
    centreQualiopi: r.centre_qualiopi as string | undefined,
    centreAps: r.centre_aps as string | undefined,
  };
}

// ── Store ──────────────────────────────────────────────────────

export const useStore = create<AppState>()((set, get) => ({
  apprenants: [],
  formations: [],
  documents: [],
  history: [],
  settings: defaultSettings,
  initialized: false,

  initFromSupabase: async () => {
    const [
      { data: apprenants },
      { data: formations },
      { data: documents },
      { data: historique },
      { data: parametres },
    ] = await Promise.all([
      supabase.from("apprenants").select("*").order("created_at", { ascending: false }),
      supabase.from("formations").select("*").eq("actif", true).order("code"),
      supabase.from("documents_generes").select("*").order("created_at", { ascending: false }),
      supabase.from("historique").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("parametres").select("*").eq("id", 1).single(),
    ]);

    set({
      apprenants: (apprenants ?? []).map(rowToApprenant),
      formations: (formations ?? []).map(rowToFormation),
      documents: (documents ?? []).map(rowToDocument),
      history: (historique ?? []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        type: r.type as string,
        description: r.description as string,
        userId: r.user_id as string | undefined,
        documentId: r.document_id as string | undefined,
        apprenantId: r.apprenant_id as string | undefined,
        createdAt: r.created_at as string,
      })),
      settings: parametres ? rowToSettings(parametres as Record<string, unknown>) : defaultSettings,
      initialized: true,
    });
  },

  upsertApprenant: async (a) => {
    const row = apprenantToRow(a);
    await supabase.from("apprenants").upsert(row);
    set((s) => {
      const exists = s.apprenants.some((x) => x.id === a.id);
      return {
        apprenants: exists
          ? s.apprenants.map((x) => (x.id === a.id ? a : x))
          : [a, ...s.apprenants],
      };
    });
  },

  deleteApprenant: async (id) => {
    await supabase.from("apprenants").delete().eq("id", id);
    set((s) => ({ apprenants: s.apprenants.filter((a) => a.id !== id) }));
  },

  upsertFormation: async (f) => {
    await supabase.from("formations").upsert({
      id: f.id,
      code: f.code,
      nom: f.nom,
      type: f.type,
      duree_validite_mois: f.dureeValiditeMois,
      template_id: f.templateId,
      orientation: f.orientation ?? "portrait",
      texte_officiel: f.texteOfficiel,
      sous_titre: f.sousTitre,
      actif: f.actif,
      rncp: f.rncp ?? null,
      niveau_rncp: f.niveauRncp ?? null,
      code_nsf: f.codeNsf ?? null,
      certificateur_nom: f.certificateurNom ?? null,
      certificateur_representant: f.certificateurRepresentant ?? null,
    });
    set((s) => {
      const exists = s.formations.some((x) => x.id === f.id);
      return {
        formations: exists
          ? s.formations.map((x) => (x.id === f.id ? f : x))
          : [...s.formations, f],
      };
    });
  },

  addDocument: async (d) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id ?? "";
    await supabase.from("documents_generes").insert(documentToRow(d, userId));
    set((s) => ({ documents: [d, ...s.documents] }));
  },

  updateDocument: async (id, patch) => {
    const dbPatch: Record<string, unknown> = {};
    if (patch.statut !== undefined) dbPatch.statut = patch.statut;
    if (patch.lieu !== undefined) dbPatch.lieu = patch.lieu;
    if (patch.presidentNom !== undefined) dbPatch.president_nom = patch.presidentNom;
    if (patch.representantNom !== undefined) dbPatch.representant_nom = patch.representantNom;
    if (patch.representantGrade !== undefined) dbPatch.representant_grade = patch.representantGrade;
    if (patch.dateExpiration !== undefined) dbPatch.date_expiration = patch.dateExpiration;
    if (Object.keys(dbPatch).length > 0) {
      await supabase.from("documents_generes").update(dbPatch).eq("id", id);
    }
    set((s) => ({
      documents: s.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    }));
  },

  log: async (e) => {
    const { data: { session } } = await supabase.auth.getSession();
    const entry: HistoryEntry = {
      ...e,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await supabase.from("historique").insert({
      id: entry.id,
      type: entry.type,
      description: entry.description,
      user_id: session?.user?.id ?? null,
      document_id: entry.documentId ?? null,
      apprenant_id: entry.apprenantId ?? null,
    });
    set((s) => ({ history: [entry, ...s.history].slice(0, 500) }));
  },

  updateSettings: async (s) => {
    const merged = { ...get().settings, ...s };
    await supabase.from("parametres").update({
      centre_nom: merged.centreNom,
      centre_adresse: merged.centreAdresse,
      centre_tel: merged.centreTel,
      centre_email: merged.centreEmail,
      centre_siret: merged.centreSiret,
      centre_activite: merged.centreActivite,
      centre_agrement: merged.centreAgrement,
      centre_declaration: merged.centreDeclaration,
      president_nom: merged.presidentNom,
      representant_nom: merged.representantNom,
      representant_grade: merged.representantGrade,
      verification_base_url: merged.verificationBaseUrl,
      centre_for_code: merged.centreForCode ?? null,
      centre_qualiopi: merged.centreQualiopi ?? null,
      centre_aps: merged.centreAps ?? null,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
    set((st) => ({ settings: { ...st.settings, ...s } }));
  },

  nextDiplomaNumber: async (formationCode) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return "";
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "";
    // Call the Supabase function
    const agrement = get().settings.centreAgrement;
    const { data } = await supabase.rpc("next_diploma_number", {
      p_formation_code: formationCode,
      p_agrement: agrement,
    });
    return (data as string) ?? "";
  },
}));

// Hook for current user from Supabase Auth
export function useCurrentUser() {
  return null; // Components should use supabase.auth.getUser() directly
}
