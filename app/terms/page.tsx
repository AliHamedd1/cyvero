import { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LegalSections } from "@/components/legal-sections";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";
import { termsSections } from "@/data/legal";

export const metadata: Metadata = {
  title: `الشروط والأحكام | ${siteConfig.name}`,
  description: "الشروط والأحكام الخاصة باستخدام منصة Cyvero الدفاعية.",
};

export default function TermsPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "الشروط والأحكام" },
        ]}
      />
      <SectionHeading
        eyebrow="الشروط والأحكام"
        title="شروط استخدام منصة Cyvero"
        description="توضح هذه الصفحة طبيعة Cyvero الدفاعية والتوعوية، وحدود الاستخدام المقبول، وطبيعة التحليل الأولي وطلبات المختصين داخل النسخة الحالية."
      />
      <LegalSections sections={termsSections} />
    </div>
  );
}
