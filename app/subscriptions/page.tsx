import { Metadata } from "next";
import { Building2, Shield, Sparkles } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { IndividualSubscriptionsShowcase } from "@/components/individual-subscriptions-showcase";
import { SectionHeading } from "@/components/section-heading";
import { SubscriptionEntryCard } from "@/components/subscription-entry-card";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `الاشتراكات | ${siteConfig.name}`,
  description:
    "المدخل الرئيسي لاشتراكات Cyvero 2.0 ويشمل باقات الأفراد وحلول الشركات ضمن تجربة عربية منظمة واحترافية.",
};

export default function SubscriptionsPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "الاشتراكات" }]} />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="قسم الاشتراكات"
              title="اشتراكات أفراد وحلول شركات من صفحة واحدة"
              description="تم تنظيم هذا القسم ليكون واضحًا وسهل التوسع: باقات فردية، حلول شركات، ونموذج اشتراك تجريبي فعلي بدون ربط دفع حقيقي."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-steel">
                الاشتراكات هنا مهيأة للاستخدام الفعلي داخل النسخة الحالية، مع رسائل نجاح وأرقام اشتراك محفوظة
                داخل المنصة.
              </div>
              <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-steel">
                يمكنك أيضًا الانتقال إلى حاسبة حلول الشركات ونقل البيانات مباشرة إلى صفحة المبيعات.
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-cyanGlow/15 bg-gradient-to-br from-cyanGlow/16 via-cyanGlow/8 to-white/5 p-6">
            <div className="inline-flex rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
              Cyvero Subscriptions
            </div>
            <p className="mt-4 font-heading text-4xl leading-tight text-white">
              باقات فردية وحلول شركات ضمن تجربة واحدة واضحة ومنظمة
            </p>
            <p className="mt-4 text-base leading-8 text-steel">
              اختر المسار المناسب لك، ثم تابع إلى تفاصيل الباقات أو التسعير التقديري للشركات مع واجهات مترابطة
              واحترافية.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <SubscriptionEntryCard
          title="اشتراكات الأفراد"
          description="خطط مناسبة للمستخدمين الأفراد مع مقارنة مرئية واضحة وتدرج منطقي في المزايا."
          href="/subscriptions/individuals"
          icon={Shield}
          badge="للأفراد"
        />
        <SubscriptionEntryCard
          title="حلول الشركات"
          description="صفحة مخصصة للجهات والمنشآت تتضمن حاسبة تفاعلية لحساب السعر التقديري حسب عدد الأجهزة والسيرفرات."
          href="/subscriptions/business"
          icon={Building2}
          badge="للشركات"
        />
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="اشتراك مباشر"
          title="أنشئ اشتراكك الآن من نفس الصفحة"
          description="اختر الباقة المناسبة ثم أدخل بياناتك لإنشاء رقم اشتراك عشوائي مباشر داخل المنصة."
        />
        <IndividualSubscriptionsShowcase />
      </section>

      <section className="panel-soft p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
            <Sparkles className="size-5" />
          </div>
          <div className="space-y-3">
            <h3 className="font-heading text-2xl text-white">جاهزية للتوسع مستقبلًا</h3>
            <p className="leading-8 text-steel">
              تم تنظيم هذا القسم ليكون أساسًا لنظام اشتراكات أكثر تطورًا لاحقًا يشمل إدارة الخطط والمزايا
              ومستويات الخدمة للأفراد والمنشآت.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
