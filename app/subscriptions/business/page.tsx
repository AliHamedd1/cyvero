import { Metadata } from "next";
import { Building2, Calculator, Landmark, MonitorCog } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { BusinessPricingCalculator } from "@/components/business-pricing-calculator";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";

const solutionHighlights = [
  {
    icon: Building2,
    title: "تغطية مرنة للمنشآت",
    description:
      "يوفر Cyvero حلول حماية مرنة للشركات، مع تسعير يعتمد على عدد الأجهزة والخوادم المطلوب حمايتها.",
  },
  {
    icon: Calculator,
    title: "تقدير مباشر وسريع",
    description:
      "احسب التكلفة التقديرية مباشرة عبر الحاسبة التفاعلية، ثم اطلب عرضًا مناسبًا لاحتياج منشأتك.",
  },
  {
    icon: MonitorCog,
    title: "جاهزية للتوسع",
    description:
      "البنية الحالية مناسبة للتطوير لاحقًا نحو اشتراكات مؤسسية، مستويات خدمة، أو عروض أسعار مخصصة حسب البنية التشغيلية.",
  },
  {
    icon: Landmark,
    title: "مسار قانوني ودفاعي فقط",
    description:
      "هذه الصفحة مخصصة للحلول الدفاعية والوقائية القانونية فقط، ولا تتضمن أي قدرات هجومية أو وظائف ضارة.",
  },
];

export const metadata: Metadata = {
  title: `حلول الشركات | ${siteConfig.name}`,
  description:
    "صفحة Cyvero لحلول الشركات مع حاسبة سعر تفاعلية تقديرية تعتمد على عدد أجهزة الكمبيوتر والسيرفرات.",
};

export default function BusinessSubscriptionsPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "الاشتراكات", href: "/subscriptions" },
          { label: "حلول الشركات" },
        ]}
      />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="حلول الشركات"
              title="حلول حماية مؤسسية مرنة مع حاسبة سعر تفاعلية داخل Cyvero"
              description="هذه الصفحة مخصصة لتقدير أولي سريع للشركات والجهات التي ترغب في احتساب تكلفة حماية أجهزة الكمبيوتر والخوادم ضمن إطار دفاعي وقانوني وآمن."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-steel">
                السعر التقديري يحدَّث لحظيًا بمجرد تعديل عدد الأجهزة أو السيرفرات، بدون إعادة تحميل الصفحة.
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-steel">
                التقدير النهائي قد يختلف حسب البنية، التوزيع، الامتثال، ومتطلبات الحماية الخاصة بكل منشأة.
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            {solutionHighlights.map((item) => {
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

      <BusinessPricingCalculator />
    </div>
  );
}
