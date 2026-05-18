import { Metadata } from "next";
import { BriefcaseBusiness, ShieldCheck, Workflow } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SalesContactExperience } from "@/components/sales-contact-experience";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";

const salesNotes = [
  {
    icon: BriefcaseBusiness,
    title: "ملخص طلب واضح",
    description: "تصل بيانات الشركة والأجهزة والسيرفرات والسعر التقديري إلى صفحة المبيعات تلقائيًا.",
  },
  {
    icon: Workflow,
    title: "تجربة انتقال متصلة",
    description: "تُستكمل رحلة العميل بعد الحاسبة دون فقدان السياق أو الحاجة إلى إعادة إدخال البيانات الفنية.",
  },
  {
    icon: ShieldCheck,
    title: "نسخة أولية آمنة",
    description: "كل شيء هنا تجريبي داخل الواجهة فقط، مع الحفاظ على هوية احترافية قابلة للتوسع لاحقًا.",
  },
];

export const metadata: Metadata = {
  title: `المبيعات | ${siteConfig.name}`,
  description:
    "صفحة المبيعات في Cyvero 2.0 مع ملخص طلب منقول من حلول الشركات ونموذج تواصل احترافي لفريق المبيعات.",
};

export default function SalesPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "الاشتراكات", href: "/subscriptions" },
          { label: "حلول الشركات", href: "/subscriptions/business" },
          { label: "المبيعات" },
        ]}
      />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="صفحة المبيعات"
              title="انتقال احترافي من حاسبة الشركات إلى فريق المبيعات"
              description="تجمع هذه الصفحة بين ملخص الطلب المنقول تلقائيًا ونموذج تواصل منظم، بحيث يتمكن فريق المبيعات من متابعة العميل بناءً على التفاصيل التي تم اختيارها مسبقًا."
            />
          </div>

          <div className="grid gap-4">
            {salesNotes.map((item) => {
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

      <SalesContactExperience />
    </div>
  );
}
