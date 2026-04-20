import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpLeft,
  CircleHelp,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CyberIcon } from "@/components/cyber-icon";
import { SectionHeading } from "@/components/section-heading";
import { ThreatCard } from "@/components/threat-card";
import { ThreatDetailsSection } from "@/components/threat-details-section";
import { getAllThreats, getCategoryBySlug, getRelatedThreats, getThreatBySlug } from "@/lib/data";
import { audienceMap, severityMap } from "@/lib/utils";

export function generateStaticParams() {
  return getAllThreats().map((threat) => ({
    slug: threat.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const threat = getThreatBySlug(slug);

  if (!threat) {
    return {
      title: "تهديد غير موجود",
    };
  }

  return {
    title: `${threat.name} | Cyvero`,
    description: threat.shortDescription,
  };
}

export default async function ThreatDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const threat = getThreatBySlug(slug);

  if (!threat) {
    notFound();
  }

  const category = getCategoryBySlug(threat.categorySlug);
  const relatedThreats = getRelatedThreats(threat.slug, threat.categorySlug);

  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "التصنيفات", href: "/categories" },
          { label: "التهديدات", href: "/threats" },
          category
            ? { label: category.name, href: `/categories/${category.slug}` }
            : { label: threat.category },
          { label: threat.name },
        ]}
      />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-4 rounded-[1.75rem] border border-cyanGlow/15 bg-cyanGlow/10 px-4 py-4">
              <div className="rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
                <CyberIcon name={threat.icon} className="size-7" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyanGlow/80">
                  Cyvero Threat Profile
                </p>
                <p className="mt-1 text-sm text-steel">{threat.threatType}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityMap[threat.severity].className}`}
              >
                {severityMap[threat.severity].label}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-steel">
                {threat.category}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-steel">
                {audienceMap[threat.audience]}
              </span>
            </div>

            <SectionHeading
              eyebrow="صفحة التهديد"
              title={threat.name}
              description={threat.shortDescription}
            />

            <p className="leading-8 text-steel">{threat.fullDescription}</p>

            <div className="flex flex-wrap gap-2">
              {threat.affectedSystems.map((system) => (
                <span
                  key={system}
                  className="rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow"
                >
                  {system}
                </span>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
              >
                حلّل حالتي
                <Sparkles className="size-4" />
              </Link>
              <Link
                href="/request-expert"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
              >
                اطلب مساعدة من مختص
                <ArrowUpLeft className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="panel-soft p-5">
              <h3 className="text-sm font-semibold text-cyanGlow">تعريف التهديد</h3>
              <p className="mt-3 leading-8 text-steel">{threat.definition}</p>
            </div>
            <div className="panel-soft p-5">
              <h3 className="text-sm font-semibold text-cyanGlow">كيف يحدث غالبًا</h3>
              <p className="mt-3 leading-8 text-steel">{threat.howItHappens}</p>
            </div>
            <div className="panel-soft p-5">
              <h3 className="text-sm font-semibold text-cyanGlow">كيف يصل إلى المستخدم أو الجهة</h3>
              <p className="mt-3 leading-8 text-steel">{threat.howItReachesTarget}</p>
            </div>
            <div className="panel-soft p-5">
              <h3 className="text-sm font-semibold text-cyanGlow">الأنظمة المتأثرة</h3>
              <p className="mt-3 leading-8 text-steel">{threat.affectedSystems.join("، ")}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ThreatDetailsSection
          title="العلامات التحذيرية"
          items={threat.warningSigns}
          icon={<AlertTriangle className="size-5" />}
        />
        <ThreatDetailsSection
          title="التأثير المحتمل"
          items={threat.impact}
          icon={<Search className="size-5" />}
        />
        <ThreatDetailsSection
          title="طرق الوقاية"
          items={threat.prevention}
          icon={<ShieldCheck className="size-5" />}
        />
        <ThreatDetailsSection
          title="كيف تحمي نفسك"
          items={threat.selfProtection}
          icon={<ShieldCheck className="size-5" />}
        />
      </div>

      <div className="grid gap-6">
        <ThreatDetailsSection
          title="كيف تتعامل معه إذا حصل"
          items={threat.initialResponse}
          icon={<Sparkles className="size-5" />}
        />
        <ThreatDetailsSection
          title="متى يجب التواصل مع مختص"
          items={threat.whenToEscalate}
          icon={<PhoneCall className="size-5" />}
        />
      </div>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="أسئلة شائعة"
          title={`أسئلة شائعة حول ${threat.name}`}
          description="إجابات قصيرة تشرح طريقة التفكير الدفاعية المناسبة حول هذا التهديد دون أي تفاصيل هجومية أو تعليمات ضارة."
        />
        <div className="grid gap-4">
          {threat.faq.map((item) => (
            <div key={item.question} className="panel-soft p-6">
              <div className="flex items-start gap-3">
                <CircleHelp className="mt-1 size-5 text-cyanGlow" />
                <div>
                  <h3 className="font-semibold text-white">{item.question}</h3>
                  <p className="mt-3 leading-8 text-steel">{item.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {relatedThreats.length > 0 ? (
        <section className="space-y-6">
          <SectionHeading
            eyebrow="تهديدات مرتبطة"
            title="قد يهمك أيضًا ضمن نفس التصنيف"
            description="هذه التهديدات قريبة من السياق الحالي وتساعد على استكمال الفهم الدفاعي للتصنيف."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedThreats.map((item) => (
              <ThreatCard key={item.slug} threat={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
