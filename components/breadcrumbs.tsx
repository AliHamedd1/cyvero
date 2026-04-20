import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";

import { BreadcrumbItem } from "@/types/cyber";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="مسار الصفحة" className="flex flex-wrap items-center gap-2 text-sm text-steel">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
            {item.href ? (
              <Link
                href={item.href}
                className="inline-flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-white/5 hover:text-white"
              >
                {index === 0 ? <Home className="size-4" /> : null}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span aria-current="page" className="rounded-full bg-white/5 px-3 py-1 text-white">
                {item.label}
              </span>
            )}
            {!isLast ? <ChevronLeft className="size-4 opacity-70" /> : null}
          </span>
        );
      })}
    </nav>
  );
}
