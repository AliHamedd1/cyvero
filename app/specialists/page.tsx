import { Metadata } from "next";
import { MessageSquareText, SearchCheck, ShieldCheck } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { SpecialistsDirectory } from "@/components/specialists-directory";
import { siteConfig } from "@/data/site";

const specialistsNotes = [
  {
    icon: SearchCheck,
    title: "اختيار وفلترة احترافية",
    description: "يمكن للعميل المقارنة بين المختصين والبحث داخلهم وتصفية النتائج حسب مجال الحالة الفعلي.",
  },
  {
    icon: MessageSquareText,
    title: "طلب ومحادثة مباشرة",
    description: "بعد التحقق الأولي من البيانات يتم فتح قناة محادثة مرتبطة برقم طلب واضح داخل المنصة.",
  },
  {
    icon: ShieldCheck,
    title: "تسعير وتقييم موثق",
    description: "يشمل المسار عرض السعر ومدة التنفيذ والقبول أو الرفض ثم التقييم بعد إغلاق الطلب.",
  },
];

export const metadata: Metadata = {
  title: `المختصون | ${siteConfig.name}`,
  description:
    "صفحة المختصين في Cyvero 2.0 مع بحث وفلترة وفتح طلبات ومحادثات وتسعير وتقييمات موثقة داخل الواجهة.",
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
              title="اختر المختص المناسب وافتح طلبًا واضحًا وتابع حالتك حتى الإغلاق والتقييم"
              description="تعرض هذه الصفحة نظامًا متكاملًا للمختصين داخل Cyvero 2.0: اختيار المختص، التحقق الأولي من بيانات العميل، فتح قناة رسائل، ثم متابعة التسعير والتقييم."
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
