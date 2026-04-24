import { Metadata } from "next";

import { AdminDashboard } from "@/components/admin-dashboard";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `لوحة الأدمن | ${siteConfig.name}`,
  description:
    "لوحة أدمن احترافية داخل Cyvero تحتوي على بلاغات وهمية كثيرة، إحصاءات، وفلاتر بحث متقدمة داخل الواجهة.",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "دخول الأدمن", href: "/admin-login" },
          { label: "لوحة الأدمن" },
        ]}
      />

      <SectionHeading
        eyebrow="Admin Dashboard"
        title="لوحة تشغيل سيبرانية لإدارة البلاغات التجريبية"
        description="تعرض هذه الصفحة بطاقات إحصائية، فلاتر احترافية، وبنية عرض منظمة للبلاغات الوهمية، مع الحفاظ على الطابع الدفاعي والهوية البصرية لمشروع Cyvero."
      />

      <AdminDashboard />
    </div>
  );
}
