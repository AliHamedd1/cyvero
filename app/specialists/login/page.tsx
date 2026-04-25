import { Metadata } from "next";
import { KeyRound, MessageSquareText, ShieldCheck } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { SpecialistLoginForm } from "@/components/specialist-login-form";
import { specialistAccounts } from "@/data/specialist-accounts";
import { siteConfig } from "@/data/site";

const specialistPortalNotes = [
  {
    icon: KeyRound,
    title: "دخول تجريبي للمختصين",
    description: "صفحة الدخول الحالية داخل الواجهة فقط، ومخصصة لاختبار بوابة المختصين قبل إضافة مصادقة فعلية.",
  },
  {
    icon: MessageSquareText,
    title: "استلام المحادثات والرد عليها",
    description: "كل طلب يفتحه العميل من صفحة المختصين يظهر داخل بوابة المختص المناسب مع سجل الرسائل.",
  },
  {
    icon: ShieldCheck,
    title: "إدارة الحالة والتقييم",
    description: "يمكن للمختص متابعة حالة المحادثة، والاطلاع على التقييمات المرتبطة بمراجع الطلبات.",
  },
];

export const metadata: Metadata = {
  title: `دخول المختصين | ${siteConfig.name}`,
  description: "صفحة دخول المختصين في Cyvero للوصول إلى بوابة المحادثات والطلبات والتقييمات.",
};

export default function SpecialistsLoginPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "دخول المختصين" }]} />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="Specialist Access"
              title="بوابة دخول المختصين لمتابعة طلبات العملاء داخل Cyvero"
              description="هذه الصفحة تمهد لمسار متخصص: يدخل المختص، يشاهد الطلبات الموجهة إليه، يراجع بيانات التحقق الأولي، ثم يرد داخل قناة محادثة منظمة."
            />
          </div>

          <div className="grid gap-4">
            {specialistPortalNotes.map((item) => {
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

      <SpecialistLoginForm
        accounts={specialistAccounts.map(({ specialistName, username }) => ({
          specialistName,
          username,
        }))}
        demoPassword={specialistAccounts[0]?.password ?? "Cyvero123"}
      />
    </div>
  );
}
