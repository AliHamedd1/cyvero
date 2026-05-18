import Link from "next/link";
import {
  ArrowUpLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Layers3,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { CategoryCard } from "@/components/category-card";
import { CTASection } from "@/components/cta-section";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { SpecialistReviewsSection } from "@/components/specialist-reviews-section";
import { StatsStrip } from "@/components/stats-strip";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ThreatCard } from "@/components/threat-card";
import { individualPlans } from "@/data/subscriptions";
import { specialists } from "@/data/specialists";
import { getAllCategories, getAllThreats, getFeaturedThreats, getHomeStats } from "@/lib/data";

const journeySteps = [
  {
    title: "افهم التهديد",
    description: "مكتبة عربية منظمة تشرح أنواع التهديدات والعلامات التحذيرية وخطوات الحماية الأولية.",
  },
  {
    title: "حلّل حالتك",
    description: "مسار أولي يساعد المستخدم على وصف الحالة وفهم الأولويات قبل اتخاذ القرار التالي.",
  },
  {
    title: "اختر مختصًا",
    description: "بطاقات احترافية مع تخصصات واضحة وتسعير مبدئي ورسائل وتجربة طلب قابلة للمتابعة.",
  },
  {
    title: "اشترك أو اطلب حل شركة",
    description: "باقات للأفراد وحاسبة للشركات مع انتقال فعلي إلى صفحة المبيعات داخل المنصة.",
  },
];

const investorHighlights = [
  {
    icon: Layers3,
    title: "نموذج ربحي متعدد المسارات",
    description: "اشتراكات أفراد، حلول شركات، ومختصون كطبقات دخل يمكن تطويرها تدريجيًا دون كسر المنتج الأساسي.",
  },
  {
    icon: UsersRound,
    title: "سوقان داخل منصة واحدة",
    description: "المنصة تخدم الأفراد والشركات معًا، وتجمع بين المحتوى والخدمات والاستشارات ضمن تجربة مترابطة.",
  },
  {
    icon: Building2,
    title: "جاهزية لمنتج حماية لاحق",
    description: "تمهّد البنية الحالية للتوسع مستقبلاً نحو برنامج حماية يثبت على الأجهزة ويعتمد على نفس الهوية.",
  },
];

const businessPreview = [
  "تسعير أولي مباشر حسب عدد أجهزة الكمبيوتر والسيرفرات.",
  "نقل البيانات تلقائيًا إلى صفحة المبيعات دون إعادة إدخالها.",
  "واجهة مناسبة للعروض الأكاديمية والاستثمارية والتجريبية.",
];

