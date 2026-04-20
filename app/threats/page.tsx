import { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { ThreatCatalog } from "@/components/threat-catalog";
import { siteConfig } from "@/data/site";
import { getAllCategories, getAllThreats } from "@/lib/data";

export const metadata: Metadata = {
  title: `التهديدات | ${siteConfig.name}`,
  description: "مكتبة Cyvero العربية للتهديدات السيبرانية مع بحث فعلي وفلاتر ديناميكية وبطاقات تفصيلية دفاعية.",
};

export default async function ThreatsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const categories = getAllCategories();
  const threats = getAllThreats();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "التهديدات" }]} />
      <SectionHeading
        eyebrow="مكتبة التهديدات"
        title="ابحث وفلتر التهديدات داخل موسوعة Cyvero الدفاعية"
        description="تجمع هذه الصفحة بطاقات التهديدات مع البحث بالكلمات المفتاحية، والفلترة حسب مستوى الخطورة، النظام المتأثر، نوع التهديد، وملاءمته للأفراد أو الشركات."
      />
      <ThreatCatalog
        categories={categories}
        threats={threats}
        initialQuery={resolvedSearchParams?.q ?? ""}
      />
    </div>
  );
}
