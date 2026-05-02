import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";
import { daysUntil, formatDate } from "@/lib/date-utils";

export const Route = createFileRoute("/_authenticated/expirations")({
  component: Expirations,
});

function Expirations() {
  const documents = useStore((s) => s.documents);
  const apprenants = useStore((s) => s.apprenants);
  const formations = useStore((s) => s.formations);

  const buckets = {
    expired: [] as typeof documents,
    in7: [] as typeof documents,
    in30: [] as typeof documents,
    in60: [] as typeof documents,
    in90: [] as typeof documents,
  };

  documents.forEach((d) => {
    if (d.statut !== "valide" || !d.dateExpiration) return;
    const days = daysUntil(d.dateExpiration);
    if (days < 0) buckets.expired.push(d);
    else if (days <= 7) buckets.in7.push(d);
    else if (days <= 30) buckets.in30.push(d);
    else if (days <= 60) buckets.in60.push(d);
    else if (days <= 90) buckets.in90.push(d);
  });

  const sections = [
    { title: "Expirés", docs: buckets.expired, color: "bg-red-50 border-red-200", icon: AlertTriangle, iconColor: "text-red-600" },
    { title: "Expire dans 7 jours", docs: buckets.in7, color: "bg-orange-50 border-orange-200", icon: Clock, iconColor: "text-orange-600" },
    { title: "Expire dans 30 jours", docs: buckets.in30, color: "bg-amber-50 border-amber-200", icon: Clock, iconColor: "text-amber-600" },
    { title: "Expire dans 60 jours", docs: buckets.in60, color: "bg-yellow-50 border-yellow-200", icon: Clock, iconColor: "text-yellow-700" },
    { title: "Expire dans 90 jours", docs: buckets.in90, color: "bg-blue-50 border-blue-200", icon: Clock, iconColor: "text-blue-600" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Suivi</p>
        <h1 className="mt-1 font-serif text-4xl">Expirations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue calendrier des diplômes à renouveler.
        </p>
      </header>

      {sections.map((s) => (
        <section key={s.title} className={`rounded-xl border p-6 ${s.color}`}>
          <h2 className="mb-3 flex items-center gap-2 font-serif text-xl">
            <s.icon className={`h-5 w-5 ${s.iconColor}`} />
            {s.title} ({s.docs.length})
          </h2>
          {s.docs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun document.</p>
          ) : (
            <div className="grid gap-2 md:grid-cols-2">
              {s.docs.map((d) => {
                const ap = apprenants.find((a) => a.id === d.apprenantId);
                const f = formations.find((x) => x.id === d.formationId);
                const days = daysUntil(d.dateExpiration);
                return (
                  <Link
                    key={d.id}
                    to="/documents/$id"
                    params={{ id: d.id }}
                    className="flex items-center justify-between rounded-md bg-white px-3 py-2 hover:shadow-sm"
                  >
                    <div>
                      <div className="text-sm font-semibold">
                        {ap?.prenom} {ap?.nom} — {f?.code}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        N° {d.numero} · expire le {formatDate(d.dateExpiration)}
                      </div>
                    </div>
                    <span className="text-xs font-bold">
                      {days < 0 ? `expiré il y a ${-days}j` : `${days}j`}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
