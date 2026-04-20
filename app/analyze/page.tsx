import { Metadata } from "next";

import { AIAnalysisBox } from "@/components/ai-analysis-box";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `حلّل حالتي | ${siteConfig.name}`,
  description: "تحليل أولي دفاعي للحالات السيبرانية المشتبه بها ضمن واجهة عربية جاهزة للتطوير.",
};

export default function AnalyzePage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "حلّل حالتي" }]} />
      <SectionHeading
        eyebrow="تحليل الحالة"
        title="حلّل حالتي الآن"
        description="صف الحالة بلغتك الطبيعية، وسيقترح Cyvero نوع التهديد المحتمل، مستوى الخطورة، والخطوات الدفاعية الآمنة التي يمكن البدء بها قبل التصعيد."
      />
      <AIAnalysisBox />
    </div>
  );
}
