import Link from "next/link";
import { ArrowUpLeft, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

import { CyberBackdrop } from "@/components/cyber-backdrop";
import { SearchBar } from "@/components/search-bar";
import { featuredMetrics } from "@/data/site";

const investorSignals = [
  "مسار واضح يجمع التهديدات والتحليل والمختصين والاشتراكات.",
  "منصة عربية قابلة للتوسع للأفراد والشركات داخل تجربة واحدة.",
  "هوية سيبرانية حديثة أنظف وأكثر مناسبة للعرض الاحترافي.",
];

export function HeroSection() {
  return (
    <section className="panel relative overflow-hidden px-6 py-8 md:px-10 md:py-12">
      <CyberBackdrop />

      <div className="relative grid gap-8 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow inline-flex items-center gap-2">
              <ShieldCheck className="size-4" />
              Cyber Identity
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-steel">
              <TrendingUp className="size-3.5 text-cyanGlow" />
              جاهز للعرض أمام المستثمرين
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl font-heading text-4xl leading-tight text-white md:text-5xl lg:text-[3.6rem] lg:leading-[1.1]">
              منصة سيبرانية عربية
              <span className="mt-2 block text-cyanGlow">بهوية حديثة وتجربة أوضح وأكثر أناقة</span>
            </h1>
            <p className="max-w-2xl text-base leading-8 text-steel md:text-lg">
              يجمع Cyvero بين الوعي السيبراني، تحليل الحالة، المختصين، الاشتراكات، وحلول الشركات داخل منصة دفاعية
              حديثة بمظهر احترافي ومتناسق.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/specialists" className="btn-primary">
              اختر مختصًا الآن
              <ArrowUpLeft className="size-4" />
            </Link>
            <Link href="/subscriptions/business" className="btn-secondary">
              حلول الشركات
              <Sparkles className="size-4" />
            </Link>
          </div>

          <SearchBar action="/search" placeholder="ابحث عن تهديد أو مختص أو اشتراك" />
        </div>

        <div className="grid gap-4">
          <div className="panel-soft cyber-card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-cyanGlow">قيمة المنصة</p>
                <h2 className="mt-2 max-w-md font-heading text-2xl leading-tight text-white md:text-3xl">
                  تجربة تشغيلية موحدة بدل صفحات منفصلة ومحتوى مشتت
                </h2>
              </div>
              <div className="rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-3 py-1 text-xs text-cyanGlow">
                Defensive Only
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {investorSignals.map((signal) => (
                <div key={signal} className="surface-note">
                  {signal}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredMetrics.map((metric) => (
              <div key={metric.label} className="metric-card">
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
