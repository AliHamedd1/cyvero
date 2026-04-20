import { Metadata } from "next";
import { FileText, ShieldCheck, UserRound } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ExpertRequestForm } from "@/components/expert-request-form";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";

const requestNotes = [
  {
    icon: UserRound,
    title: "تعريف واضح للمشكلة",
    description: "حدّد نوع المشكلة والمنصة المتأثرة حتى يكون الفرز الأولي أدق وأكثر فاعلية.",
  },
  {
    icon: FileText,
    title: "توثيق منظم للحالة",
    description: "أضف وصفًا متسلسلًا للمؤشرات، مع تواريخ تقريبية ولقطات أو ملفات داعمة عند الحاجة.",
  },
  {
    icon: ShieldCheck,
    title: "مسار قانوني وآمن",
    description: "النموذج يعتمد إقرارًا قانونيًا واضحًا، ويُبنى لاحقًا ليدعم إدارة الحالات والحجوزات بصورة منظمة.",
  },
];

export const metadata: Metadata = {
  title: `اطلب مختص | ${siteConfig.name}`,
  description: "نموذج عربي احترافي لطلب المساعدة من مختص أمني بشكل قانوني وآمن.",
};

export default function RequestExpertPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "اطلب مختص" }]} />
      <SectionHeading
        eyebrow="طلب مختص"
        title="اطلب مساعدة من مختص أمني بشكل قانوني وآمن"
        description="هذه الصفحة تمثل البوابة الأولية لرفع الحالات، مع بنية جاهزة لاحقًا لإدارة التذاكر، متابعة المختصين، وتقييم مستوى الاستعجال."
      />

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="grid gap-4">
          {requestNotes.map((note) => {
            const Icon = note.icon;
            return (
              <div key={note.title} className="panel-soft cyber-card p-6">
                <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 font-heading text-2xl text-white">{note.title}</h3>
                <p className="mt-3 leading-8 text-steel">{note.description}</p>
              </div>
            );
          })}
        </div>
        <ExpertRequestForm />
      </div>
    </div>
  );
}
