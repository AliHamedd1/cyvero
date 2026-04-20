"use client";

import { startTransition, useDeferredValue, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { FilterPanel } from "@/components/filter-panel";
import { ThreatCard } from "@/components/threat-card";
import { filterThreats } from "@/lib/search";
import { severityOptions } from "@/lib/utils";
import { Threat } from "@/types/cyber";

export function CategoryThreatExplorer({ threats }: { threats: Threat[] }) {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("all");
  const [system, setSystem] = useState("all");
  const [type, setType] = useState("all");
  const deferredSearch = useDeferredValue(search);
  const isFiltering = search !== deferredSearch;

  const systems = Array.from(new Set(threats.flatMap((item) => item.affectedSystems)));
  const types = Array.from(new Set(threats.map((item) => item.threatType)));
  const filteredThreats = filterThreats(threats, {
    query: deferredSearch,
    severity,
    system,
    type,
  });

  function resetFilters() {
    setSearch("");
    setSeverity("all");
    setSystem("all");
    setType("all");
  }

  return (
    <div className="space-y-8" aria-busy={isFiltering}>
      <FilterPanel
        search={search}
        onSearchChange={(value) => startTransition(() => setSearch(value))}
        severity={severity}
        onSeverityChange={setSeverity}
        system={system}
        onSystemChange={setSystem}
        type={type}
        onTypeChange={setType}
        severities={severityOptions}
        systems={systems}
        types={types}
        onReset={resetFilters}
      />

      <div
        aria-live="polite"
        className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-steel md:flex-row md:items-center md:justify-between"
      >
        <span>{filteredThreats.length} تهديدات مطابقة ضمن هذا التصنيف</span>
        {isFiltering ? <span className="animate-pulse text-cyanGlow">جارِ تحديث النتائج...</span> : null}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredThreats.map((threat) => (
          <ThreatCard key={threat.slug} threat={threat} />
        ))}
      </div>

      {filteredThreats.length === 0 ? (
        <EmptyState
          title="لا توجد نتائج داخل هذا التصنيف"
          description="يمكنك توسيع البحث أو تغيير الفلاتر، أو العودة إلى جميع التصنيفات للوصول إلى تهديدات قريبة من الحالة التي تبحث عنها."
          actionLabel="عرض كل التصنيفات"
          actionHref="/categories"
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
