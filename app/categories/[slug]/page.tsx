import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft, FolderKanban, ShieldCheck, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryThreatExplorer } from "@/components/category-threat-explorer";
import { SectionHeading } from "@/components/section-heading";
import { getAllCategories, getAllThreats, getCategoryBySlug, getThreatsByCategory } from "@/lib/data";

export function generateStaticParams() {
  return getAllCategories().map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "تصنيف غير موجود",
    };
  }

  return {
    title: `${category.name} | Cyvero`,
    description: category.longDescription,
  };
}

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryThreats = getThreatsByCategory(category.slug);
  const allThreats = getAllThreats();

  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "التصنيفات", href: "/categories" },
          { label: category.name },
        ]}
      />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="صفحة التصنيف"
              title={category.name}
              description={category.longDescription}
            />
            <div className="flex flex-wrap gap-2">
              {category.focusAreas.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow"
                >
                  {item}
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
                اطلب مختص
                <ArrowUpLeft className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="panel-soft p-5">
              <div className="flex items-center gap-3 text-cyanGlow">
                <FolderKanban className="size-5" />
                <span className="text-sm font-semibold">عدد التهديدات في التصنيف</span>
              </div>
              <div className="mt-4 font-heading text-5xl text-white">{categoryThreats.length}</div>
            </div>
            <div className="panel-soft p-5">
              <div className="flex items-center gap-3 text-cyanGlow">
                <ShieldCheck className="size-5" />
                <span className="text-sm font-semibold">نطاق التغطية ضمن Cyvero</span>
              </div>
              <p className="mt-4 leading-8 text-steel">
                يمثل هذا التصنيف {Math.round((categoryThreats.length / allThreats.length) * 100)}%
                {" "}تقريبًا من مكتبة التهديدات الحالية داخل النسخة الأولى من المنصة.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="مكتبة التصنيف"
          title={`التهديدات التابعة لـ ${category.name}`}
          description="استخدم الفلاتر الفرعية لفرز التهديدات بحسب مستوى الخطورة، النظام المتأثر، ونوع التهديد داخل هذا التصنيف."
        />
        <CategoryThreatExplorer threats={categoryThreats} />
      </section>
    </div>
  );
}
