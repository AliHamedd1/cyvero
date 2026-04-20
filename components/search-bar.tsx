"use client";

import { FormEvent, useState } from "react";
import { Search, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = value.trim();
    router.push(query ? `${action}?q=${encodeURIComponent(query)}` : action);
  }

  return (
    <form
      role="search"
      aria-label="بحث في Cyvero"
      onSubmit={onSubmit}
      className={cn(
        "group cyber-card relative flex items-center gap-3 overflow-hidden rounded-[1.4rem] border border-white/10 bg-white/5 px-4 backdrop-blur-xl",
        compact ? "py-2.5" : "py-3.5",
      )}
    >
      <Search className="size-4 text-cyanGlow" aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
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
    </form>
  );
}
