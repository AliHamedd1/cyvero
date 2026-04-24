"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpLeft, Building2, Calculator, ChevronDown, Cpu, Server, ShieldCheck } from "lucide-react";
import { useState } from "react";

import {
  buildSalesHref,
  calculateEstimatedPrice,
  clampCount,
  companyTypeOptions,
  computerUnitPrice,
  formatCurrency,
  getCompanyTypeOption,
  serverUnitPrice,
} from "@/data/business";
import { BusinessQuoteSummary, CompanyType } from "@/types/cyber";

export function BusinessPricingCalculator() {
  const router = useRouter();
  const [companyType, setCompanyType] = useState<CompanyType>("small");
  const [computerCount, setComputerCount] = useState(10);
  const [serverCount, setServerCount] = useState(2);

  const computerTotal = computerCount * computerUnitPrice;
  const serverTotal = serverCount * serverUnitPrice;
  const grandTotal = calculateEstimatedPrice(computerCount, serverCount);
  const activeCompanyType = getCompanyTypeOption(companyType);
  const quoteSummary: BusinessQuoteSummary = {
    companyType,
    computerCount,
    serverCount,
    estimatedPrice: grandTotal,
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
      <div className="panel cyber-card overflow-hidden p-6 md:p-8">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-3 rounded-full border border-cyanGlow/15 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
            <Calculator className="size-4" />
            حاسبة أسعار حلول الشركات
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-3">
              <span className="text-sm font-semibold text-white">نوع الشركة</span>
              <div className="relative">
                <Building2 className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-cyanGlow" />
                <select
                  value={companyType}
                  onChange={(event) => setCompanyType(event.target.value as CompanyType)}
                  className="w-full appearance-none rounded-[1.35rem] border border-white/10 bg-white/5 py-4 pl-12 pr-12 text-base text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                  aria-label="اختيار نوع الشركة"
                >
                  {companyTypeOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-slatecore text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-steel" />
              </div>
              <p className="text-sm leading-7 text-steel">{activeCompanyType.hint}</p>
            </label>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3 text-cyanGlow">
                <ShieldCheck className="size-5" />
                <span className="text-sm font-semibold">تقدير أولي دفاعي وآمن</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-steel">
                الحاسبة تعطيك تصورًا مبدئيًا لتكلفة التغطية حسب عدد الأجهزة والسيرفرات المطلوب
                حمايتها، ضمن مسار دفاعي وقانوني فقط.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-3">
              <span className="text-sm font-semibold text-white">عدد أجهزة الكمبيوتر</span>
              <div className="relative">
                <Cpu className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-cyanGlow" />
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={computerCount}
                  onChange={(event) => setComputerCount(clampCount(Number(event.target.value)))}
                  className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-4 pl-4 pr-12 text-base text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                  aria-label="عدد أجهزة الكمبيوتر"
                />
              </div>
              <p className="text-sm text-steel">سعر كل جهاز: {formatCurrency(computerUnitPrice)}</p>
            </label>

            <label className="space-y-3">
              <span className="text-sm font-semibold text-white">عدد السيرفرات</span>
              <div className="relative">
                <Server className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-cyanGlow" />
                <input
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={serverCount}
                  onChange={(event) => setServerCount(clampCount(Number(event.target.value)))}
                  className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-4 pl-4 pr-12 text-base text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                  aria-label="عدد السيرفرات"
                />
              </div>
              <p className="text-sm text-steel">سعر كل سيرفر: {formatCurrency(serverUnitPrice)}</p>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-steel">تكلفة أجهزة الكمبيوتر</p>
              <p className="mt-2 font-heading text-3xl text-white">{formatCurrency(computerTotal)}</p>
              <p className="mt-2 text-sm leading-7 text-steel">
                {computerCount} × {formatCurrency(computerUnitPrice)}
              </p>
            </div>
            <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm text-steel">تكلفة السيرفرات</p>
              <p className="mt-2 font-heading text-3xl text-white">{formatCurrency(serverTotal)}</p>
              <p className="mt-2 text-sm leading-7 text-steel">
                {serverCount} × {formatCurrency(serverUnitPrice)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <aside className="panel cyber-card overflow-hidden p-6 md:p-8">
        <div className="space-y-6">
          <div className="rounded-[1.6rem] border border-cyanGlow/15 bg-gradient-to-br from-cyanGlow/18 via-cyanGlow/8 to-white/5 p-6">
            <p className="text-sm font-semibold text-cyanGlow">ملخص الطلب الحالي</p>
            <p className="mt-3 font-heading text-5xl text-white">{formatCurrency(grandTotal)}</p>
            <p className="mt-3 text-sm leading-7 text-steel">
              السعر التقديري المباشر لشريحة <span className="text-white">{activeCompanyType.label}</span>
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-steel">نوع الشركة</p>
              <p className="mt-1 text-lg font-semibold text-white">{activeCompanyType.label}</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-steel">عدد أجهزة الكمبيوتر</p>
              <p className="mt-1 text-lg font-semibold text-white">{computerCount}</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-steel">عدد السيرفرات</p>
              <p className="mt-1 text-lg font-semibold text-white">{serverCount}</p>
            </div>
            <div className="rounded-[1.35rem] border border-cyanGlow/15 bg-cyanGlow/10 p-4">
              <p className="text-sm text-cyanGlow">الإجمالي النهائي التقديري</p>
              <p className="mt-1 text-2xl font-bold text-white">{formatCurrency(grandTotal)}</p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5 text-sm leading-7 text-steel">
            سيتم نقل نوع الشركة وعدد الأجهزة وعدد السيرفرات والسعر التقديري تلقائيًا إلى صفحة
            المبيعات عند متابعة الطلب.
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
            السعر الظاهر تقديري أولي لأغراض التخطيط فقط. فريق المبيعات سيبني التواصل التالي وفق
            البيانات التي اخترتها في هذه الصفحة.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push(buildSalesHref(quoteSummary))}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
            >
              الانتقال إلى المبيعات
              <ArrowUpLeft className="size-4" />
            </button>
            <Link
              href="/contact"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
            >
              تواصل عام
            </Link>
          </div>
        </div>
      </aside>
    </section>
  );
}
