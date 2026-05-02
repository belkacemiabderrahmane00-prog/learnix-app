import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, CheckCircle2, XCircle } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/formations")({
  component: Formations,
});

function Formations() {
  const formations = useStore((s) => s.formations);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Catalogue</p>
        <h1 className="mt-1 font-serif text-4xl">Formations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formations.length} formations configurées avec leurs templates et durées de validité.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {formations.map((f) => (
          <div
            key={f.id}
            className="shadow-card-soft group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-elegant"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="bg-gradient-red flex h-10 w-10 items-center justify-center rounded-lg">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              {f.actif ? (
                <span className="flex items-center gap-1 text-xs text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Actif
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <XCircle className="h-3 w-3" /> Inactif
                </span>
              )}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              {f.code}
            </div>
            <h3 className="mt-1 font-serif text-lg leading-tight">{f.nom}</h3>
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{f.sousTitre}</p>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
              <span className="rounded bg-muted px-2 py-0.5 capitalize text-muted-foreground">
                {f.type}
              </span>
              <span className="text-muted-foreground">
                Validité :{" "}
                <strong className="text-foreground">
                  {f.dureeValiditeMois > 0 ? `${f.dureeValiditeMois} mois` : "permanent"}
                </strong>
              </span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Template :{" "}
              <span className="font-medium text-foreground">{f.templateId}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
