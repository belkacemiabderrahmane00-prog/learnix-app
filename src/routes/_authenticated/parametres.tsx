import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/_authenticated/parametres")({
  component: Parametres,
});

function Parametres() {
  const settings = useStore((s) => s.settings);
  const update = useStore((s) => s.updateSettings);
  const [form, setForm] = useState(settings);

  const onSave = async () => {
    await update(form);
    toast.success("Paramètres sauvegardés");
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-8">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Configuration</p>
        <h1 className="mt-1 font-serif text-4xl">Paramètres</h1>
      </header>

      {/* Centre */}
      <section className="shadow-card-soft rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 font-serif text-xl">Centre de formation</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["centreNom", "Nom"],
            ["centreAdresse", "Adresse"],
            ["centreTel", "Téléphone"],
            ["centreEmail", "Email"],
            ["centreSiret", "Siret"],
            ["centreActivite", "N° d'activité"],
            ["centreAgrement", "N° d'agrément"],
            ["centreDeclaration", "Déclaration d'existence"],
            ["presidentNom", "Président par défaut"],
            ["representantNom", "Représentant SDIS — Nom"],
            ["representantGrade", "Représentant SDIS — Grade"],
            ["verificationBaseUrl", "URL de vérification"],
            ["centreForCode", "Code FOR (Qualiopi)"],
            ["centreQualiopi", "Certificat Qualiopi"],
            ["centreAps", "Agrément APS"],
          ].map(([k, label]) => (
            <div key={k}>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {label}
              </label>
              <input
                value={((form as never)[k] as string) ?? ""}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onSave}
            className="bg-gradient-red flex items-center gap-2 rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Save className="h-4 w-4" />
            Enregistrer
          </button>
        </div>
      </section>

      <section className="shadow-card-soft rounded-xl border border-border bg-card p-6">
        <h2 className="mb-2 font-serif text-xl">Gestion des utilisateurs</h2>
        <p className="text-sm text-muted-foreground">
          Les comptes administrateurs sont gérés directement dans le tableau de bord Supabase.{" "}
          <strong>Authentication → Users → Invite user</strong>.
        </p>
      </section>
    </div>
  );
}
