"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { getSearchResults, SearchResultItem } from "@/lib/site-search";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  action: string;
  defaultValue?: string;
  placeholder: string;
  compact?: boolean;
}

type SearchSection = {
  title: string;
  items: SearchResultItem[];
};

function SearchResultsGroup({
  title,
  items,
  navigateTo,
}: SearchSection & {
  navigateTo: (href: string) => void;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold tracking-[0.14em] text-cyanGlow">{title}</p>
      {items.map((item) => (
        <button
          key={`${item.kind}-${item.id}`}
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => navigateTo(item.href)}
          className="block w-full rounded-[1.1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-right text-sm text-white hover:border-cyanGlow/25 hover:bg-cyanGlow/10"
        >
          <p className="font-semibold">{item.title}</p>
          <p className="mt-1 text-xs text-cyanGlow">{item.subtitle}</p>
          <p className="mt-2 line-clamp-2 text-xs leading-6 text-steel">{item.description}</p>
        </button>
      ))}
    </div>
  );
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
  const results = useMemo(() => getSearchResults(query), [query]);
  const sections: SearchSection[] = [
    { title: "التهديدات", items: results.threats.slice(0, 4) },
    { title: "التصنيفات", items: results.categories.slice(0, 3) },
    { title: "المختصون", items: results.specialists.slice(0, 3) },
    { title: "الاشتراكات والحلول", items: [...results.subscriptions.slice(0, 3), ...results.business] },
  ];
  const hasResults = results.total > 0;
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
      aria-label="البحث في Cyvero"
      onSubmit={onSubmit}
      className={cn(
        "group relative flex items-center gap-3 rounded-[1.25rem] border border-white/10 bg-slatecore/75 px-4 shadow-panel backdrop-blur-md",
        compact ? "py-2.5" : "py-3.5",
      )}
      noValidate
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
        className={cn(
          "inline-flex items-center gap-2 rounded-xl bg-cyanGlow px-4 font-semibold text-slate-950 shadow-glow",
          compact ? "py-2 text-xs" : "py-2.5 text-xs",
          "hover:bg-cyber hover:text-white",
        )}
      >
        <Sparkles className="size-3.5" />
        بحث
      </button>

      {showResults ? (
        <div className="absolute inset-x-0 top-full z-40 mt-3 rounded-[1.35rem] border border-white/10 bg-slatecore/95 p-4 shadow-panel backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between gap-3 text-xs text-steel">
            <span>نتائج مباشرة عن: {query}</span>
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
            <div className="grid gap-4 xl:grid-cols-2">
              {sections.map((section) => (
                <SearchResultsGroup
                  key={section.title}
                  title={section.title}
                  items={section.items}
                  navigateTo={navigateTo}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.1rem] border border-dashed border-white/10 bg-white/[0.04] px-4 py-6 text-center text-sm text-steel">
              لا توجد نتائج مطابقة حاليًا
            </div>
          )}
        </div>
      ) : null}
    </form>
  );
}
