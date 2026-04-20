import Link from "next/link";
import { ArrowUpLeft, Layers3, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryCard } from "@/components/category-card";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";
import { getAllCategories, getAllThreats } from "@/lib/data";

export const metadata: Metadata = {
  title: `التصنيفات | ${siteConfig.name}`,
  description: "استعرض تصنيفات Cyvero الأمنية بطريقة منظمة مع وصول واضح إلى مكتبة التهديدات العربية الدفاعية.",
};

export default function CategoriesPage() {
  const categories = getAllCategories();
  const threats = getAllThreats();

  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "التصنيفات" }]} />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="التصنيفات الرئيسية"
              title="خريطة Cyvero للتصنيفات الدفاعية في الأمن السيبراني"
              description="تجمع هذه الصفحة المجالات الأساسية داخل المنصة، من الشبكات والفدية إلى الويب والبيانات والجوال، مع بنية قابلة للتوسع لاحقًا إلى مقالات وأدلة حماية ولوحات إدارة."
            />
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-cyanGlow">
                {categories.length} تصنيفات أساسية
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-steel">
                {threats.length} تهديدًا دفاعيًا
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="panel-soft p-5">
              <div className="flex items-center gap-3 text-cyanGlow">
                <Layers3 className="size-5" />
                <span className="text-sm font-semibold">تنظيم قابل للتوسع</span>
              </div>
              <p className="mt-3 leading-8 text-steel">
                كل تصنيف يقود إلى صفحة فرعية تحتوي على تهديدات مرتبطة به، وفلاتر فرعية، وبطاقات تفصيلية تشرح المؤشرات والوقاية والاستجابة الأولية بشكل دفاعي فقط.
              </p>
            </div>
            <div className="panel-soft p-5">
              <div className="flex items-center gap-3 text-cyanGlow">
                <ShieldCheck className="size-5" />
                <span className="text-sm font-semibold">محتوى توعوي آمن</span>
              </div>
              <p className="mt-3 leading-8 text-steel">
                لا تقدم Cyvero أي أوامر هجومية أو خطوات استغلال. الهدف هنا هو الفهم، الوقاية، الاحتواء، وطلب المساعدة القانونية من المختصين عند الحاجة.
              </p>
            </div>
            <Link
              href="/threats"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyanGlow/15 bg-cyanGlow/10 px-5 py-4 text-sm font-semibold text-cyanGlow transition hover:bg-cyanGlow/15"
            >
              انتقل إلى مكتبة التهديدات
              <ArrowUpLeft className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="كل التصنيفات"
          title="ابدأ من المجال الذي يشبه حالتك أو بيئة عملك"
          description="كل بطاقة تقود إلى صفحة تصنيف متخصصة تعرض وصفًا أوسع وقائمة تهديدات وفلاتر حسب الخطورة والنظام المتأثر ونوع التهديد."
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
    </div>
  );
}
