"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import { SearchBar } from "@/components/search-bar";
import { navigationLinks } from "@/data/site";
import { cn } from "@/lib/utils";
import { NavigationLink } from "@/types/cyber";

function isLinkActive(link: NavigationLink, pathname: string) {
  if (link.href === "/") {
    return pathname === "/";
  }

  if (link.matchMode === "exact") {
    return pathname === link.href;
  }

  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-midnight/72 backdrop-blur-2xl">
      <div className="container flex min-h-[4.75rem] items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center" aria-label="العودة إلى الصفحة الرئيسية">
          <BrandMark compact />
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex" aria-label="التنقل الرئيسي">
          {navigationLinks.map((link) => {
            const active = isLinkActive(link, pathname);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2.5 text-sm font-medium transition",
                  active
                    ? "border border-cyanGlow/25 bg-cyanGlow/10 text-cyanGlow"
                    : "text-steel hover:bg-white/5 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden w-full max-w-[320px] xl:block">
          <SearchBar action="/search" placeholder="ابحث في المنصة" compact />
        </div>

        <button
          type="button"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
          className="btn-secondary px-3 py-3 lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id={menuId}
        className={cn(
          "overflow-hidden border-t border-white/8 bg-slatecore/95 transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[960px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container space-y-4 py-4">
          <SearchBar action="/search" placeholder="ابحث في المنصة" />
          <div className="grid gap-2" role="menu" aria-label="القائمة المحمولة">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-[1.1rem] px-4 py-3.5 text-sm font-medium transition",
                  isLinkActive(link, pathname)
                    ? "border border-cyanGlow/25 bg-cyanGlow/10 text-cyanGlow"
                    : "border border-white/8 bg-white/5 text-steel hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
