import { categories } from "@/data/categories";
import { threats } from "@/data/threats";
import { Category, CategorySlug, Threat } from "@/types/cyber";

export function getAllCategories(): Category[] {
  return categories;
}

export function getAllThreats(): Threat[] {
  return threats;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getThreatBySlug(slug: string) {
  return threats.find((threat) => threat.slug === slug);
}

export function getThreatsByCategory(categorySlug: CategorySlug) {
  return threats.filter((threat) => threat.categorySlug === categorySlug);
}

export function getRelatedThreats(slug: string, categorySlug: CategorySlug) {
  return threats
    .filter((threat) => threat.slug !== slug && threat.categorySlug === categorySlug)
    .slice(0, 3);
}

export function getFeaturedThreats() {
  const featuredSlugs = [
    "network-denial-of-service",
    "ransomware-file-encryption",
    "phishing-fake-login-pages",
    "account-session-hijacking",
    "malware-infostealer",
    "data-cloud-sharing-misuse",
  ];

  return featuredSlugs
    .map((slug) => getThreatBySlug(slug))
    .filter((threat): threat is Threat => Boolean(threat));
}

export function getHomeStats() {
  return [
    { label: "عدد التصنيفات", value: categories.length.toString() },
    { label: "عدد التهديدات", value: threats.length.toString() },
    { label: "عدد المقالات الإرشادية", value: "48" },
    { label: "عدد الحالات القابلة للتحليل", value: "120" },
  ];
}

export function getThreatTypeOptions(items: Threat[]) {
  return Array.from(new Set(items.map((item) => item.threatType)));
}

export function getSystemOptions(items: Threat[]) {
  return Array.from(new Set(items.flatMap((item) => item.affectedSystems)));
}
