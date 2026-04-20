import { Audience, Severity } from "@/types/cyber";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function normalizeArabicText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[\u064B-\u065F]/g, "")
    .replace(/\s+/g, " ");
}

export const severityWeight: Record<Severity, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export const severityMap: Record<Severity, { label: string; className: string }> = {
  low: {
    label: "منخفض",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
  medium: {
    label: "متوسط",
    className: "border-yellow-400/30 bg-yellow-400/10 text-yellow-200",
  },
  high: {
    label: "مرتفع",
    className: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  },
  critical: {
    label: "حرج",
    className: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  },
};

export const audienceMap: Record<Audience, string> = {
  individuals: "للأفراد",
  businesses: "للشركات",
  both: "للأفراد والشركات",
};

export const severityOptions = [
  { value: "all", label: "كل مستويات الخطورة" },
  { value: "low", label: "منخفض" },
  { value: "medium", label: "متوسط" },
  { value: "high", label: "مرتفع" },
  { value: "critical", label: "حرج" },
];

export const audienceOptions = [
  { value: "all", label: "الأفراد والشركات" },
  { value: "individuals", label: "الأفراد" },
  { value: "businesses", label: "الشركات" },
  { value: "both", label: "الجانبان" },
];

export const systemOptions = [
  "الأجهزة الشبكية",
  "الشبكات الداخلية",
  "البريد الإلكتروني",
  "الحسابات الرقمية",
  "خوادم الملفات",
  "محطات العمل",
  "الخدمات السحابية",
  "تطبيقات الويب",
  "الهواتف الذكية",
  "الأجهزة الشخصية",
];
