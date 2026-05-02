import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Download, Mail, MessageCircle, XCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { DiplomaRenderer, isLandscapeFormation } from "@/components/diploma/DiplomaRenderer";
import { exportDiplomaPdf } from "@/lib/pdf-export";
import { formatDate } from "@/lib/date-utils";

export const Route = createFileRoute("/_authenticated/documents/$id")({
  component: DocumentDetail,
});

function DocumentDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const doc = useStore((s) => s.documents.find((d) => d.id === id));
  const apprenant = useStore((s) =>
    doc ? s.apprenants.find((a) => a.id === doc.apprenantId) : undefined,
  );
  const formation = useStore((s) =>
    doc ? s.formations.find((f) => f.id === doc.formationId) : undefined,
  );
  const settings = useStore((s) => s.settings);
  const updateDocument = useStore((s) => s.updateDocument);
  const log = useStore((s) => s.log);
  const [busy, setBusy] = useState(false);

  if (!doc || !apprenant || !formation) {
    return (
      <div className="p-8">
        <p>Document introuvable.</p>
      </div>
    );
  }

  const isLandscape = isLandscapeFormation(formation);
  const diplWidth = isLandscape ? 1123 : 794;
  const diplHeight = isLandscape ? 794 : 1123;
  const previewScale = isLandscape ? 0.72 : 0.5;
  const containerHeight = Math.round(diplHeight * previewScale) + 48;

  const handlePdf = async () => {
    setBusy(true);
    try {
      await exportDiplomaPdf(
        "diploma-render",
        `Diplome-${formation.code}-${apprenant.nom}-${apprenant.prenom}.pdf`,
        isLandscape,
      );
      log({ type: "document", description: `Téléchargement PDF — N° ${doc.numero}`, documentId: doc.id });
      toast.success("PDF téléchargé");
    } catch {
      toast.error("Erreur lors de l'export PDF");
    } finally {
      setBusy(false);
    }
  };

  const handleAnnuler = () => {
    if (!confirm("Annuler ce document ? Il deviendra invalide sur la page de vérification publique.")) return;
    updateDocument(doc.id, { statut: "annule" });
    log({ type: "document", description: `Annulation — N° ${doc.numero}`, documentId: doc.id });
    toast.success("Document annulé");
  };

  const handleEmail = () => {
    if (!apprenant.email) {
      toast.error("L'apprenant n'a pas d'email");
      return;
    }
    const subject = encodeURIComponent("Votre diplôme Learnix");
    const body = encodeURIComponent(
      `Bonjour ${apprenant.prenom},\n\nVeuillez trouver ci-joint votre document officiel Learnix concernant la formation ${formation.nom}.\n\nVous pouvez vérifier son authenticité ici :\n${settings.verificationBaseUrl}/verification/${doc.numero}\n\nCordialement,\nL'équipe Learnix`,
    );
    window.location.href = `mailto:${apprenant.email}?subject=${subject}&body=${body}`;
    log({ type: "envoi", description: `Email envoyé à ${apprenant.email}`, documentId: doc.id });
  };

  const handleWhatsApp = () => {
    if (!apprenant.telephone) {
      toast.error("L'apprenant n'a pas de téléphone");
      return;
    }
    const tel = apprenant.telephone.replace(/[^0-9]/g, "");
    const text = encodeURIComponent(
      `Bonjour ${apprenant.prenom}, voici votre document Learnix (${formation.code}). Vérification : ${settings.verificationBaseUrl}/verification/${doc.numero}`,
    );
    window.open(`https://wa.me/${tel}?text=${text}`, "_blank");
    log({ type: "envoi", description: `WhatsApp envoyé à ${apprenant.telephone}`, documentId: doc.id });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate({ to: "/documents" })}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </button>
        <div className="flex flex-wrap gap-2">
          <a
            href={`/verification/${doc.numero}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
          >
            <ExternalLink className="h-4 w-4" />
            Page publique
          </a>
          <button
            onClick={handleEmail}
            className="flex items-center gap-1.5 rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
          >
            <Mail className="h-4 w-4" />
            Email
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-1.5 rounded-md border border-input bg-card px-3 py-2 text-sm hover:bg-muted"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
          {doc.statut !== "annule" && (
            <button
              onClick={handleAnnuler}
              className="flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              <XCircle className="h-4 w-4" />
              Annuler
            </button>
          )}
          <button
            onClick={handlePdf}
            disabled={busy}
            className="bg-gradient-red flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {busy ? "Génération..." : "Télécharger PDF"}
          </button>
        </div>
      </div>

      {/* Métadonnées */}
      <div className="grid gap-3 rounded-xl border border-border bg-card p-4 text-sm md:grid-cols-4">
        <div>
          <div className="text-xs uppercase text-muted-foreground">Numéro</div>
          <div className="font-mono font-semibold">{doc.numero}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground">Apprenant</div>
          <div className="font-semibold">{apprenant.prenom} {apprenant.nom}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground">Formation</div>
          <div className="font-semibold">{formation.code}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground">Statut</div>
          <span
            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              doc.statut === "valide"
                ? "bg-emerald-100 text-emerald-700"
                : doc.statut === "expire"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-red-100 text-red-700"
            }`}
          >
            {doc.statut}
          </span>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground">Examen</div>
          <div>{formatDate(doc.dateExamen)}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground">Obtention</div>
          <div>{formatDate(doc.dateObtention)}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground">Expiration</div>
          <div>{doc.dateExpiration ? formatDate(doc.dateExpiration) : "—"}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-muted-foreground">Lieu</div>
          <div>{doc.lieu}</div>
        </div>
        {doc.cnapsNumero && (
          <div className="col-span-2">
            <div className="text-xs uppercase text-muted-foreground">CNAPS</div>
            <div className="font-mono">{doc.cnapsNumero}</div>
          </div>
        )}
      </div>

      {/* Aperçu du diplôme — scaled */}
      <div
        className="overflow-auto rounded-xl border border-border bg-muted/30 p-6"
        style={{ minHeight: `${containerHeight}px` }}
      >
        <div
          style={{
            transform: `scale(${previewScale})`,
            transformOrigin: "top center",
            width: `${diplWidth}px`,
            margin: "0 auto",
            height: `${diplHeight}px`,
          }}
        >
          <DiplomaRenderer
            apprenant={apprenant}
            formation={formation}
            document={doc}
            settings={settings}
          />
        </div>
      </div>
    </div>
  );
}
