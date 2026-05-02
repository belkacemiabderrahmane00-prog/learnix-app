import { format, parseISO, isValid } from "date-fns";
import { fr } from "date-fns/locale";

export const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = typeof iso === "string" ? parseISO(iso) : iso;
  if (!isValid(d)) return iso ?? "—";
  return format(d, "dd/MM/yyyy", { locale: fr });
};

export const formatDateLong = (iso?: string) => {
  if (!iso) return "—";
  const d = parseISO(iso);
  if (!isValid(d)) return iso;
  return format(d, "d MMMM yyyy", { locale: fr });
};

export const daysUntil = (iso?: string) => {
  if (!iso) return Infinity;
  const d = parseISO(iso);
  if (!isValid(d)) return Infinity;
  return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
};

export const isExpired = (iso?: string) => daysUntil(iso) < 0;
