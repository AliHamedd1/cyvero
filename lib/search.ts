import { Category, Threat } from "@/types/cyber";
import { normalizeArabicText, severityWeight } from "@/lib/utils";

interface ThreatFilterOptions {
  query?: string;
  severity?: string;
  system?: string;
  type?: string;
  audience?: string;
}

function buildThreatSearchIndex(threat: Threat) {
  return normalizeArabicText(
    [
      threat.name,
      threat.category,
      threat.shortDescription,
      threat.definition,
      threat.fullDescription,
      threat.threatType,
      threat.howItReachesTarget,
      threat.affectedSystems.join(" "),
      threat.warningSigns.join(" "),
      threat.impact.join(" "),
      threat.prevention.join(" "),
      threat.selfProtection.join(" "),
      threat.initialResponse.join(" "),
      threat.whenToEscalate.join(" "),
      threat.faq.map((item) => `${item.question} ${item.answer}`).join(" "),
      threat.keywords?.join(" ") ?? "",
    ].join(" "),
  );
}

export function matchesThreatQuery(threat: Threat, query: string) {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = normalizeArabicText(query);
  return buildThreatSearchIndex(threat).includes(normalizedQuery);
}

export function matchesCategoryQuery(category: Category, query: string) {
  if (!query.trim()) {
    return true;
  }

  const normalizedQuery = normalizeArabicText(query);
  const haystack = normalizeArabicText(
    [category.name, category.shortDescription, category.longDescription, category.focusAreas.join(" ")].join(
      " ",
    ),
  );

  return haystack.includes(normalizedQuery);
}

export function filterThreats(threats: Threat[], filters: ThreatFilterOptions) {
  return threats
    .filter((threat) => {
      const matchesSearch = matchesThreatQuery(threat, filters.query ?? "");
      const matchesSeverity = !filters.severity || filters.severity === "all" || threat.severity === filters.severity;
      const matchesSystem = !filters.system || filters.system === "all" || threat.affectedSystems.includes(filters.system);
      const matchesType = !filters.type || filters.type === "all" || threat.threatType === filters.type;
      const matchesAudience =
        !filters.audience || filters.audience === "all" || threat.audience === filters.audience;

      return matchesSearch && matchesSeverity && matchesSystem && matchesType && matchesAudience;
    })
    .sort((left, right) => {
      const severityDifference = severityWeight[right.severity] - severityWeight[left.severity];
      if (severityDifference !== 0) {
        return severityDifference;
      }

      return left.name.localeCompare(right.name, "ar");
    });
}

export function getVisibleCategories(categories: Category[], threats: Threat[], query: string) {
  if (!query.trim()) {
    return categories;
  }

  return categories.filter((category) => {
    if (matchesCategoryQuery(category, query)) {
      return true;
    }

    return threats.some(
      (threat) => threat.categorySlug === category.slug && matchesThreatQuery(threat, query),
    );
  });
}
