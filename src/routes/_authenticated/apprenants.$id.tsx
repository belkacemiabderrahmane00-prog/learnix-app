import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, FileText, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/date-utils";

export const Route = createFileRoute("/_authenticated/apprenants/$id")({
  component: ApprenantDetail,
});

function ApprenantDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const apprenant = useStore((s) => s.apprenants.find((a) => a.id === id));
  const documents = useStore((s) => s.documents.filter((d) => d.apprenantId === id));
  const formations = useStore((s) => s.formations);

  if (!apprenant) {
    return (
      <div className="p-8">
        <p>Apprenant introuvable.</p>
        <button onClick={() => navigate({ to: "/apprenants" })} className="text-primary">
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <button
        onClick={() => navigate({ to: "/apprenants" })}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour à la liste
      </button>

      <div className="shadow-card-soft flex items-start gap-6 rounded-xl border border-border bg-card p-6">
        {apprenant.photo ? (
          <img
            src={apprenant.photo}
            alt=""
            className="h-32 w-32 rounded-lg border-2 border-gold object-cover"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-lg bg-muted text-3xl text-muted-foreground">
            {apprenant.prenom[0]}
            {apprenant.nom[0]}
          </div>
        )}
        <div className="flex-1">
          <h1 className="font-serif text-3xl">
            {apprenant.prenom} {apprenant.nom}
          </h1>
          <div className="mt-2 grid gap-2 text-sm md:grid-cols-2">
            <Info label="Né le" value={formatDate(apprenant.dateNaissance)} />
            <Info label="Lieu" value={apprenant.lieuNaissance} />
            <Info label="Email" value={apprenant.email ?? "—"} />
            <Info label="Téléphone" value={apprenant.telephone ?? "—"} />
            <Info label="Entreprise" value={apprenant.entreprise ?? "—"} />
            <Info label="Statut" value={apprenant.statut} />
          </div>
        </div>
        <Link
          to="/generer"
          search={{ apprenantId: apprenant.id }}
          className="bg-gradient-red flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Générer un document
        </Link>
      </div>

      <div className="shadow-card-soft rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-serif text-xl">Documents générés ({documents.length})</h2>
        {documents.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Aucun document.</p>
        ) : (
          <div className="space-y-2">
            {documents.map((d) => {
              const f = formations.find((x) => x.id === d.formationId);
              return (
                <Link
                  key={d.id}
                  to="/documents/$id"
                  params={{ id: d.id }}
                  className="flex items-center justify-between rounded-lg border border-border bg-background p-3 hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">{f?.code} — {f?.nom}</div>
                      <div className="text-xs text-muted-foreground">
                        N° {d.numero} · obtenu le {formatDate(d.dateObtention)}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      d.statut === "valide"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {d.statut}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}: </span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
