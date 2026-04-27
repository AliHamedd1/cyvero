import Link from "next/link";
import { ArrowUpLeft, LucideIcon, ShieldCheck, Sparkles } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { DevicePreferenceSync } from "@/components/device-preference-sync";
import { DeviceSwitcherButton } from "@/components/device-switcher-button";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialsSection } from "@/components/testimonials-section";
import { DevicePreference } from "@/types/cyber";

type DeviceFeature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type DeviceAction = {
  title: string;
  description: string;
  href: string;
};

type DeviceExperiencePageProps = {
  device: DevicePreference;
  breadcrumbLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  panelNote: string;
  features: DeviceFeature[];
  tips: string[];
  actions: DeviceAction[];
};

export function DeviceExperiencePage({
  device,
  breadcrumbLabel,
  eyebrow,
  title,
  description,
  panelNote,
  features,
  tips,
  actions,
}: DeviceExperiencePageProps) {
  return (
    <div className="space-y-10">
      <DevicePreferenceSync device={device} />
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: breadcrumbLabel }]} />

      <section className="panel overflow-hidden p-6 md:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading eyebrow={eyebrow} title={title} description={description} />

            <div className="rounded-[1.6rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5 text-sm leading-7 text-steel">
              {panelNote}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/threats"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
              >
                استعرض التهديدات
                <ArrowUpLeft className="size-4" />
              </Link>
              <DeviceSwitcherButton compact />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="panel-soft cyber-card p-5">
              <p className="text-sm text-steel">محاور مركزة</p>
              <p className="mt-3 font-heading text-4xl text-white">{features.length}</p>
              <p className="mt-2 text-sm text-cyanGlow">بطاقات حماية مخصصة</p>
            </div>
            <div className="panel-soft cyber-card p-5">
              <p className="text-sm text-steel">نصائح عملية</p>
              <p className="mt-3 font-heading text-4xl text-white">{tips.length}</p>
              <p className="mt-2 text-sm text-cyanGlow">خطوات دفاعية واضحة</p>
            </div>
            <div className="panel-soft cyber-card p-5">
              <p className="text-sm text-steel">مسارات سريعة</p>
              <p className="mt-3 font-heading text-4xl text-white">{actions.length}</p>
              <p className="mt-2 text-sm text-cyanGlow">روابط للمحتوى والخدمات</p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="محاور الحماية"
          title={`أهم الجوانب التي ينبغي التركيز عليها في ${breadcrumbLabel}`}
          description="هذه البطاقات تعطيك خريطة سريعة لأكثر النقاط التي تستحق الانتباه والمتابعة الوقائية."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} className="panel cyber-card overflow-hidden p-6">
                <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-2xl text-white">{feature.title}</h3>
                <p className="mt-3 leading-8 text-steel">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-6 md:p-8">
          <div className="flex items-center gap-3 text-cyanGlow">
            <ShieldCheck className="size-5" />
            <span className="text-sm font-semibold">نصائح حماية سريعة</span>
          </div>
          <div className="mt-6 grid gap-3">
            {tips.map((tip, index) => (
              <div
                key={tip}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-100"
              >
                <span className="ml-2 font-semibold text-cyanGlow">{index + 1}.</span>
                {tip}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="panel-soft cyber-card p-6 transition hover:-translate-y-1 hover:border-cyanGlow/20">
              <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
                <Sparkles className="size-5" />
              </div>
              <h3 className="mt-4 font-heading text-2xl text-white">{action.title}</h3>
              <p className="mt-3 leading-8 text-steel">{action.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow">
                افتح المسار
                <ArrowUpLeft className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <TestimonialsSection />
    </div>
  );
}
