export type UserRole = "super_admin" | "admin";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Apprenant {
  id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  email?: string;
  telephone?: string;
  adresse?: string;
  entreprise?: string;
  photo?: string;
  notes?: string;
  civilite?: string;
  paysNaissance?: string;
  statut: "actif" | "archive";
  createdAt: string;
}

export type FormationType = "diplome" | "attestation" | "certificat";

export interface Formation {
  id: string;
  code: string;
  nom: string;
  type: FormationType;
  dureeValiditeMois: number;
  templateId: string;
  texteOfficiel: string;
  sousTitre: string;
  actif: boolean;
  rncp?: string;
  niveauRncp?: string;
  codeNsf?: string;
  certificateurNom?: string;
  certificateurRepresentant?: string;
  orientation?: "portrait" | "landscape";
}

export type DocumentStatut = "valide" | "expire" | "annule" | "remplace";

export interface DocumentGenere {
  id: string;
  numero: string;
  apprenantId: string;
  formationId: string;
  templateId: string;
  dateExamen: string;
  dateObtention: string;
  dateExpiration?: string;
  lieu: string;
  presidentNom: string;
  representantNom: string;
  representantGrade: string;
  statut: DocumentStatut;
  createdAt: string;
  createdBy: string;
  cnapsNumero?: string;
  dateDebutFormation?: string;
  dateFinFormation?: string;
}

export interface HistoryEntry {
  id: string;
  type: string;
  description: string;
  userId?: string;
  documentId?: string;
  apprenantId?: string;
  createdAt: string;
}

export interface Settings {
  centreNom: string;
  centreAdresse: string;
  centreTel: string;
  centreEmail: string;
  centreSiret: string;
  centreActivite: string;
  centreAgrement: string;
  centreDeclaration: string;
  presidentNom: string;
  representantNom: string;
  representantGrade: string;
  verificationBaseUrl: string;
  centreForCode?: string;
  centreQualiopi?: string;
  centreAps?: string;
}
