import { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { SpecialistPortal } from "@/components/specialist-portal";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `بوابة المختصين | ${siteConfig.name}`,
  description: "لوحة تشغيل المختصين في Cyvero لمتابعة المحادثات والطلبات والتقييمات.",
};

export default function SpecialistPortalPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "دخول المختصين", href: "/specialists/login" },
          { label: "بوابة المختصين" },
        ]}
      />

      <SectionHeading
        eyebrow="Specialist Portal"
        title="لوحة تشغيل المختصين لإدارة المحادثات والحالات الواردة"
        description="تعرض هذه البوابة للمختص المحادثات الخاصة به، مع بيانات التحقق الأولي، سجل الرسائل، الحالة الحالية، والتقييمات المرتبطة بالطلبات."
      />

      <SpecialistPortal />
    </div>
  );
}
