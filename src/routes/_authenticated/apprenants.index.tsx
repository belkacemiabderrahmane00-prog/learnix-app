import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, User as UserIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/date-utils";

export const Route = createFileRoute("/_authenticated/apprenants/")({
  component: ApprenantsList,
});

function ApprenantsList() {
  const apprenants = useStore((s) => s.apprenants);
  const documents = useStore((s) => s.documents);
  const deleteApprenant = useStore((s) => s.deleteApprenant);
  const log = useStore((s) => s.log);
  const [q, setQ] = useState("");

  const filtered = apprenants.filter((a) =>
    `${a.prenom} ${a.nom} ${a.email ?? ""}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-8">
      <header className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Gestion</p>
          <h1 className="mt-1 font-serif text-4xl">Apprenants</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {apprenants.length} apprenant{apprenants.length > 1 ? "s" : ""} enregistré
            {apprenants.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          to="/apprenants/nouveau"
          className="bg-gradient-red flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nouvel apprenant
        </Link>
      </header>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher par nom, prénom, email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-md border border-input bg-card py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="shadow-card-soft overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Apprenant</th>
              <th className="px-4 py-3 text-left">Naissance</th>
              <th className="px-4 py-3 text-left">Contact</th>
              <th className="px-4 py-3 text-left">Documents</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => {
              const docCount = documents.filter((d) => d.apprenantId === a.id).length;
              return (
                <tr key={a.id} className="border-t border-border hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link
                      to="/apprenants/$id"
                      params={{ id: a.id }}
                      className="flex items-center gap-3"
                    >
                      {a.photo ? (
                        <img
                          src={a.photo}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-foreground">
                          {a.prenom} {a.nom}
                        </div>
                        <div className="text-xs text-muted-foreground">{a.lieuNaissance}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(a.dateNaissance)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <div>{a.email ?? "—"}</div>
                    <div className="text-xs">{a.telephone ?? ""}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold">
                      {docCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        a.statut === "actif"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {a.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm(`Supprimer ${a.prenom} ${a.nom} ?`)) {
                          deleteApprenant(a.id);
                          log({
                            type: "apprenant",
                            description: `Suppression de ${a.prenom} ${a.nom}`,
                          });
                          toast.success("Apprenant supprimé");
                        }
                      }}
                      className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  Aucun apprenant trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
