import { BusinessQuoteSummary, CompanyType } from "@/types/cyber";

export const computerUnitPrice = 500;
export const serverUnitPrice = 800;

export const companyTypeOptions: Array<{
  value: CompanyType;
  label: string;
  hint: string;
}> = [
  { value: "small", label: "شركة صغيرة", hint: "فرق صغيرة وبنية تشغيلية مركزة تحتاج إلى حماية مرنة وسريعة." },
  { value: "medium", label: "شركة متوسطة", hint: "منشآت نامية تحتاج إلى تغطية أوسع وإدارة أوضح للمخاطر." },
  { value: "large", label: "شركة كبيرة", hint: "بيئات تشغيلية كبيرة مع عدد أعلى من الأصول والتوزيع." },
  { value: "education", label: "جهة تعليمية", hint: "معامل، مستخدمون كثر، وحاجة إلى تنظيم الوصول والأنظمة." },
  { value: "technology", label: "جهة تقنية", hint: "بنية رقمية كثيفة واعتماد أكبر على الخدمات السحابية والتطبيقات." },
  { value: "government", label: "جهة حكومية", hint: "حساسية أعلى للامتثال، الاستمرارية، وحوكمة الأمن المؤسسي." },
  { value: "other", label: "أخرى", hint: "حالات خاصة يمكن لفريق المبيعات تخصيصها حسب الاحتياج." },
];

export function getCompanyTypeOption(companyType: CompanyType) {
  return companyTypeOptions.find((option) => option.value === companyType) ?? companyTypeOptions[0];
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function clampCount(value: number) {
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }

  return value;
}

export function calculateEstimatedPrice(computerCount: number, serverCount: number) {
  return computerCount * computerUnitPrice + serverCount * serverUnitPrice;
}

export function parseCompanyType(value: string | null | undefined): CompanyType {
  const matched = companyTypeOptions.find((option) => option.value === value);
  return matched?.value ?? "small";
}

interface SearchParamsLike {
  get: (name: string) => string | null;
}

export function readBusinessQuoteSummary(searchParams: SearchParamsLike): BusinessQuoteSummary {
  const companyType = parseCompanyType(searchParams.get("companyType"));
  const computerCount = clampCount(Number(searchParams.get("computers") ?? 0));
  const serverCount = clampCount(Number(searchParams.get("servers") ?? 0));

  return {
    companyType,
    computerCount,
    serverCount,
    estimatedPrice: calculateEstimatedPrice(computerCount, serverCount),
  };
}

export function buildSalesHref(summary: BusinessQuoteSummary) {
  const params = new URLSearchParams({
    companyType: summary.companyType,
    computers: String(summary.computerCount),
    servers: String(summary.serverCount),
    estimate: String(summary.estimatedPrice),
  });

  return `/sales?${params.toString()}`;
}
