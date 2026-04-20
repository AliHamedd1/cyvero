import Link from "next/link";
import { ArrowUpLeft, ShieldAlert, Sparkles } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { CyberBackdrop } from "@/components/cyber-backdrop";

export default function NotFound() {
  return (
    <div className="panel cyber-card relative mx-auto flex max-w-5xl flex-col overflow-hidden px-6 py-12 md:px-10 md:py-16">
      <CyberBackdrop />
      <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6 text-center lg:text-right">
          <BrandMark showSubtitle />
          <div className="space-y-4">
            <span className="eyebrow inline-flex items-center gap-2">
              <ShieldAlert className="size-4" />
              Error 404
            </span>
            <h1 className="font-heading text-5xl text-white md:text-6xl">الصفحة غير موجودة</h1>
            <p className="mx-auto max-w-2xl leading-8 text-steel lg:mx-0">
              ربما تم نقل الصفحة، أو أن الرابط غير صحيح، أو أن هذا المسار لم يُضف بعد إلى موسوعة
              Cyvero. يمكنك العودة إلى الرئيسية أو متابعة التصفح من التصنيفات والتهديدات.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
            >
              العودة للرئيسية
              <ArrowUpLeft className="size-4" />
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
            >
              تصفح التصنيفات
              <Sparkles className="size-4" />
            </Link>
          </div>
        </div>

        <div className="grid place-items-center">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full border border-cyanGlow/10 bg-cyanGlow/5 md:h-72 md:w-72">
            <div className="absolute inset-6 rounded-full border border-white/6" />
            <div className="absolute inset-12 rounded-full border border-cyanGlow/20" />
            <div className="font-heading text-7xl text-white/90 md:text-8xl">404</div>
          </div>
        </div>
      </div>
    </div>
  );
}
