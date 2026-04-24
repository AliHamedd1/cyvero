import { Metadata } from "next";
import { SearchCheck, ShieldCheck, UserRound } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { SpecialistsDirectory } from "@/components/specialists-directory";
import { siteConfig } from "@/data/site";

const specialistsNotes = [
  {
    icon: UserRound,
    title: "مختصون بتخصصات متعددة",
    description: "يشمل الدليل شبكات، برمجيات خبيثة، بريد إلكتروني، استجابة للحوادث، أنظمة، وتهديدات ويب.",
  },
  {
    icon: SearchCheck,
    title: "بحث وفلاتر مباشرة",
    description: "يمكن للعميل البحث باسم المختص أو التخصص، ثم تضييق النتائج حسب المجال المناسب.",
  },
  {
    icon: ShieldCheck,
    title: "مسار للحالات غير المصنفة",
    description: "تم تخصيص مختصين للحالات العامة عندما لا يعرف العميل نوع المشكلة أو يحتاج توجيهًا أوليًا.",
  },
];

export const metadata: Metadata = {
  title: `المختصون | ${siteConfig.name}`,
  description:
    "صفحة دليل المختصين في Cyvero مع بطاقات احترافية، تخصصات متعددة، وبحث وفلاتر للحالات المصنفة وغير المصنفة.",
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
              title="اختر المختص المناسب وفق نوع المشكلة أو اطلب توجيهًا أوليًا"
              description="تعرض هذه الصفحة دليلًا احترافيًا لجميع المختصين المتاحين داخل Cyvero، مع بطاقات واضحة، تخصصات فرعية، وواجهة بحث وفلاتر متجاوبة بالكامل."
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
