"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";

import { BrandMark } from "@/components/brand-mark";
import { SearchBar } from "@/components/search-bar";
import { navigationLinks } from "@/data/site";
import { NavigationLink } from "@/types/cyber";
import { cn } from "@/lib/utils";

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
    <header className="sticky top-0 z-50 border-b border-white/8 bg-midnight/80 backdrop-blur-2xl">
      <div className="container flex min-h-20 items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center" aria-label="العودة إلى الصفحة الرئيسية">
          <BrandMark showSubtitle />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {navigationLinks.map((link) => {
            const active = isLinkActive(link, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  active
                    ? "bg-cyanGlow/10 text-cyanGlow"
                    : "text-steel hover:bg-white/5 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden w-full max-w-[360px] xl:block">
          <SearchBar action="/threats" placeholder="ابحث في التهديدات والتصنيفات" compact />
        </div>

        <button
          type="button"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
          className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white lg:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <div
        id={menuId}
        className={cn(
          "overflow-hidden border-t border-white/8 bg-slatecore/95 transition-[max-height,opacity] duration-300 lg:hidden",
          open ? "max-h-[880px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="container space-y-4 py-5">
          <SearchBar action="/threats" placeholder="ابحث في التهديدات والتصنيفات" />
          <div className="grid gap-2" role="menu" aria-label="القائمة المحمولة">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-4 text-base transition",
                  isLinkActive(link, pathname)
                    ? "bg-cyanGlow/10 text-cyanGlow"
                    : "bg-white/5 text-steel hover:text-white",
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
