import { categories } from "@/data/categories";
import { specialists } from "@/data/specialists";
import { individualPlans } from "@/data/subscriptions";
import { threats } from "@/data/threats";
import { normalizeArabicText } from "@/lib/utils";

export type SearchResultKind = "category" | "threat" | "specialist" | "subscription" | "business";

export interface SearchResultItem {
  id: string;
  kind: SearchResultKind;
  title: string;
  subtitle: string;
  description: string;
  href: string;
}

function includesQuery(parts: string[], query: string) {
  return normalizeArabicText(parts.join(" ")).includes(normalizeArabicText(query));
}

export function getSearchResults(query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return {
      categories: [] as SearchResultItem[],
      threats: [] as SearchResultItem[],
      specialists: [] as SearchResultItem[],
      subscriptions: [] as SearchResultItem[],
      business: [] as SearchResultItem[],
      total: 0,
    };
  }

  const categoryResults = categories
    .filter((category) =>
      includesQuery(
        [category.name, category.shortDescription, category.longDescription, category.focusAreas.join(" ")],
        trimmedQuery,
      ),
    )
    .map<SearchResultItem>((category) => ({
      id: category.slug,
      kind: "category",
      title: category.name,
      subtitle: "تصنيف تهديدات",
      description: category.shortDescription,
      href: `/categories/${category.slug}`,
    }));

  const threatResults = threats
    .filter((threat) =>
      includesQuery(
        [
          threat.name,
          threat.category,
          threat.shortDescription,
          threat.definition,
          threat.threatType,
          threat.affectedSystems.join(" "),
          threat.keywords?.join(" ") ?? "",
        ],
        trimmedQuery,
      ),
    )
    .map<SearchResultItem>((threat) => ({
      id: threat.slug,
      kind: "threat",
      title: threat.name,
      subtitle: threat.category,
      description: threat.shortDescription,
      href: `/threats/${threat.slug}`,
    }));

  const specialistResults = specialists
    .filter((specialist) =>
      includesQuery(
        [
          specialist.name,
          specialist.primarySpecialty,
          specialist.description,
          specialist.experienceLevel,
          specialist.city,
          specialist.handles.join(" "),
          specialist.subSpecialties.join(" "),
        ],
        trimmedQuery,
      ),
    )
    .map<SearchResultItem>((specialist) => ({
      id: specialist.id,
      kind: "specialist",
      title: specialist.name,
      subtitle: specialist.primarySpecialty,
      description: `${specialist.experienceLevel} • يبدأ من ${specialist.starterPrice} ريال`,
      href: `/specialists?specialist=${specialist.id}`,
    }));

  const subscriptionResults = individualPlans
    .filter((plan) =>
      includesQuery([plan.name, plan.badge, plan.description, plan.priceNote, plan.features.join(" ")], trimmedQuery),
    )
    .map<SearchResultItem>((plan) => ({
      id: plan.id,
      kind: "subscription",
      title: plan.name,
      subtitle: "اشتراك أفراد",
      description: `${plan.price} • ${plan.badge}`,
      href: `/subscriptions?plan=${plan.id}`,
    }));

  const businessResults = includesQuery(
    ["حلول الشركات", "المبيعات", "حاسبة", "سيرفرات", "أجهزة", "شركة", "سعر تقديري"],
    trimmedQuery,
  )
    ? [
        {
          id: "business-solutions",
          kind: "business" as const,
          title: "حلول الشركات",
          subtitle: "حاسبة ومبيعات",
          description: "احسب تكلفة الأجهزة والسيرفرات ثم انقل البيانات مباشرة إلى فريق المبيعات.",
          href: "/subscriptions/business",
        },
      ]
    : [];

  return {
    categories: categoryResults,
    threats: threatResults,
    specialists: specialistResults,
    subscriptions: subscriptionResults,
    business: businessResults,
    total:
      categoryResults.length +
      threatResults.length +
      specialistResults.length +
      subscriptionResults.length +
      businessResults.length,
  };
}
