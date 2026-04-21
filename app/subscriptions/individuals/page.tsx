import { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { IndividualSubscriptionsShowcase } from "@/components/individual-subscriptions-showcase";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";

const pageNotes = [
  {
    icon: ShieldCheck,
    title: "تدرج منطقي في المزايا",
    description:
      "كلما ارتفع مستوى الاشتراك زادت المزايا والجاهزية للاستفادة من التطويرات القادمة داخل Cyvero.",
  },
  {
    icon: Sparkles,
    title: "واجهة تفاعلية واضحة",
    description:
      "يمكنك التنقل بين الباقات ومقارنة الفروقات بصريًا لمعرفة الخطة الأنسب لك بسرعة.",
  },
  {
    icon: CheckCircle2,
    title: "رؤية مستقبلية للمنتج",
    description:
      "Cyvero سيتطور لاحقًا إلى نظام حماية يتم تثبيته على الأجهزة، وهذه الخطط تمثل نواة ذلك المسار.",
  },
];

export const metadata: Metadata = {
  title: `اشتراكات الأفراد | ${siteConfig.name}`,
  description:
    "صفحة تفاعلية لباقات الأفراد داخل Cyvero، مع مقارنة مرئية واضحة بين الخطة الأساسية وحماية بلس وحماية برو.",
};

export default function IndividualsSubscriptionsPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs
        items={[
          { label: "الرئيسية", href: "/" },
          { label: "الاشتراكات", href: "/subscriptions" },
          { label: "اشتراكات الأفراد" },
        ]}
      />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="اشتراكات الأفراد"
              title="باقات فردية متدرجة توضح القيمة كلما ارتفع الاشتراك"
              description="تساعدك هذه الصفحة على مقارنة باقات Cyvero للأفراد بصريًا وبطريقة تفاعلية، مع إبراز الخطة الأكثر شيوعًا، والتوضيح أن المنصة تتجه مستقبلًا إلى نظام حماية يُثبت على الأجهزة."
            />
          </div>

          <div className="grid gap-4">
            {pageNotes.map((item) => {
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

      <IndividualSubscriptionsShowcase />
    </div>
  );
}
