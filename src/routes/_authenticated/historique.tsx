import { createFileRoute } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/date-utils";

export const Route = createFileRoute("/_authenticated/historique")({
  component: Historique,
});

function Historique() {
  const history = useStore((s) => s.history);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Traçabilité</p>
        <h1 className="mt-1 font-serif text-4xl">Historique</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {history.length} événements enregistrés.
        </p>
      </header>

      <div className="shadow-card-soft rounded-xl border border-border bg-card">
        <ul className="divide-y divide-border">
          {history.map((h) => (
            <li key={h.id} className="flex items-start gap-4 p-4">
              <span className="mt-1 inline-block rounded bg-muted px-2 py-0.5 text-xs font-semibold uppercase text-muted-foreground">
                {h.type}
              </span>
              <div className="flex-1">
                <div className="text-sm text-foreground">{h.description}</div>
                <div className="text-xs text-muted-foreground">{formatDate(h.createdAt)}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
