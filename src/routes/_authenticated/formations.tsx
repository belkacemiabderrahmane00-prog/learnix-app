import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, CheckCircle2, ShieldCheck, RotateCcw, Award, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Formation } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/formations")({
  component: Formations,
});

const TYPE_ICONS: Record<string, React.ElementType> = {
  diplome: ShieldCheck,
  attestation: RotateCcw,
  certificat: Award,
};

const TYPE_LABELS: Record<string, string> = {
  diplome: "Diplôme",
  attestation: "Attestation",
  certificat: "Certificat",
};

const CODE_COLORS: Record<string, string> = {
  SSIAP1: "bg-blue-600",
  SSIAP2: "bg-blue-700",
  SSIAP3: "bg-blue-800",
  RECYCLAGE1: "bg-cyan-600",
  RECYCLAGE2: "bg-cyan-700",
  RECYCLAGE3: "bg-cyan-800",
  CQPAPS: "bg-purple-700",
  SST: "bg-emerald-600",
  H0B0: "bg-amber-600",
};

function Formations() {
  const formations = useStore((s) => s.formations);
  const initialized = useStore((s) => s.initialized);

  const ssiap = formations.filter((f) => f.code.startsWith("SSIAP"));
  const recyclage = formations.filter((f) => f.code.startsWith("RECYCLAGE"));
  const autres = formations.filter((f) => !f.code.startsWith("SSIAP") && !f.code.startsWith("RECYCLAGE"));

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-8">
      <header className="border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Catalogue</p>
        <h1 className="mt-1 font-serif text-4xl">Formations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {initialized
            ? `${formations.length} formations configurées avec leurs templates et durées de validité.`
            : "Chargement des formations…"}
        </p>
      </header>

      {!initialized && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      )}

      {initialized && (
        <>
          {/* SSIAP Diplômes */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-700" />
              <h2 className="font-serif text-xl text-foreground">Diplômes SSIAP</h2>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                Validité 3 ans
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {ssiap.map((f) => <FormationCard key={f.id} f={f} />)}
            </div>
          </section>

          {/* Recyclages SSIAP */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-cyan-700" />
              <h2 className="font-serif text-xl text-foreground">Recyclages SSIAP</h2>
              <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-xs font-semibold text-cyan-700">
                Renouvellement tous les 3 ans
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {recyclage.map((f) => <FormationCard key={f.id} f={f} />)}
            </div>
          </section>

          {/* Autres formations */}
          {autres.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-700" />
                <h2 className="font-serif text-xl text-foreground">Autres formations</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {autres.map((f) => <FormationCard key={f.id} f={f} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function FormationCard({ f }: { f: Formation }) {
  const Icon = TYPE_ICONS[f.type] ?? GraduationCap;
  const bgColor = CODE_COLORS[f.code] ?? "bg-primary";

  return (
    <div className="shadow-card-soft group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-elegant">
      <div className="mb-3 flex items-start justify-between">
        <div className={`${bgColor} flex h-10 w-10 items-center justify-center rounded-lg`}>
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        {f.actif ? (
          <span className="flex items-center gap-1 text-xs text-emerald-600">
            <CheckCircle2 className="h-3 w-3" /> Actif
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Inactif</span>
        )}
      </div>

      <div className={`inline-block rounded px-2 py-0.5 text-xs font-bold text-white ${bgColor} mb-1`}>
        {f.code}
      </div>
      <h3 className="mt-1 font-serif text-base leading-tight">{f.nom}</h3>
      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{f.sousTitre}</p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Icon className="h-3 w-3" />
          {TYPE_LABELS[f.type] ?? f.type}
        </span>
        <span className="text-muted-foreground">
          Validité :{" "}
          <strong className="text-foreground">
            {f.dureeValiditeMois > 0 ? `${f.dureeValiditeMois} mois` : "permanent"}
          </strong>
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Template :{" "}
          <span className="font-medium text-foreground">{f.templateId}</span>
        </span>
        <span className="rounded bg-muted px-1.5 py-0.5 capitalize">
          {f.orientation ?? "portrait"}
        </span>
      </div>
    </div>
  );
}
