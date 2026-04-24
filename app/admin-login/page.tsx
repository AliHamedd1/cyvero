import { Metadata } from "next";
import { LockKeyhole, ShieldCheck, Waypoints } from "lucide-react";

import { AdminLoginForm } from "@/components/admin-login-form";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";

const adminNotes = [
  {
    icon: LockKeyhole,
    title: "تحقق واجهي فقط",
    description: "تسجيل الدخول الحالي تجريبي بالكامل داخل الواجهة ولا يعتمد على أي Backend فعلي.",
  },
  {
    icon: ShieldCheck,
    title: "لوحة تشغيل منظمة",
    description: "بعد تسجيل الدخول يتم نقل المستخدم إلى لوحة مليئة ببلاغات وهمية قابلة للبحث والتصفية.",
  },
  {
    icon: Waypoints,
    title: "جاهز للتوسعة لاحقًا",
    description: "الهيكل الحالي مناسب لإضافة مصادقة حقيقية وصلاحيات وأدوار ولوحات تشغيل أكثر تعقيدًا مستقبلًا.",
  },
];

export const metadata: Metadata = {
  title: `دخول الأدمن | ${siteConfig.name}`,
  description:
    "صفحة تسجيل دخول أدمن تجريبية داخل Cyvero تمهد للانتقال إلى لوحة بلاغات احترافية.",
};

export default function AdminLoginPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "دخول الأدمن" }]} />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-5">
            <SectionHeading
              eyebrow="Admin Access"
              title="بوابة دخول تجريبية للوصول إلى لوحة إدارة Cyvero"
              description="الهدف من هذه الصفحة هو معاينة تدفق دخول الأدمن داخل الواجهة فقط، ثم الانتقال إلى Dashboard مليء ببلاغات وفلاتر وإحصاءات بطابع سيبراني احترافي."
            />
          </div>

          <div className="grid gap-4">
            {adminNotes.map((item) => {
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

      <AdminLoginForm />
    </div>
  );
}
