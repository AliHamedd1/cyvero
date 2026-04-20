import { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { LegalSections } from "@/components/legal-sections";
import { SectionHeading } from "@/components/section-heading";
import { privacySections } from "@/data/legal";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `سياسة الخصوصية | ${siteConfig.name}`,
  description: "سياسة الخصوصية الخاصة بمنصة Cyvero ضمن النسخة الحالية القابلة للتوسع.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "سياسة الخصوصية" },
        ]}
      />
      <SectionHeading
        eyebrow="سياسة الخصوصية"
        title="كيف تتعامل Cyvero مع الخصوصية والبيانات"
        description="هذه الصفحة توضح الإطار العام للخصوصية في النسخة الحالية من Cyvero، مع مراعاة أن المشروع ما زال في مرحلة واجهة أولية وقابل للتوسع لاحقًا إلى نظام تشغيل فعلي."
      />
      <LegalSections sections={privacySections} />
    </div>
  );
}
