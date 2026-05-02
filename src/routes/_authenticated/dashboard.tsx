import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users,
  FileText,
  Clock,
  AlertTriangle,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { daysUntil, formatDate } from "@/lib/date-utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const apprenants = useStore((s) => s.apprenants);
  const documents = useStore((s) => s.documents);
  const history = useStore((s) => s.history);

  const actifs = apprenants.filter((a) => a.statut === "actif").length;
  const docsThisMonth = documents.filter((d) => {
    const dt = new Date(d.createdAt);
    const now = new Date();
    return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
  }).length;
  const expSoon = documents.filter((d) => {
    const days = daysUntil(d.dateExpiration);
    return d.statut === "valide" && days >= 0 && days <= 30;
  });
  const expired = documents.filter(
    (d) => d.statut === "valide" && daysUntil(d.dateExpiration) < 0,
  );
  const recentDocs = documents.slice(0, 5);
  const recentHistory = history.slice(0, 6);

  const cards = [
    {
      label: "Apprenants actifs",
      value: actifs,
      icon: Users,
      tint: "from-blue-500/10 to-blue-500/0",
      color: "text-blue-700",
    },
    {
      label: "Documents ce mois",
      value: docsThisMonth,
      icon: FileText,
      tint: "from-emerald-500/10 to-emerald-500/0",
      color: "text-emerald-700",
    },
    {
      label: "Expirent dans 30j",
      value: expSoon.length,
      icon: Clock,
      tint: "from-amber-500/10 to-amber-500/0",
      color: "text-amber-700",
    },
    {
      label: "Diplômes expirés",
      value: expired.length,
      icon: AlertTriangle,
      tint: "from-primary/15 to-primary/0",
      color: "text-primary",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <header className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Tableau de bord
          </p>
          <h1 className="mt-1 font-serif text-4xl text-foreground">Vue d'ensemble</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            État global de votre activité de certification Learnix.
          </p>
        </div>
        <Link
          to="/generer"
          className="bg-gradient-red flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elegant hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Générer un diplôme
        </Link>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className={`shadow-card-soft relative overflow-hidden rounded-xl border border-border bg-card p-5`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${c.tint} pointer-events-none`}
              />
              <div className="relative flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {c.label}
                  </div>
                  <div className="mt-2 font-serif text-4xl text-foreground">{c.value}</div>
                </div>
                <Icon className={`h-5 w-5 ${c.color}`} />
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Documents récents */}
        <div className="shadow-card-soft rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl">Derniers documents générés</h2>
            <Link
              to="/documents"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Tout voir <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {recentDocs.length === 0 && (
              <p className="text-sm text-muted-foreground">Aucun document pour l'instant.</p>
            )}
            {recentDocs.map((d) => {
              const ap = apprenants.find((a) => a.id === d.apprenantId);
              return (
                <Link
                  key={d.id}
                  to="/documents/$id"
                  params={{ id: d.id }}
                  className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3 hover:border-primary/40"
                >
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {ap ? `${ap.prenom} ${ap.nom}` : d.apprenantId}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      N° {d.numero} · {formatDate(d.createdAt)}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      d.statut === "valide"
                        ? "bg-emerald-100 text-emerald-700"
                        : d.statut === "expire"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {d.statut}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Activité */}
        <div className="shadow-card-soft rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-xl">Activité</h2>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="space-y-3">
            {recentHistory.map((h) => (
              <li key={h.id} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <div>
                  <div className="text-sm text-foreground">{h.description}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(h.createdAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Expirations à venir */}
      {expSoon.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-700" />
            <h2 className="font-serif text-xl text-amber-900">
              Diplômes à renouveler ({expSoon.length})
            </h2>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {expSoon.slice(0, 4).map((d) => {
              const ap = apprenants.find((a) => a.id === d.apprenantId);
              return (
                <div
                  key={d.id}
                  className="flex items-center justify-between rounded-md bg-white px-3 py-2"
                >
                  <span className="text-sm">
                    {ap ? `${ap.prenom} ${ap.nom}` : "—"} — N° {d.numero}
                  </span>
                  <span className="text-xs font-semibold text-amber-700">
                    expire dans {daysUntil(d.dateExpiration)}j
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
