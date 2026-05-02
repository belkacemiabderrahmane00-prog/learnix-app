import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck, ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { DiplomaRenderer, isLandscapeFormation } from "@/components/diploma/DiplomaRenderer";
import { addMonths, format, parseISO } from "date-fns";
import type { DocumentGenere } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/generer")({
  validateSearch: (s: Record<string, unknown>) => ({
    apprenantId: typeof s.apprenantId === "string" ? s.apprenantId : undefined,
  }),
  component: Generer,
});

const uid = () => Math.random().toString(36).slice(2, 11);

function Generer() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const apprenants = useStore((s) => s.apprenants);
  const formations = useStore((s) => s.formations);
  const settings = useStore((s) => s.settings);
  const addDoc = useStore((s) => s.addDocument);
  const log = useStore((s) => s.log);
  const nextNum = useStore((s) => s.nextDiplomaNumber);

  const [step, setStep] = useState(1);
  const [autoNumero, setAutoNumero] = useState("");
  const [apprenantId, setApprenantId] = useState(search.apprenantId ?? "");
  const [formationId, setFormationId] = useState("");
  const [dateExamen, setDateExamen] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dateObtention, setDateObtention] = useState(format(new Date(), "yyyy-MM-dd"));
  const [lieu, setLieu] = useState("LILLE");
  const [presidentNom, setPresidentNom] = useState(settings.presidentNom);
  const [representantNom, setRepresentantNom] = useState(settings.representantNom);
  const [representantGrade, setRepresentantGrade] = useState(settings.representantGrade);
  // Champs spécifiques CQP
  const [cnapsNumero, setCnapsNumero] = useState("");
  const [dateDebutFormation, setDateDebutFormation] = useState("");
  const [dateFinFormation, setDateFinFormation] = useState("");

  const apprenant = apprenants.find((a) => a.id === apprenantId);
  const formation = formations.find((f) => f.id === formationId);
  const isCqp = formation?.templateId === "cqp-aps";
  const isLandscape = formation ? isLandscapeFormation(formation) : false;

  useEffect(() => {
    if (!formation) return;
    nextNum(formation.code).then(setAutoNumero);
  }, [formation, nextNum]);

  const previewDoc: DocumentGenere | null = useMemo(() => {
    if (!apprenant || !formation) return null;
    const expirationDate =
      formation.dureeValiditeMois > 0
        ? format(addMonths(parseISO(dateExamen), formation.dureeValiditeMois), "yyyy-MM-dd")
        : undefined;
    return {
      id: "preview",
      numero: autoNumero,
      apprenantId: apprenant.id,
      formationId: formation.id,
      templateId: formation.templateId,
      dateExamen,
      dateObtention,
      dateExpiration: expirationDate,
      lieu,
      presidentNom,
      representantNom: isCqp ? "" : representantNom,
      representantGrade: isCqp ? "" : representantGrade,
      cnapsNumero: isCqp ? cnapsNumero : undefined,
      dateDebutFormation: isCqp ? dateDebutFormation : undefined,
      dateFinFormation: isCqp ? dateFinFormation : undefined,
      statut: "valide",
      createdAt: new Date().toISOString(),
      createdBy: "",
    };
  }, [
    apprenant, formation, dateExamen, dateObtention, lieu,
    presidentNom, representantNom, representantGrade,
    cnapsNumero, dateDebutFormation, dateFinFormation,
    isCqp, autoNumero,
  ]);

  const handleValidate = () => {
    if (!previewDoc || !apprenant || !formation) return;
    const finalDoc: DocumentGenere = { ...previewDoc, id: uid() };
    addDoc(finalDoc);
    log({
      type: "document",
      description: `Génération ${formation.code} pour ${apprenant.prenom} ${apprenant.nom} (N° ${finalDoc.numero})`,
      documentId: finalDoc.id,
      apprenantId: apprenant.id,
    });
    toast.success("Document généré avec succès");
    navigate({ to: "/documents/$id", params: { id: finalDoc.id } });
  };

  // Dimensions d'aperçu selon l'orientation
  const previewWidth = isLandscape ? 1123 : 794;
  const previewHeight = isLandscape ? 794 : 1123;
  const previewScale = isLandscape ? 0.62 : 0.44;
  const previewContainerHeight = Math.round(previewHeight * previewScale) + 32;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Génération</p>
        <h1 className="mt-1 font-serif text-4xl">Nouveau document</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Suivez les étapes pour générer un diplôme certifié Learnix.
        </p>
      </header>

      {/* Stepper */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {[
          { n: 1, label: "Apprenant" },
          { n: 2, label: "Formation" },
          { n: 3, label: "Détails" },
          { n: 4, label: "Aperçu" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                step >= s.n
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s.n}
            </div>
            <span className={step >= s.n ? "font-semibold" : "text-muted-foreground"}>
              {s.label}
            </span>
            {i < 3 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <div className="shadow-card-soft rounded-xl border border-border bg-card p-6">
        {/* ── ÉTAPE 1 : Apprenant ── */}
        {step === 1 && (
          <div>
            <h2 className="mb-4 font-serif text-xl">Choisir un apprenant</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {apprenants.filter((a) => a.statut === "actif").map((a) => (
                <button
                  key={a.id}
                  onClick={() => setApprenantId(a.id)}
                  className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                    apprenantId === a.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {a.photo ? (
                    <img src={a.photo} alt="" className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-bold">
                      {a.prenom[0]}{a.nom[0]}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold">{a.civilite ?? ""} {a.prenom} {a.nom}</div>
                    <div className="text-xs text-muted-foreground">
                      {a.lieuNaissance}{a.paysNaissance ? ` (${a.paysNaissance})` : ""}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                disabled={!apprenantId}
                onClick={() => setStep(2)}
                className="bg-gradient-red rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 2 : Formation ── */}
        {step === 2 && (
          <div>
            <h2 className="mb-4 font-serif text-xl">Choisir la formation</h2>
            <div className="grid gap-2 md:grid-cols-2">
              {formations.filter((f) => f.actif).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormationId(f.id)}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    formationId === f.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {f.code}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {f.orientation === "landscape" ? "Paysage" : "Portrait"}
                    </span>
                  </div>
                  <div className="mt-1 font-semibold leading-tight">{f.nom}</div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {f.dureeValiditeMois > 0 ? `Validité : ${f.dureeValiditeMois} mois` : "Sans expiration"}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="rounded-md border border-input px-5 py-2 text-sm hover:bg-muted"
              >
                Précédent
              </button>
              <button
                disabled={!formationId}
                onClick={() => setStep(3)}
                className="bg-gradient-red rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 3 : Détails ── */}
        {step === 3 && formation && (
          <div>
            <h2 className="mb-4 font-serif text-xl">Détails du document</h2>

            {/* Champs communs */}
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Date du jury / examen">
                <input
                  type="date"
                  value={dateExamen}
                  onChange={(e) => setDateExamen(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Date d'obtention / émission">
                <input
                  type="date"
                  value={dateObtention}
                  onChange={(e) => setDateObtention(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Lieu d'émission">
                <input
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Directeur / Président du centre">
                <input
                  value={presidentNom}
                  onChange={(e) => setPresidentNom(e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Champs SSIAP spécifiques */}
            {!isCqp && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="col-span-2">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Représentant du service incendie
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                </div>
                <Field label="Nom du représentant SDIS">
                  <input
                    value={representantNom}
                    onChange={(e) => setRepresentantNom(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Grade">
                  <input
                    value={representantGrade}
                    onChange={(e) => setRepresentantGrade(e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
            )}

            {/* Champs CQP APS spécifiques */}
            {isCqp && (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="col-span-2">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Informations TFP APS
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                </div>
                <Field label="Numéro CNAPS">
                  <input
                    value={cnapsNumero}
                    onChange={(e) => setCnapsNumero(e.target.value)}
                    placeholder="ex: PRE-059-2025-06-09-20240934237"
                    className={inputCls}
                  />
                </Field>
                <div />
                <Field label="Début de la formation">
                  <input
                    type="date"
                    value={dateDebutFormation}
                    onChange={(e) => setDateDebutFormation(e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Fin de la formation">
                  <input
                    type="date"
                    value={dateFinFormation}
                    onChange={(e) => setDateFinFormation(e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
            )}

            {/* Numéro auto */}
            {previewDoc && (
              <div className="mt-4">
                <Field label="Numéro attribué automatiquement">
                  <div className="rounded-md bg-muted px-3 py-2 font-mono text-sm">
                    {previewDoc.numero}
                  </div>
                </Field>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="rounded-md border border-input px-5 py-2 text-sm hover:bg-muted"
              >
                Précédent
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-gradient-red rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground"
              >
                Aperçu
              </button>
            </div>
          </div>
        )}

        {/* ── ÉTAPE 4 : Aperçu ── */}
        {step === 4 && previewDoc && apprenant && formation && (
          <div>
            <h2 className="mb-4 flex items-center gap-2 font-serif text-xl">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Aperçu avant validation
            </h2>
            <div
              className="overflow-auto rounded-xl border border-border bg-muted/30 p-4"
              style={{ minHeight: `${previewContainerHeight}px` }}
            >
              <div
                style={{
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top center",
                  width: `${previewWidth}px`,
                  margin: "0 auto",
                  height: `${previewHeight}px`,
                }}
              >
                <DiplomaRenderer
                  apprenant={apprenant}
                  formation={formation}
                  document={previewDoc}
                  settings={settings}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="rounded-md border border-input px-5 py-2 text-sm hover:bg-muted"
              >
                Modifier
              </button>
              <button
                onClick={handleValidate}
                className="bg-gradient-red rounded-md px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
              >
                Valider et générer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
