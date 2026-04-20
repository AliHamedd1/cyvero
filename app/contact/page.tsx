import { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";

const questions = [
  "هل تقدم Cyvero محتوى هجوميًا؟ لا، المنصة دفاعية وتوعوية فقط.",
  "هل يمكن ربط الموقع لاحقًا بذكاء اصطناعي؟ نعم، البنية الحالية جاهزة لهذا التطوير.",
  "هل يوجد دعم للحالات القانونية؟ النموذج الحالي شكلي، لكنه مصمم ليتوسع لاحقًا بمسار قانوني منظم.",
];

export const metadata: Metadata = {
  title: `تواصل معنا | ${siteConfig.name}`,
  description: "نموذج تواصل ومعلومات عامة حول منصة Cyvero.",
};

export default function ContactPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "تواصل معنا" }]} />
      <SectionHeading
        eyebrow="تواصل معنا"
        title="راسل فريق Cyvero"
        description="للاستفسارات العامة، الشراكات، الملاحظات، أو طلبات التوسع المستقبلية، استخدم النموذج التالي أو اطلع على المعلومات الشكلية والأسئلة العامة."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <ContactForm />

        <div className="grid gap-4">
          <div className="panel-soft cyber-card p-6">
            <h3 className="font-heading text-2xl text-white">معلومات تواصل شكلية</h3>
            <div className="mt-4 space-y-3 text-sm leading-7 text-steel">
              <p>البريد: contact@cyvero.example</p>
              <p>ساعات الاستجابة: من الأحد إلى الخميس، 9:00 ص - 6:00 م</p>
              <p>نوع الدعم الحالي: استفسارات عامة وتوسعات مستقبلية للمنصة</p>
            </div>
          </div>
          <div className="panel-soft cyber-card p-6">
            <h3 className="font-heading text-2xl text-white">أسئلة عامة</h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-steel">
              {questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
