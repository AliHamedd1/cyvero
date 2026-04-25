import { Metadata } from "next";
import { CheckCircle2, ShieldCheck, Sparkles, Waypoints } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { CTASection } from "@/components/cta-section";
import { SectionHeading } from "@/components/section-heading";
import { TestimonialsSection } from "@/components/testimonials-section";
import { siteConfig } from "@/data/site";
import {
  whyCyveroComparisons,
  whyCyveroHighlights,
  whyCyveroProofPoints,
} from "@/data/why-cyvero";

const introCards = [
  {
    icon: ShieldCheck,
    title: "وش يميزكم؟",
    description: "نحوّل المعرفة السيبرانية إلى تجربة استخدام فعلية، لا إلى مقالات فقط ولا إلى إجابات متفرقة فقط.",
  },
  {
    icon: Sparkles,
    title: "ليش مو AI فقط؟",
    description: "لأن الذكاء الاصطناعي أداة، بينما Cyvero منتج كامل به تنظيم، مسارات، وخدمات قابلة للتوسع.",
  },
  {
    icon: Waypoints,
    title: "ليش المشروع له قيمة؟",
    description: "لأنه يربط الفهم بالفعل: من القراءة إلى التحليل إلى التصعيد لمختص أو حل تجاري مناسب.",
  },
];

export const metadata: Metadata = {
  title: `لماذا Cyvero؟ | ${siteConfig.name}`,
  description:
    "اكتشف ما الذي يميز Cyvero، ولماذا لا يعتمد فقط على الذكاء الاصطناعي، ولماذا يمتلك قيمة عملية حقيقية.",
};

export default function WhyCyveroPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "لماذا Cyvero؟" }]} />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="Why Cyvero"
              title="Cyvero ليست مجرد واجهة AI بل نواة منصة سيبرانية عربية ذات قيمة عملية"
              description="هذه الصفحة تجيب بوضوح على ثلاثة أسئلة مهمة: وش يميز Cyvero؟ ليش ليست مجرد AI فقط؟ وليش للمشروع قيمة حقيقية يمكن البناء عليها؟"
            />
          </div>

          <div className="grid gap-4">
            {introCards.map((item) => {
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

      <section className="grid gap-5 xl:grid-cols-3">
        {whyCyveroHighlights.map((item) => (
          <article key={item.title} className="panel cyber-card overflow-hidden p-6">
            <h2 className="font-heading text-3xl text-white">{item.title}</h2>
            <p className="mt-4 leading-8 text-steel">{item.description}</p>
            <div className="mt-5 grid gap-3">
              {item.points.map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-100"
                >
                  <div className="mt-1 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 p-1 text-cyanGlow">
                    <CheckCircle2 className="size-3.5" />
                  </div>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="panel cyber-card overflow-hidden p-6 md:p-8">
        <SectionHeading
          eyebrow="Cyvero vs AI"
          title="الفرق بين Cyvero ومنتج يعتمد على AI فقط"
          description="الذكاء الاصطناعي يبقى عنصرًا مهمًا داخل أي منصة حديثة، لكن قيمة Cyvero تأتي من التنظيم، بنية المنتج، والخدمات المرتبطة بالمحتوى."
        />

        <div className="mt-6 grid gap-4">
          {whyCyveroComparisons.map((row) => (
            <div key={row.topic} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
              <h3 className="font-heading text-2xl text-white">{row.topic}</h3>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[1.35rem] border border-cyanGlow/15 bg-cyanGlow/10 p-4">
                  <p className="text-sm font-semibold text-cyanGlow">Cyvero</p>
                  <p className="mt-3 text-sm leading-7 text-slate-100">{row.cyvero}</p>
                </div>
                <div className="rounded-[1.35rem] border border-white/10 bg-midnight/35 p-4">
                  <p className="text-sm font-semibold text-white">AI فقط</p>
                  <p className="mt-3 text-sm leading-7 text-steel">{row.aiOnly}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="panel-soft cyber-card p-6 md:p-8">
          <h2 className="font-heading text-3xl text-white">قيمة المشروع على المدى الطويل</h2>
          <p className="mt-4 leading-8 text-steel">
            Cyvero ليس صفحة تعريفية فقط، بل بنية قابلة للتحول إلى منصة ناضجة فيها اشتراكات، مختصون،
            مبيعات، تقييمات مجتمع، ولوحات تشغيل، وكل ذلك حول هوية عربية دفاعية واضحة.
          </p>
        </div>

        <div className="grid gap-3">
          {whyCyveroProofPoints.map((point) => (
            <div
              key={point}
              className="rounded-[1.35rem] border border-white/10 bg-white/5 px-5 py-5 text-sm leading-7 text-slate-100"
            >
              {point}
            </div>
          ))}
        </div>
      </section>

      <TestimonialsSection />

      <CTASection
        title="إذا كنت تبحث عن منصة سيبرانية عربية ذات مسار واضح، فهذه هي نقطة البداية"
        description="ابدأ بفهم التهديدات، قيّم التجربة، ثم انتقل إلى التحليل أو المختصين أو حلول الشركات حسب احتياجك."
      />
    </div>
  );
}
