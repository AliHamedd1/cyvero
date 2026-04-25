import { Metadata } from "next";
import { MessageSquareText, SearchCheck, ShieldCheck } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { SpecialistsDirectory } from "@/components/specialists-directory";
import { siteConfig } from "@/data/site";

const specialistsNotes = [
  {
    icon: SearchCheck,
    title: "اختيار وتنقل احترافي",
    description: "يمكن للعميل التنقل بين المختصين، مقارنة التخصصات، وتصفية النتائج حسب المجال المناسب.",
  },
  {
    icon: MessageSquareText,
    title: "طلب ومحادثة مباشرة",
    description: "بعد التحقق الأولي من بيانات العميل يتم فتح قناة محادثة مع المختص وربطها بمرجع واضح.",
  },
  {
    icon: ShieldCheck,
    title: "بوابة للمختصين وتقييم موثّق",
    description: "لكل مختص بوابة دخول تجريبية خاصة به، مع تقييمات مرتبطة بمراجع المحادثات بدل المراجعات العامة غير الموثقة.",
  },
];

export const metadata: Metadata = {
  title: `المختصون | ${siteConfig.name}`,
  description:
    "صفحة المختصين في Cyvero مع تنقل احترافي، تحقق أولي، محادثة مباشرة، تقييمات موثقة، وبوابة دخول للمختصين.",
};

export default function SpecialistsPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "المختصون" }]} />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="دليل المختصين"
              title="اختر المختص المناسب، افتح محادثة موثقة، وتابع الحالة حتى التقييم"
              description="تعرض هذه الصفحة نظامًا متكاملًا للمختصين داخل Cyvero: اختيار المختص، التحقق الأولي من بيانات العميل، فتح قناة رسائل، ثم تقييم المختص على أساس مرجع المحادثة."
            />
          </div>

          <div className="grid gap-4">
            {specialistsNotes.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="panel-soft cyber-card p-5">
                  <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-2xl text-white">{item.title}</h3>
                  <p className="mt-3 leading-8 text-steel">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <SpecialistsDirectory />
    </div>
  );
}