export default function HomePage() {
  const categories = getAllCategories().slice(0, 3);
  const featuredThreats = getFeaturedThreats();
  const stats = getHomeStats();
  const threats = getAllThreats();

  return (
    <div className="space-y-10 md:space-y-12">
      <HeroSection />

      <StatsStrip stats={stats} />

      <section className="space-y-6">
        <SectionHeading
          eyebrow="كيف يعمل Cyvero"
          title="رحلة واضحة من الوعي إلى الإجراء"
          description="أعدنا هيكلة المسار داخل Cyvero 2.0 ليصبح أكثر وضوحًا للزائر، وأكثر قابلية للعرض أمام المستثمرين والمدرسين."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {journeySteps.map((step, index) => (
            <article key={step.title} className="panel cyber-card overflow-hidden p-6">
              <div className="inline-flex size-11 items-center justify-center rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 font-heading text-lg text-cyanGlow">
                {index + 1}
              </div>
              <h3 className="mt-4 font-heading text-2xl text-white">{step.title}</h3>
              <p className="mt-3 leading-8 text-steel">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="تصنيفات أساسية"
          title="ابدأ من التصنيف الأقرب إلى حالتك"
          description="يمكنك الانطلاق من التصنيفات الرئيسية ثم التوسع إلى التهديدات التفصيلية أو الانتقال مباشرة إلى التحليل والمختصين."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              threatCount={threats.filter((threat) => threat.categorySlug === category.slug).length}
            />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="تهديدات مميزة"
          title="أمثلة عملية من مكتبة Cyvero الدفاعية"
          description="هذه البطاقات تعرض جزءًا من المحتوى الموجود داخل المكتبة مع وصف مختصر يساعد على الوصول السريع للمجال المناسب."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredThreats.map((threat) => (
            <ThreatCard key={threat.slug} threat={threat} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel overflow-hidden p-6 md:p-8">
          <SectionHeading
            eyebrow="المختصون"
            title="مختصون ببطاقات أوضح ومسار تواصل تجريبي قابل للتوسع"
            description="يعرض Cyvero 2.0 مختصين مع السعر المبدئي والخبرة ومدة التنفيذ والقدرة على فتح طلب ومتابعته حتى التقييم."
          />
          <div className="mt-6 grid gap-4">
            {specialists.slice(0, 4).map((specialist) => (
              <div key={specialist.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-2xl text-white">{specialist.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-cyanGlow">{specialist.primarySpecialty}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-midnight/40 px-3 py-1 text-xs text-steel">
                    يبدأ من {specialist.starterPrice} ريال
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-steel">{specialist.description}</p>
              </div>
            ))}
          </div>
          <Link
            href="/specialists"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
          >
            استعرض جميع المختصين
            <ArrowUpLeft className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4">
          <div className="panel-soft cyber-card p-6">
            <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="mt-4 font-heading text-2xl text-white">اشتراكات أفراد منظمة</h3>
            <div className="mt-4 grid gap-3">
              {individualPlans.map((plan) => (
                <div key={plan.id} className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-white">{plan.name}</p>
                    <span className="text-sm text-cyanGlow">{plan.price}</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-steel">{plan.badge}</p>
                </div>
              ))}
            </div>
            <Link href="/subscriptions" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow">
              فتح صفحة الاشتراكات
              <ArrowUpLeft className="size-4" />
            </Link>
          </div>

          <div className="panel-soft cyber-card p-6">
            <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
              <BriefcaseBusiness className="size-5" />
            </div>
            <h3 className="mt-4 font-heading text-2xl text-white">حلول الشركات والمبيعات</h3>
            <div className="mt-4 grid gap-3">
              {businessPreview.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-100"
                >
                  {item}
                </div>
              ))}
            </div>
            <Link
              href="/subscriptions/business"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow"
            >
              افتح حاسبة الشركات
              <ArrowUpLeft className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="جاهزية المستثمر"
          title="لماذا Cyvero 2.0 مشروع قابل للنمو"
          description="هذه الطبقة توضح أن المنصة ليست مجرد واجهة توعوية، بل نواة منتج عربي متخصص يمكن تنميته على أكثر من محور."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {investorHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="panel cyber-card overflow-hidden p-6">
                <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-2xl text-white">{item.title}</h3>
                <p className="mt-3 leading-8 text-steel">{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="panel-soft p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <div className="eyebrow inline-flex items-center gap-2">
              <BadgeCheck className="size-4" />
              لماذا Cyvero
            </div>
            <h2 className="font-heading text-4xl text-white">منصة عربية متخصصة بدل محتوى مشتت أو أدوات منفصلة</h2>
            <p className="leading-8 text-steel">
              تم تطوير Cyvero 2.0 ليعرض قيمة تعليمية وتشغيلية في الوقت نفسه: محتوى منظم، رحلة مستخدم واضحة،
              مختصون، اشتراكات، ومبيعات شركات ضمن واجهة دفاعية حديثة.
            </p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-100">
              يخدم الأفراد والشركات في منتج واحد.
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-100">
              يدعم مسارات ربحية متعددة داخل نفس الهوية.
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-100">
              جاهز للتطور لاحقًا إلى برنامج حماية مثبت على الأجهزة.
            </div>
          </div>
        </div>
      </section>

      <SpecialistReviewsSection />
      <TestimonialsSection />

      <CTASection
        title="ابدأ من التهديد أو الحالة أو المختص أو الاشتراك ضمن تجربة عربية واحدة"
        description="Cyvero 2.0 يربط بين المحتوى والخدمات والاستشارات والمبيعات بطريقة أوضح وأكثر احترافية وجاهزية للتوسع."
      />
    </div>
  );
}
