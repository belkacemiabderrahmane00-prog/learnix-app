import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, XCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatDateLong, daysUntil } from "@/lib/date-utils";

export const Route = createFileRoute("/verification/$numero")({
  component: VerificationPage,
});

interface DocData {
  numero: string;
  statut: string;
  dateObtention: string;
  dateExpiration?: string;
  apprenantNom: string;
  apprenantPrenom: string;
  formationNom: string;
  formationCode: string;
  formationType: string;
  centreNom: string;
  centreAgrement: string;
  centreAdresse: string;
  centreTel: string;
}

function VerificationPage() {
  const { numero } = Route.useParams();
  const [doc, setDoc] = useState<DocData | null>(null);
  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState<string>("");

  useEffect(() => {
    async function fetchDoc() {
      const { data } = await supabase
        .from("documents_generes")
        .select(`
          numero, statut, date_obtention, date_expiration,
          apprenants ( nom, prenom ),
          formations ( nom, code, type ),
          parametres:parametres!inner ( centre_nom, centre_agrement, centre_adresse, centre_tel )
        `)
        .eq("numero", numero)
        .single();

      if (data) {
        const a = data.apprenants as Record<string, string> | null;
        const f = data.formations as Record<string, string> | null;
        // parametres is a single row joined — may be array or object depending on version
        const p = Array.isArray(data.parametres)
          ? (data.parametres[0] as Record<string, string>)
          : (data.parametres as Record<string, string> | null);
        setDoc({
          numero: data.numero,
          statut: data.statut,
          dateObtention: data.date_obtention,
          dateExpiration: data.date_expiration ?? undefined,
          apprenantNom: a?.nom ?? "",
          apprenantPrenom: a?.prenom ?? "",
          formationNom: f?.nom ?? "",
          formationCode: f?.code ?? "",
          formationType: f?.type ?? "",
          centreNom: p?.centre_nom ?? "LEARNIX",
          centreAgrement: p?.centre_agrement ?? "",
          centreAdresse: p?.centre_adresse ?? "",
          centreTel: p?.centre_tel ?? "",
        });
      }
      setLoading(false);
    }
    fetchDoc();
  }, [numero]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      QRCode.toDataURL(window.location.href, { width: 160, margin: 1 }).then(setQr);
    }
  }, [numero]);

  let statut: "valide" | "expire" | "annule" | "introuvable" = "introuvable";
  if (doc) {
    if (doc.statut === "annule") statut = "annule";
    else if (doc.dateExpiration && daysUntil(doc.dateExpiration) < 0) statut = "expire";
    else statut = "valide";
  }

  const statusConfig = {
    valide: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "DOCUMENT VALIDE" },
    expire: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "DOCUMENT EXPIRÉ" },
    annule: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "DOCUMENT ANNULÉ — NON VALIDE" },
    introuvable: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", label: "DOCUMENT INTROUVABLE" },
  } as const;
  const cfg = statusConfig[statut];
  const Icon = cfg.icon;

  return (
    <div className="bg-gradient-ink min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center text-ivory">
          <div className="font-sans text-3xl font-extrabold tracking-widest">
            <span className="text-primary">L</span>EARNIX
          </div>
          <div className="mt-1 text-xs tracking-[0.4em] text-ivory/60">VÉRIFICATION OFFICIELLE</div>
        </div>

        <div className="shadow-elegant overflow-hidden rounded-2xl border border-white/10 bg-card">
          <div className={`${cfg.bg} ${cfg.border} border-b p-8 text-center`}>
            <Icon className={`mx-auto h-16 w-16 ${cfg.color}`} />
            <h1 className={`mt-3 font-serif text-2xl font-bold ${cfg.color}`}>{cfg.label}</h1>
            <p className="mt-2 font-mono text-xs text-muted-foreground">N° {numero}</p>
          </div>

          {loading && (
            <div className="p-8 text-center text-muted-foreground">Vérification en cours...</div>
          )}

          {!loading && doc ? (
            <div className="space-y-5 p-8">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Titulaire" value={`${doc.apprenantPrenom} ${doc.apprenantNom}`} large />
                <Field label="Formation" value={`${doc.formationCode} — ${doc.formationNom}`} large />
                <Field label="Date d'obtention" value={formatDateLong(doc.dateObtention)} />
                <Field label="Date d'expiration" value={doc.dateExpiration ? formatDateLong(doc.dateExpiration) : "Permanent"} />
                <Field label="Type" value={doc.formationType} />
                <Field label="Organisme" value={doc.centreNom} />
              </div>

              {qr && (
                <div className="flex items-center justify-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
                  <img src={qr} alt="QR" className="h-24 w-24" />
                  <div className="text-xs text-muted-foreground">
                    <div className="font-semibold text-foreground">QR code de cette vérification</div>
                    <div>Partagez cette URL pour confirmer l'authenticité du document.</div>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                <div className="flex gap-2">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                  <p className="text-foreground">
                    Ce document a été <strong>généré et certifié par {doc.centreNom}</strong>, organisme
                    de formation agréé sous le n° {doc.centreAgrement}.
                  </p>
                </div>
              </div>
            </div>
          ) : !loading && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                Le numéro <code className="rounded bg-muted px-1.5 py-0.5 font-mono">{numero}</code>{" "}
                ne correspond à aucun document enregistré.
              </p>
            </div>
          )}

          {doc && (
            <div className="border-t border-border bg-muted/30 px-8 py-4 text-center text-xs text-muted-foreground">
              {doc.centreNom} · {doc.centreAdresse} · Tél : {doc.centreTel}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ivory/40">
          © Learnix · Système officiel de certification
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 ${large ? "text-lg font-bold" : "text-base"} text-foreground`}>{value}</div>
    </div>
  );
}
