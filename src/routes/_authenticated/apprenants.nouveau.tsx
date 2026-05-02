import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Apprenant } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/apprenants/nouveau")({
  component: NewApprenant,
});

const uid = () => Math.random().toString(36).slice(2, 11);

function NewApprenant() {
  const navigate = useNavigate();
  const upsert = useStore((s) => s.upsertApprenant);
  const log = useStore((s) => s.log);
  const [form, setForm] = useState<Partial<Apprenant>>({
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    email: "",
    telephone: "",
    statut: "actif",
  });
  const [photo, setPhoto] = useState<string | undefined>();

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nom || !form.prenom || !form.dateNaissance || !form.lieuNaissance) {
      toast.error("Champs obligatoires manquants");
      return;
    }
    const a: Apprenant = {
      id: uid(),
      nom: form.nom!,
      prenom: form.prenom!,
      dateNaissance: form.dateNaissance!,
      lieuNaissance: form.lieuNaissance!,
      email: form.email,
      telephone: form.telephone,
      adresse: form.adresse,
      entreprise: form.entreprise,
      notes: form.notes,
      photo,
      statut: "actif",
      createdAt: new Date().toISOString(),
    };
    upsert(a);
    log({
      type: "apprenant",
      description: `Création de l'apprenant ${a.prenom} ${a.nom}`,
      apprenantId: a.id,
    });
    toast.success("Apprenant créé");
    navigate({ to: "/apprenants" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <button
        onClick={() => navigate({ to: "/apprenants" })}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Retour
      </button>
      <h1 className="font-serif text-4xl">Nouvel apprenant</h1>

      <form
        onSubmit={onSubmit}
        className="shadow-card-soft space-y-5 rounded-xl border border-border bg-card p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nom *">
            <input
              required
              value={form.nom ?? ""}
              onChange={(e) => setForm({ ...form, nom: e.target.value.toUpperCase() })}
              className={inputCls}
            />
          </Field>
          <Field label="Prénom *">
            <input
              required
              value={form.prenom ?? ""}
              onChange={(e) => setForm({ ...form, prenom: e.target.value.toUpperCase() })}
              className={inputCls}
            />
          </Field>
          <Field label="Date de naissance *">
            <input
              required
              type="date"
              value={form.dateNaissance ?? ""}
              onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Lieu de naissance *">
            <input
              required
              value={form.lieuNaissance ?? ""}
              onChange={(e) => setForm({ ...form, lieuNaissance: e.target.value.toUpperCase() })}
              className={inputCls}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Téléphone">
            <input
              value={form.telephone ?? ""}
              onChange={(e) => setForm({ ...form, telephone: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Adresse" full>
            <input
              value={form.adresse ?? ""}
              onChange={(e) => setForm({ ...form, adresse: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Entreprise">
            <input
              value={form.entreprise ?? ""}
              onChange={(e) => setForm({ ...form, entreprise: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Photo d'identité">
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-input bg-background px-3 py-2 text-sm hover:bg-muted">
              <Upload className="h-4 w-4" />
              {photo ? "Photo chargée ✓" : "Ajouter une photo"}
              <input type="file" accept="image/*" onChange={onPhoto} className="hidden" />
            </label>
          </Field>
          <Field label="Notes internes" full>
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className={inputCls}
            />
          </Field>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/apprenants" })}
            className="rounded-md border border-input px-4 py-2 text-sm hover:bg-muted"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-gradient-red rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Créer l'apprenant
          </button>
        </div>
      </form>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}
