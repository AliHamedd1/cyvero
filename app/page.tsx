import Link from "next/link";
import { ArrowUpLeft, BriefcaseBusiness, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

import { CategoryCard } from "@/components/category-card";
import { CTASection } from "@/components/cta-section";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { SpecialistReviewsSection } from "@/components/specialist-reviews-section";
import { StatsStrip } from "@/components/stats-strip";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ThreatCard } from "@/components/threat-card";
import { specialists } from "@/data/specialists";
import { getAllCategories, getAllThreats, getFeaturedThreats, getHomeStats } from "@/lib/data";

const platformHighlights = [
  {
    title: "محتوى سيبراني منظم",
    description: "مكتبة تهديدات عربية قابلة للبحث والفلترة مع تنظيم واضح للمحتوى والسيناريوهات الدفاعية.",
    href: "/threats",
    icon: ShieldCheck,
  },
  {
    title: "مسار مختصين متكامل",
    description: "اختيار مختص، فتح طلب، متابعة المحادثة، التسعير، ثم التقييم بعد انتهاء الخدمة.",
    href: "/specialists",
    icon: UsersRound,
  },
  {
    title: "حلول مخصصة للشركات",
    description: "حاسبة أولية للأجهزة والسيرفرات مع نقل البيانات مباشرة إلى صفحة المبيعات والمتابعة.",
    href: "/business-solutions",
    icon: BriefcaseBusiness,
  },
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
          eyebrow="مزايا المنصة"
          title="منصة واحدة تجمع الوعي، التحليل، المختصين، والاشتراكات"
          description="تم تنظيم Cyvero لتغطي المسارات الأساسية التي يحتاجها المستخدم الفردي والجهة التجارية بدون تشتيت أو ازدحام."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {platformHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="panel cyber-card overflow-hidden p-6 transition duration-300 hover:-translate-y-1.5 hover:border-cyanGlow/35 hover:shadow-glow"
              >
                <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-2xl text-white">{item.title}</h3>
                <p className="mt-3 leading-8 text-steel">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow">
                  افتح المسار
                  <ArrowUpLeft className="size-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="تصنيفات أساسية"
          title="ابدأ من التصنيف الأقرب إلى حالتك"
          description="يمكنك الانطلاق من التصنيفات الرئيسية، ثم التوسع إلى التهديدات التفصيلية أو الانتقال مباشرة إلى التحليل والمختصين."
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
          description="هذه البطاقات تعرض جزءًا من المحتوى الموجود داخل المكتبة مع وصف مختصر يساعدك على الوصول السريع للمجال المناسب."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredThreats.map((threat) => (
            <ThreatCard key={threat.slug} threat={threat} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel overflow-hidden p-6 md:p-8">
          <SectionHeading
            eyebrow="المختصون"
            title="مختصون ببطاقات واضحة ومسار تواصل مباشر"
            description="يعرض Cyvero المختصين مع التخصص، الوصف، الخبرة، والقدرة على فتح طلب ومتابعته حتى التقييم النهائي."
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
                    {specialist.experienceLevel}
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
              <Sparkles className="size-5" />
            </div>
            <h3 className="mt-4 font-heading text-2xl text-white">صفحة جوال مخصصة</h3>
            <p className="mt-3 leading-8 text-steel">
              مسار مبسط لمستخدمي الهواتف يركز على التطبيقات، الرسائل، الروابط، الأذونات، التحديثات،
              وفقدان الجهاز.
            </p>
            <Link
              href="/mobile"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow"
            >
              افتح صفحة الجوال
              <ArrowUpLeft className="size-4" />
            </Link>
          </div>

          <div className="panel-soft cyber-card p-6">
            <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
              <BriefcaseBusiness className="size-5" />
            </div>
            <h3 className="mt-4 font-heading text-2xl text-white">اشتراكات وحلول شركات</h3>
            <p className="mt-3 leading-8 text-steel">
              من الصفحة الرئيسية يمكنك الانتقال مباشرة إلى الاشتراكات الفردية أو حاسبة حلول الشركات
              ومتابعة الطلب حتى صفحة المبيعات.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/subscriptions"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
              >
                الاشتراكات
              </Link>
              <Link
                href="/business-solutions"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-3 text-sm font-semibold text-cyanGlow transition hover:bg-cyanGlow/15"
              >
                حلول الشركات
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SpecialistReviewsSection />
      <TestimonialsSection />

      <CTASection
        title="من القراءة والتوعية إلى التقييم والمبيعات ضمن تجربة عربية واحدة"
        description="Cyvero لم تعد واجهة تجريبية فقط، بل مسارًا متصلًا يربط المحتوى، الخدمات، والمختصين بشكل قابل للتوسعة."
      />
    </div>
  );
}
