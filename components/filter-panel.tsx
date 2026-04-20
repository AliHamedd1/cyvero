"use client";

interface FilterPanelProps {
  search: string;
  onSearchChange: (value: string) => void;
  severity: string;
  onSeverityChange: (value: string) => void;
  system: string;
  onSystemChange: (value: string) => void;
  type: string;
  onTypeChange: (value: string) => void;
  audience?: string;
  onAudienceChange?: (value: string) => void;
  severities: Array<{ value: string; label: string }>;
  systems: string[];
  types: string[];
  onReset?: () => void;
}

export function FilterPanel({
  search,
  onSearchChange,
  severity,
  onSeverityChange,
  system,
  onSystemChange,
  type,
  onTypeChange,
  audience,
  onAudienceChange,
  severities,
  systems,
  types,
  onReset,
}: FilterPanelProps) {
  const controlClassName =
    "rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none";

  return (
    <div className="panel-soft cyber-card grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-5">
      <label className="grid gap-2 text-xs font-semibold text-steel">
        البحث
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ابحث في التهديدات"
          className={controlClassName}
        />
      </label>

      <label className="grid gap-2 text-xs font-semibold text-steel">
        مستوى الخطورة
        <select
          value={severity}
          onChange={(event) => onSeverityChange(event.target.value)}
          className={controlClassName}
          aria-label="فلترة حسب مستوى الخطورة"
        >
          {severities.map((item) => (
            <option key={item.value} value={item.value} className="bg-slatecore text-white">
              {item.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-xs font-semibold text-steel">
        النظام المتأثر
        <select
          value={system}
          onChange={(event) => onSystemChange(event.target.value)}
          className={controlClassName}
          aria-label="فلترة حسب النظام المتأثر"
        >
          <option value="all" className="bg-slatecore text-white">
            كل الأنظمة
          </option>
          {systems.map((item) => (
            <option key={item} value={item} className="bg-slatecore text-white">
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-xs font-semibold text-steel">
        نوع التهديد
        <select
          value={type}
          onChange={(event) => onTypeChange(event.target.value)}
          className={controlClassName}
          aria-label="فلترة حسب نوع التهديد"
        >
          <option value="all" className="bg-slatecore text-white">
            كل أنواع التهديد
          </option>
          {types.map((item) => (
            <option key={item} value={item} className="bg-slatecore text-white">
              {item}
            </option>
          ))}
        </select>
      </label>

      {audience !== undefined && onAudienceChange ? (
        <label className="grid gap-2 text-xs font-semibold text-steel">
          الجمهور المناسب
          <select
            value={audience}
            onChange={(event) => onAudienceChange(event.target.value)}
            className={controlClassName}
            aria-label="فلترة حسب الجمهور المناسب"
          >
            <option value="all" className="bg-slatecore text-white">
              للأفراد أو الشركات
            </option>
            <option value="individuals" className="bg-slatecore text-white">
              للأفراد
            </option>
            <option value="businesses" className="bg-slatecore text-white">
              للشركات
            </option>
            <option value="both" className="bg-slatecore text-white">
              لكليهما
            </option>
          </select>
        </label>
      ) : null}

      {onReset ? (
        <div className="md:col-span-2 xl:col-span-5">
          <button
            type="button"
            onClick={onReset}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
          >
            إعادة ضبط الفلاتر
          </button>
        </div>
      ) : null}
    </div>
  );
}
