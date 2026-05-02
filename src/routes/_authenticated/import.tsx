import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Download, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Apprenant } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/import")({
  component: ImportExcel,
});

interface Row {
  data: Partial<Apprenant>;
  errors: string[];
}

const uid = () => Math.random().toString(36).slice(2, 11);

function ImportExcel() {
  const upsert = useStore((s) => s.upsertApprenant);
  const log = useStore((s) => s.log);
  const [rows, setRows] = useState<Row[]>([]);
  const [fileName, setFileName] = useState("");

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["nom", "prenom", "date_naissance", "lieu_naissance", "email", "telephone", "entreprise"],
      ["RAKIB", "MUSTAPHA", "1977-01-01", "TALMEST ESSAOUIRA", "demo@example.com", "+33600000000", "Acme"],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "apprenants");
    XLSX.writeFile(wb, "modele-apprenants-learnix.xlsx");
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target!.result as ArrayBuffer);
      const wb = XLSX.read(data, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, string>>(ws);
      const parsed: Row[] = json.map((r) => {
        const errors: string[] = [];
        const nom = (r.nom ?? "").toString().trim().toUpperCase();
        const prenom = (r.prenom ?? "").toString().trim().toUpperCase();
        const dn = (r.date_naissance ?? "").toString().trim();
        const lieu = (r.lieu_naissance ?? "").toString().trim().toUpperCase();
        if (!nom) errors.push("nom manquant");
        if (!prenom) errors.push("prénom manquant");
        if (!dn) errors.push("date_naissance manquante");
        else if (!/^\d{4}-\d{2}-\d{2}$/.test(dn)) errors.push("date au format AAAA-MM-JJ");
        if (!lieu) errors.push("lieu_naissance manquant");
        return {
          data: {
            nom, prenom, dateNaissance: dn, lieuNaissance: lieu,
            email: r.email?.toString(), telephone: r.telephone?.toString(),
            entreprise: r.entreprise?.toString(),
          },
          errors,
        };
      });
      setRows(parsed);
    };
    reader.readAsArrayBuffer(file);
  };

  const valid = rows.filter((r) => r.errors.length === 0);

  const handleImport = () => {
    valid.forEach((r) => {
      const a: Apprenant = {
        id: uid(),
        nom: r.data.nom!,
        prenom: r.data.prenom!,
        dateNaissance: r.data.dateNaissance!,
        lieuNaissance: r.data.lieuNaissance!,
        email: r.data.email,
        telephone: r.data.telephone,
        entreprise: r.data.entreprise,
        statut: "actif",
        createdAt: new Date().toISOString(),
      };
      upsert(a);
    });
    log({ type: "import", description: `Import Excel : ${valid.length} apprenants ajoutés` });
    toast.success(`${valid.length} apprenant(s) importé(s)`);
    setRows([]);
    setFileName("");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Outils</p>
        <h1 className="mt-1 font-serif text-4xl">Import Excel</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Importez vos apprenants en masse via un fichier Excel.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <button
          onClick={downloadTemplate}
          className="shadow-card-soft flex items-start gap-4 rounded-xl border border-border bg-card p-6 text-left hover:border-primary/40"
        >
          <Download className="h-6 w-6 text-primary" />
          <div>
            <div className="font-semibold">1. Télécharger le modèle</div>
            <div className="text-sm text-muted-foreground">
              Modèle .xlsx avec les colonnes attendues.
            </div>
          </div>
        </button>
        <label className="shadow-card-soft flex cursor-pointer items-start gap-4 rounded-xl border border-dashed border-primary/40 bg-card p-6 hover:border-primary">
          <Upload className="h-6 w-6 text-primary" />
          <div>
            <div className="font-semibold">2. Importer le fichier rempli</div>
            <div className="text-sm text-muted-foreground">
              {fileName || "Cliquez pour sélectionner un fichier .xlsx"}
            </div>
          </div>
          <input type="file" accept=".xlsx,.xls" onChange={onFile} className="hidden" />
        </label>
      </div>

      {rows.length > 0 && (
        <div className="shadow-card-soft rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl">Aperçu</h2>
              <p className="text-sm text-muted-foreground">
                {valid.length} ligne(s) valide(s) · {rows.length - valid.length} en erreur
              </p>
            </div>
            <button
              onClick={handleImport}
              disabled={valid.length === 0}
              className="bg-gradient-red rounded-md px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              Importer {valid.length} apprenant(s)
            </button>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Nom</th>
                <th className="px-3 py-2 text-left">Prénom</th>
                <th className="px-3 py-2 text-left">Naissance</th>
                <th className="px-3 py-2 text-left">Lieu</th>
                <th className="px-3 py-2 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-3 py-2">{r.data.nom}</td>
                  <td className="px-3 py-2">{r.data.prenom}</td>
                  <td className="px-3 py-2">{r.data.dateNaissance}</td>
                  <td className="px-3 py-2">{r.data.lieuNaissance}</td>
                  <td className="px-3 py-2">
                    {r.errors.length === 0 ? (
                      <span className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" /> OK
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-destructive" title={r.errors.join(", ")}>
                        <AlertCircle className="h-4 w-4" /> {r.errors.join(", ")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
