import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, FileText, ExternalLink } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDate, daysUntil } from "@/lib/date-utils";

export const Route = createFileRoute("/_authenticated/documents/")({
  component: DocumentsList,
});

function DocumentsList() {
  const documents = useStore((s) => s.documents);
  const apprenants = useStore((s) => s.apprenants);
  const formations = useStore((s) => s.formations);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = documents.filter((d) => {
    const ap = apprenants.find((a) => a.id === d.apprenantId);
    const matchQ =
      `${ap?.prenom ?? ""} ${ap?.nom ?? ""} ${d.numero}`
        .toLowerCase()
        .includes(q.toLowerCase());
    const matchF = filter === "all" || d.statut === filter;
    return matchQ && matchF;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Archives</p>
        <h1 className="mt-1 font-serif text-4xl">Documents générés</h1>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher (nom, numéro...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full rounded-md border border-input bg-card py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-input bg-card px-3 py-2 text-sm"
        >
          <option value="all">Tous les statuts</option>
          <option value="valide">Valide</option>
          <option value="expire">Expiré</option>
          <option value="annule">Annulé</option>
        </select>
      </div>

      <div className="shadow-card-soft overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Numéro</th>
              <th className="px-4 py-3 text-left">Apprenant</th>
              <th className="px-4 py-3 text-left">Formation</th>
              <th className="px-4 py-3 text-left">Obtention</th>
              <th className="px-4 py-3 text-left">Expiration</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => {
              const ap = apprenants.find((a) => a.id === d.apprenantId);
              const f = formations.find((x) => x.id === d.formationId);
              const days = daysUntil(d.dateExpiration);
              return (
                <tr key={d.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{d.numero}</td>
                  <td className="px-4 py-3 font-semibold">
                    {ap ? `${ap.prenom} ${ap.nom}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-muted px-2 py-0.5 text-xs">{f?.code}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(d.dateObtention)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(d.dateExpiration)}
                    {d.dateExpiration && days >= 0 && days <= 60 && (
                      <span className="ml-1 text-xs text-amber-600">({days}j)</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to="/documents/$id"
                      params={{ id: d.id }}
                      className="inline-flex items-center gap-1 rounded p-1.5 text-primary hover:bg-primary/10"
                    >
                      <FileText className="h-4 w-4" />
                    </Link>
                    <a
                      href={`/verification/${d.numero}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  Aucun document.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
