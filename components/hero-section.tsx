import Link from "next/link";
import { ArrowUpLeft, ShieldCheck, Sparkles } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { CyberBackdrop } from "@/components/cyber-backdrop";
import { SearchBar } from "@/components/search-bar";
import { featuredMetrics } from "@/data/site";

export function HeroSection() {
  return (
    <section className="panel cyber-card relative overflow-hidden px-6 py-8 md:px-10 md:py-14">
      <CyberBackdrop />
      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-7">
          <BrandMark showSubtitle />
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow inline-flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Cyvero منصة دفاعية وتوعوية فقط
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.16em] text-white">
              <Sparkles className="size-3.5 text-cyanGlow" />
              التحديث 1.6
            </span>
          </div>
          <div className="space-y-5">
            <h1 className="font-heading text-4xl leading-tight text-white md:text-6xl md:leading-[1.08]">
              هوية عربية واثقة
              <span className="mt-3 block bg-gradient-to-l from-white via-cyanGlow to-cyanGlow bg-clip-text text-2xl text-transparent md:text-4xl">
                لفهم التهديدات السيبرانية والوقاية منها والاستجابة لها بأمان
              </span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-steel md:text-lg">
              Cyvero تقدم تجربة احترافية منظمة تجمع بين مكتبة تهديدات عربية واسعة، شرح دفاعي واضح،
              تحليل أولي للحالات، ومسار قانوني وآمن للوصول إلى مختصين عند الحاجة.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/categories"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
            >
              ابدأ الاستكشاف
              <ArrowUpLeft className="size-4" />
            </Link>
            <Link
              href="/analyze"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/25 hover:bg-cyanGlow/10"
            >
              حلّل حالتي الآن
              <Sparkles className="size-4" />
            </Link>
          </div>
          <SearchBar action="/categories" placeholder="ابحث عن تهديد أو تصنيف أو كلمة مفتاحية" />
        </div>

        <div className="grid gap-4">
          <div className="panel-soft cyber-card p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-cyanGlow">نطاق Cyvero</p>
                <h2 className="mt-2 font-heading text-3xl text-white">موسوعة دفاعية حديثة</h2>
              </div>
              <div className="rounded-[1.4rem] border border-cyanGlow/15 bg-cyanGlow/10 px-3 py-2 text-xs text-cyanGlow">
                Defensive Only
              </div>
            </div>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-slate-100">
              <li>شرح سيبراني عربي منظم ومهني.</li>
              <li>تركيز صارم على الوقاية والاحتواء والاستجابة الأولية.</li>
              <li>عدم تضمين أي أوامر أو أدوات أو خطوات هجومية.</li>
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredMetrics.map((metric) => (
              <div key={metric.label} className="panel-soft cyber-card p-5">
                <div className="font-heading text-3xl text-white">{metric.value}</div>
                <p className="mt-2 text-sm text-steel">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
