"use client";

import { startTransition, useDeferredValue, useState } from "react";

import { CategoryCard } from "@/components/category-card";
import { EmptyState } from "@/components/empty-state";
import { FilterPanel } from "@/components/filter-panel";
import { ThreatCard } from "@/components/threat-card";
import { audienceMap, severityOptions } from "@/lib/utils";
import { filterThreats, getVisibleCategories } from "@/lib/search";
import { Category, Threat } from "@/types/cyber";

export function ThreatCatalog({
  categories,
  threats,
  initialQuery = "",
}: {
  categories: Category[];
  threats: Threat[];
  initialQuery?: string;
}) {
  const [search, setSearch] = useState(initialQuery);
  const [severity, setSeverity] = useState("all");
  const [system, setSystem] = useState("all");
  const [type, setType] = useState("all");
  const [audience, setAudience] = useState("all");
  const deferredSearch = useDeferredValue(search);

  const isFiltering = search !== deferredSearch;
  const hasActiveFilters =
    deferredSearch.length > 0 ||
    severity !== "all" ||
    system !== "all" ||
    type !== "all" ||
    audience !== "all";
  const types = Array.from(new Set(threats.map((item) => item.threatType)));
  const systems = Array.from(new Set(threats.flatMap((item) => item.affectedSystems)));
  const filteredThreats = filterThreats(threats, {
    query: deferredSearch,
    severity,
    system,
    type,
    audience,
  });
  const visibleCategories = hasActiveFilters
    ? categories.filter((category) =>
        filteredThreats.some((threat) => threat.categorySlug === category.slug),
      )
    : getVisibleCategories(categories, threats, deferredSearch);

  function resetFilters() {
    setSearch("");
    setSeverity("all");
    setSystem("all");
    setType("all");
    setAudience("all");
  }

  return (
    <div className="space-y-8" aria-busy={isFiltering}>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleCategories.map((category) => (
          <CategoryCard
            key={category.slug}
            category={category}
            threatCount={threats.filter((threat) => threat.categorySlug === category.slug).length}
          />
        ))}
      </div>

      <FilterPanel
        search={search}
        onSearchChange={(value) => startTransition(() => setSearch(value))}
        severity={severity}
        onSeverityChange={setSeverity}
        system={system}
        onSystemChange={setSystem}
        type={type}
        onTypeChange={setType}
        audience={audience}
        onAudienceChange={setAudience}
        severities={severityOptions}
        systems={systems}
        types={types}
        onReset={resetFilters}
      />

      <div
        aria-live="polite"
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-steel md:flex-row md:items-center md:justify-between"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-3 py-1 text-cyanGlow">
            {filteredThreats.length} نتيجة مطابقة
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            {visibleCategories.length} تصنيف ظاهر
          </span>
          {deferredSearch ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              البحث: <span className="text-white">{deferredSearch}</span>
            </span>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span>
            الجمهور:{" "}
            <span className="text-white">
              {audience === "all"
                ? "الأفراد والشركات"
                : audienceMap[audience as keyof typeof audienceMap]}
            </span>
          </span>
          {isFiltering ? <span className="animate-pulse text-cyanGlow">جارِ تحديث النتائج...</span> : null}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredThreats.map((threat) => (
          <ThreatCard key={threat.slug} threat={threat} />
        ))}
      </div>

      {filteredThreats.length === 0 ? (
        <EmptyState
          title="لا توجد نتائج مطابقة حاليًا"
          description="جرّب تعديل كلمات البحث أو إعادة ضبط الفلاتر للوصول إلى تهديدات أو تصنيفات أخرى داخل موسوعة Cyvero."
          actionLabel="اطلب مختص"
          actionHref="/request-expert"
          secondaryAction={
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
            >
              إعادة ضبط الفلاتر
            </button>
          }
        />
      ) : null}
    </div>
  );
}
