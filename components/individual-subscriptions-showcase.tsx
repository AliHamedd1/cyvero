"use client";

import Link from "next/link";
import { Check, CheckCircle2, Copy, CreditCard, Shield, Sparkles, Star } from "lucide-react";
import { useState } from "react";

import { IndividualPlan, individualPlans } from "@/data/subscriptions";
import { createPrototypeReference, isValidEmail } from "@/lib/prototype";
import { cn } from "@/lib/utils";

const emptyFormState = {
  fullName: "",
  email: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

type FormState = typeof emptyFormState;
type FormErrors = Partial<Record<keyof FormState, string>>;

function formatCardNumber(value: string) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
  return digitsOnly.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(value: string) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 4);

  if (digitsOnly.length <= 2) {
    return digitsOnly;
  }

  return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
}

function isValidExpiry(value: string) {
  return /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
}

export function IndividualSubscriptionsShowcase() {
  const [activePlanId, setActivePlanId] = useState<IndividualPlan["id"]>("plus");
  const [formState, setFormState] = useState<FormState>(emptyFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successState, setSuccessState] = useState<null | {
    reference: string;
    planName: string;
    email: string;
  }>(null);
  const [copied, setCopied] = useState(false);

  const activePlan = individualPlans.find((plan) => plan.id === activePlanId) ?? individualPlans[1];

  function setFieldValue(field: keyof FormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function selectPlan(planId: IndividualPlan["id"]) {
    setActivePlanId(planId);
    setErrors({});
    setSuccessState(null);
    setCopied(false);
    setFormState(emptyFormState);
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (formState.fullName.trim().length < 5) {
      nextErrors.fullName = "يرجى إدخال الاسم الكامل بشكل واضح.";
    }

    if (!isValidEmail(formState.email.trim())) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صالح.";
    }

    if (!activePlan.isFree) {
      const cardDigits = formState.cardNumber.replace(/\D/g, "");

      if (cardDigits.length < 16) {
        nextErrors.cardNumber = "أدخل رقم بطاقة تجريبيًا مكوّنًا من 16 رقمًا.";
      }

      if (!isValidExpiry(formState.expiry)) {
        nextErrors.expiry = "أدخل تاريخًا بصيغة MM/YY.";
      }

      if (!/^\d{3,4}$/.test(formState.cvv)) {
        nextErrors.cvv = "أدخل CVV تجريبيًا من 3 أو 4 أرقام.";
      }
    }

    return nextErrors;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSuccessState(null);
      return;
    }

    setErrors({});
    setCopied(false);
    setSuccessState({
      reference: createPrototypeReference("CYV"),
      planName: activePlan.name,
      email: formState.email.trim(),
    });
    setFormState(emptyFormState);
  }

  async function copyReference() {
    if (!successState) {
      return;
    }

    try {
      await navigator.clipboard.writeText(successState.reference);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  const controlClassName =
    "w-full rounded-[1.3rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8";

  return (
    <section className="space-y-6">
      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="grid gap-5 md:grid-cols-3">
          {individualPlans.map((plan) => {
            const isActive = activePlan.id === plan.id;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => selectPlan(plan.id)}
                className={cn(
                  "group text-right panel cyber-card h-full overflow-hidden p-5 transition duration-300",
                  isActive
                    ? "border-cyanGlow/35 bg-cyanGlow/10 shadow-glow"
                    : "hover:-translate-y-1.5 hover:border-cyanGlow/20",
                )}
                aria-pressed={isActive}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="rounded-2xl border border-cyanGlow/15 bg-cyanGlow/10 p-3 text-cyanGlow">
                    {plan.highlight ? <Star className="size-5" /> : <Shield className="size-5" />}
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs",
                      plan.highlight
                        ? "border border-cyanGlow/25 bg-cyanGlow/10 text-cyanGlow"
                        : "border border-white/10 bg-white/5 text-steel",
                    )}
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
                {activePlan.isFree ? "تسجيل مبسط" : "نموذج دفع شكلي"}
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

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="rounded-[1.5rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5 text-sm leading-7 text-steel">
                {activePlan.isFree
                  ? "الباقة المجانية تكتفي ببيانات الاشتراك الأساسية، دون أي حقول دفع."
                  : "الحقول التالية شكلية فقط لأغراض العرض. لا يتم ربط دفع حقيقي ولا حفظ بيانات بطاقة فعلية داخل هذه النسخة."}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-steel">
                  الاسم الكامل
                  <input
                    value={formState.fullName}
                    onChange={(event) => setFieldValue("fullName", event.target.value)}
                    className={controlClassName}
                    placeholder="مثال: أحمد علي القحطاني"
                  />
                  {errors.fullName ? <span className="text-xs text-danger">{errors.fullName}</span> : null}
                </label>

                <label className="grid gap-2 text-sm text-steel">
                  البريد الإلكتروني
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(event) => setFieldValue("email", event.target.value)}
                    className={controlClassName}
                    placeholder="name@example.com"
                    dir="ltr"
                  />
                  {errors.email ? <span className="text-xs text-danger">{errors.email}</span> : null}
                </label>

                {!activePlan.isFree ? (
                  <>
                    <label className="grid gap-2 text-sm text-steel md:col-span-2">
                      رقم البطاقة
                      <div className="relative">
                        <CreditCard className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                        <input
                          value={formState.cardNumber}
                          onChange={(event) => setFieldValue("cardNumber", formatCardNumber(event.target.value))}
                          className={cn(controlClassName, "pr-11")}
                          placeholder="4242 4242 4242 4242"
                          inputMode="numeric"
                          dir="ltr"
                        />
                      </div>
                      {errors.cardNumber ? <span className="text-xs text-danger">{errors.cardNumber}</span> : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel">
                      تاريخ الانتهاء
                      <input
                        value={formState.expiry}
                        onChange={(event) => setFieldValue("expiry", formatExpiry(event.target.value))}
                        className={controlClassName}
                        placeholder="MM/YY"
                        inputMode="numeric"
                        dir="ltr"
                      />
                      {errors.expiry ? <span className="text-xs text-danger">{errors.expiry}</span> : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel">
                      CVV
                      <input
                        value={formState.cvv}
                        onChange={(event) => setFieldValue("cvv", event.target.value.replace(/\D/g, "").slice(0, 4))}
                        className={controlClassName}
                        placeholder="123"
                        inputMode="numeric"
                        dir="ltr"
                      />
                      {errors.cvv ? <span className="text-xs text-danger">{errors.cvv}</span> : null}
                    </label>
                  </>
                ) : null}
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
              >
                {activePlan.isFree ? "تفعيل الاشتراك المجاني" : "إتمام الاشتراك"}
                <Sparkles className="size-4" />
              </button>
            </form>

            {successState ? (
              <div
                aria-live="polite"
                className="rounded-[1.7rem] border border-success/30 bg-success/10 p-5 shadow-panel"
              >
                <div className="flex items-center gap-3 text-success">
                  <CheckCircle2 className="size-5" />
                  <span className="text-sm font-semibold">تم إنشاء الاشتراك التجريبي بنجاح</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-100">
                  تم تفعيل <span className="font-semibold text-white">{successState.planName}</span> لصاحب
                  البريد <span className="text-white">{successState.email}</span>.
                </p>
                <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-midnight/60 p-4">
                  <p className="text-xs tracking-[0.16em] text-steel">رقم الاشتراك</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-heading text-3xl text-white">{successState.reference}</p>
                    <button
                      type="button"
                      onClick={copyReference}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
                    >
                      <Copy className="size-4" />
                      {copied ? "تم النسخ" : "نسخ الرقم"}
                    </button>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-steel">
                  استخدم هذا الرقم لاحقًا كمرجع للاشتراك عند أي متابعة داخل النسخة التجريبية.
                </p>
              </div>
            ) : null}

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
              تتطور Cyvero لاحقًا إلى نظام حماية يتم تثبيته على الأجهزة، لذلك تعكس هذه الباقات النسخة
              الأولى من رحلة الاشتراك مع جاهزية للنمو نحو خدمات أوسع وأكثر نضجًا.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/subscriptions/business"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
              >
                استكشف حلول الشركات
                <Sparkles className="size-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
              >
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
