"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { categories } from "@/data/categories";
import { threats } from "@/data/threats";
import { matchesCategoryQuery, matchesThreatQuery } from "@/lib/search";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  action: string;
  defaultValue?: string;
  placeholder: string;
  compact?: boolean;
}

export function SearchBar({
  action,
  defaultValue = "",
  placeholder,
  compact = false,
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const query = value.trim();

  const results = useMemo(() => {
    if (!query) {
      return {
        categories: [],
        threats: [],
      };
    }

    return {
      categories: categories.filter((category) => matchesCategoryQuery(category, query)).slice(0, 4),
      threats: threats.filter((threat) => matchesThreatQuery(threat, query)).slice(0, 6),
    };
  }, [query]);

  const hasResults = results.categories.length > 0 || results.threats.length > 0;
  const showResults = focused && query.length > 0;

  function navigateTo(href: string) {
    setFocused(false);
    router.push(href);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateTo(query ? `${action}?q=${encodeURIComponent(query)}` : action);
  }

  return (
    <form
      role="search"
      aria-label="بحث في Cyvero"
      onSubmit={onSubmit}
      className={cn(
        "group relative flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/5 px-4 backdrop-blur-xl",
        compact ? "py-2.5" : "py-3.5",
      )}
    >
      <Search className="size-4 text-cyanGlow" aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          window.setTimeout(() => {
            setFocused(false);
          }, 140);
        }}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-steel"
        aria-label={placeholder}
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="مسح البحث"
          className="rounded-full p-1 text-steel hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" />
        </button>
      ) : null}
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-xl bg-cyanGlow px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-white"
      >
        <Sparkles className="size-3.5" />
        بحث
      </button>

      {showResults ? (
        <div className="absolute inset-x-0 top-full z-40 mt-3 rounded-[1.5rem] border border-white/10 bg-slatecore/95 p-4 shadow-panel backdrop-blur-2xl">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-steel">
            <span>نتائج مباشرة للبحث عن: {query}</span>
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => navigateTo(`${action}?q=${encodeURIComponent(query)}`)}
              className="text-cyanGlow hover:text-white"
            >
              عرض كل النتائج
            </button>
          </div>

          {hasResults ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.16em] text-cyanGlow">التصنيفات</p>
                {results.categories.length > 0 ? (
                  results.categories.map((category) => (
                    <button
                      key={category.slug}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => navigateTo(`/categories/${category.slug}`)}
                      className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-sm text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
                    >
                      <p className="font-semibold">{category.name}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-6 text-steel">{category.shortDescription}</p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-steel">
                    لا توجد تصنيفات مطابقة
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-[0.16em] text-cyanGlow">التهديدات</p>
                {results.threats.length > 0 ? (
                  results.threats.map((threat) => (
                    <button
                      key={threat.slug}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => navigateTo(`/threats/${threat.slug}`)}
                      className="block w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right text-sm text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
                    >
                      <p className="font-semibold">{threat.name}</p>
                      <p className="mt-1 text-xs text-cyanGlow">{threat.category}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-6 text-steel">{threat.shortDescription}</p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-3 text-sm text-steel">
                    لا توجد تهديدات مطابقة
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-steel">
              لا توجد نتائج مطابقة حاليًا
            </div>
          )}
        </div>
      ) : null}
    </form>
  );
}
