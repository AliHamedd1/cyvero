"use client";

import Link from "next/link";
import { Check, Shield, Sparkles, Star } from "lucide-react";
import { useState } from "react";

const plans = [
  {
    id: "basic",
    name: "الباقة الأساسية",
    price: "مجانية",
    priceNote: "وصول توعوي أساسي للمحتوى والواجهة الدفاعية.",
    badge: "بداية سهلة",
    highlight: false,
    description: "مناسبة لمن يريد متابعة التوعية الأساسية والاطلاع على التهديدات والإرشادات الأولية.",
    features: [
      "الوصول إلى مكتبة التهديدات الدفاعية داخل Cyvero.",
      "استخدام أساسي لصفحة تحليل الحالة التفاعلية.",
      "تنبيهات ومحتوى تمهيدي مناسب للمستخدمين الجدد.",
    ],
  },
  {
    id: "plus",
    name: "حماية بلس",
    price: "199 ريال سنويًا",
    priceNote: "توازن عملي بين السعر والمزايا.",
    badge: "الأكثر شيوعًا",
    highlight: true,
    description: "مناسبة لمن يريد مستوى أعلى من التوعية والتنظيم والمتابعة مع تجربة أكثر ثراءً.",
    features: [
      "كل مزايا الباقة الأساسية.",
      "محتوى موسع وأدلة وقوائم تحقق دفاعية أكثر تفصيلًا.",
      "أولوية أعلى في الوصول إلى التحديثات والمزايا القادمة.",
      "تجربة أقوى عند تطور المنصة لاحقًا إلى نظام حماية يثبت على الأجهزة.",
    ],
  },
  {
    id: "pro",
    name: "حماية برو",
    price: "350 ريال سنويًا",
    priceNote: "للأفراد الأكثر اهتمامًا بالحماية والاستفادة الكاملة.",
    badge: "أعلى تغطية",
    highlight: false,
    description: "مناسبة للمستخدم الذي يريد أقصى استفادة من التطويرات المستقبلية والمزايا المتقدمة.",
    features: [
      "كل مزايا حماية بلس.",
      "وصول أفضل إلى المقارنات والأدلة التفصيلية داخل المنصة.",
      "جاهزية للاستفادة من طبقات الحماية المستقبلية عند إطلاقها للأجهزة.",
      "أفضل مسار للمستخدمين الذين يريدون تغطية أوضح ونطاقًا أوسع من المزايا.",
    ],
  },
] as const;

export function IndividualSubscriptionsShowcase() {
  const [activePlanId, setActivePlanId] = useState<(typeof plans)[number]["id"]>("plus");
  const activePlan = plans.find((plan) => plan.id === activePlanId) ?? plans[1];

  return (
    <section className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan) => {
            const isActive = activePlan.id === plan.id;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setActivePlanId(plan.id)}
                className={`group text-right panel cyber-card h-full overflow-hidden p-5 transition duration-300 ${
                  isActive
                    ? "border-cyanGlow/35 bg-cyanGlow/10 shadow-glow"
                    : "hover:-translate-y-1.5 hover:border-cyanGlow/20"
                }`}
                aria-pressed={isActive}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-2xl border border-cyanGlow/15 bg-cyanGlow/10 p-3 text-cyanGlow">
                    {plan.highlight ? <Star className="size-5" /> : <Shield className="size-5" />}
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs ${
                      plan.highlight
                        ? "border border-cyanGlow/25 bg-cyanGlow/10 text-cyanGlow"
                        : "border border-white/10 bg-white/5 text-steel"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
                <div className="mt-5 space-y-2">
                  <h3 className="font-heading text-2xl text-white">{plan.name}</h3>
                  <p className="text-lg font-semibold text-cyanGlow">{plan.price}</p>
                  <p className="text-sm leading-7 text-steel">{plan.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="panel cyber-card overflow-hidden p-6 md:p-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-3 py-1 text-xs text-cyanGlow">
                {activePlan.badge}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-steel">
                مزايا تتصاعد مع مستوى الاشتراك
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="font-heading text-4xl text-white">{activePlan.name}</h3>
              <p className="text-2xl font-bold text-cyanGlow">{activePlan.price}</p>
              <p className="text-sm leading-7 text-steel">{activePlan.priceNote}</p>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm leading-8 text-steel">{activePlan.description}</p>
            </div>

            <div className="grid gap-3">
              {activePlan.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-100"
                >
                  <div className="mt-1 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 p-1 text-cyanGlow">
                    <Check className="size-3.5" />
                  </div>
                  <p>{feature}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
              تتطور Cyvero لاحقًا إلى نظام حماية يتم تثبيته على الأجهزة، لذلك تعكس هذه الباقات النسخة الأولى من رحلة الاشتراك مع جاهزية للنمو نحو خدمات أوسع وأكثر نضجًا.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
              >
                اشتراك شكلي
              </Link>
              <Link
                href="/subscriptions/business"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
              >
                استكشف حلول الشركات
                <Sparkles className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
