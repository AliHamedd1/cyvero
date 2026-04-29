import Link from "next/link";
import { Metadata } from "next";
import {
  AppWindow,
  ArrowUpLeft,
  BellRing,
  CloudOff,
  Fingerprint,
  Link2,
  RefreshCw,
  ShieldAlert,
  Smartphone,
} from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { DevicePreferenceSync } from "@/components/device-preference-sync";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";

const mobileSections = [
  {
    title: "التطبيقات",
    description: "ثبت التطبيقات من المتاجر الرسمية فقط، وراجع المطور والتقييمات قبل منح أي صلاحيات حساسة.",
    icon: AppWindow,
  },
  {
    title: "الرسائل",
    description: "تعامل بحذر مع الرسائل المفاجئة التي تطلب رموز تحقق أو تحديث بيانات أو فتح ملفات وروابط.",
    icon: BellRing,
  },
  {
    title: "الروابط",
    description: "لا تثق بالروابط المختصرة أو غير الواضحة، خاصة عند وصولها عبر تطبيقات المحادثة والإعلانات.",
    icon: Link2,
  },
  {
    title: "الأذونات",
    description: "راجع أذونات الكاميرا والمايك والموقع وجهات الاتصال، ولا تمنحها إلا للتطبيقات التي تحتاجها فعليًا.",
    icon: Fingerprint,
  },
  {
    title: "التحديثات",
    description: "التحديثات الأمنية على الجوال ليست تجميلية، بل تغلق ثغرات يستغلها المهاجمون بشكل مباشر.",
    icon: RefreshCw,
  },
  {
    title: "فقدان الجهاز",
    description: "فعّل العثور على الجهاز ومسح البيانات عن بُعد حتى لا يتحول فقدان الهاتف إلى فقدان للحسابات أيضًا.",
    icon: Smartphone,
  },
  {
    title: "النسخ الاحتياطي",
    description: "احمِ النسخ السحابية بكلمات مرور قوية ومصادقة متعددة العوامل حتى لا تصبح نقطة ضعف جديدة.",
    icon: CloudOff,
  },
];

const quickActions = [
  {
    title: "استكشف تهديدات الجوال",
    href: "/threats",
  },
  {
    title: "حلّل حالة مشتبه بها",
    href: "/analyze",
  },
  {
    title: "تواصل مع مختص",
    href: "/specialists",
  },
];

export const metadata: Metadata = {
  title: `حماية الجوال | ${siteConfig.name}`,
  description: "صفحة مخصصة للجوال داخل Cyvero بواجهة مبسطة وأزرار كبيرة ومحاور حماية مباشرة.",
};

export default function MobilePage() {
  return (
    <div className="space-y-8 md:space-y-10">
      <DevicePreferenceSync device="mobile" />
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الجوال" }]} />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="مسار الجوال"
              title="واجهة حماية مبسطة لمستخدمي الهواتف"
              description="هذه الصفحة مخصصة للجوال فقط، وتجمع أهم النقاط العملية التي تحتاجها لحماية التطبيقات والرسائل والروابط والنسخ السحابية بدون ازدحام."
            />
            <div className="rounded-[1.5rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5 text-sm leading-7 text-steel">
              تركيز هذا المسار على الوضوح والسرعة: بطاقات كبيرة، أقسام مباشرة، وروابط واضحة للانتقال إلى التحليل أو المختصين عند الحاجة.
            </div>
          </div>

          <div className="grid gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex items-center justify-between rounded-[1.6rem] border border-white/10 bg-white/5 px-5 py-5 text-base font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
              >
                {action.title}
                <ArrowUpLeft className="size-5 text-cyanGlow" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="أقسام الجوال"
          title="كل ما تحتاجه في بطاقات كبيرة وواضحة"
          description="تم ترتيب الأقسام التالية لتكون سهلة القراءة والضغط على الجوال، مع الحفاظ على نفس الهوية البصرية للمنصة."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mobileSections.map((section) => {
            const Icon = section.icon;

            return (
              <article key={section.title} className="panel cyber-card overflow-hidden p-6">
                <div className="inline-flex rounded-[1.2rem] border border-cyanGlow/20 bg-cyanGlow/10 p-4 text-cyanGlow">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-5 font-heading text-3xl text-white">{section.title}</h3>
                <p className="mt-3 leading-8 text-steel">{section.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="panel-soft cyber-card p-6">
          <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
            <ShieldAlert className="size-5" />
          </div>
          <h3 className="mt-4 font-heading text-2xl text-white">تذكير سريع</h3>
          <p className="mt-3 leading-8 text-steel">
            إذا ظهر نشاط غريب على حسابك، أو اختفى الهاتف، أو طُلب منك إدخال رمز تحقق في صفحة غير
            موثوقة، فلا تؤخر التحقق أو التصعيد.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href="/request-expert"
            className="inline-flex min-h-[120px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-5 text-center text-base font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
          >
            افتح طلبًا عامًا
          </Link>
          <Link
            href="/specialists"
            className="inline-flex min-h-[120px] items-center justify-center rounded-[1.5rem] border border-cyanGlow/20 bg-cyanGlow/10 px-5 py-5 text-center text-base font-semibold text-cyanGlow transition hover:bg-cyanGlow/15"
          >
            اختر مختصًا
          </Link>
          <Link
            href="/gateway"
            className="inline-flex min-h-[120px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-5 text-center text-base font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
          >
            غيّر المسار
          </Link>
        </div>
      </section>
    </div>
  );
}
