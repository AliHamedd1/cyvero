"use client";

import Link from "next/link";
import { Check, CheckCircle2, Copy, Shield, Sparkles, Star } from "lucide-react";
import { useState } from "react";

import { IndividualPlan, individualPlans } from "@/data/subscriptions";
import { isValidEmail } from "@/lib/prototype";
import { cn } from "@/lib/utils";

type FormState = {
  fullName: string;
  email: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const emptyForm: FormState = {
  fullName: "",
  email: "",
};

async function parseApiResponse(response: Response) {
  const payload = (await response.json()) as {
    error?: string;
    order?: {
      reference: string;
      email: string;
      planName: string;
    };
  };

  if (!response.ok) {
    throw new Error(payload.error || "تعذر إنشاء الاشتراك حاليًا.");
  }

  return payload;
}

export function IndividualSubscriptionsShowcase() {
  const [activePlanId, setActivePlanId] = useState<IndividualPlan["id"]>("plus");
  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successState, setSuccessState] = useState<null | {
    reference: string;
    planName: string;
    email: string;
  }>(null);
  const [serverError, setServerError] = useState("");
  const [copied, setCopied] = useState(false);

  const activePlan = individualPlans.find((plan) => plan.id === activePlanId) ?? individualPlans[1];

  function setFieldValue(field: keyof FormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError("");
    setSuccessState(null);
  }

  function selectPlan(planId: IndividualPlan["id"]) {
    setActivePlanId(planId);
    setErrors({});
    setServerError("");
    setSuccessState(null);
    setCopied(false);
  }

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (formState.fullName.trim().length < 3) {
      nextErrors.fullName = "يرجى إدخال الاسم الكامل.";
    }

    if (!isValidEmail(formState.email)) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صالح.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSuccessState(null);
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const response = await fetch("/api/subscription-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: activePlan.id,
          planName: activePlan.name,
          planPrice: activePlan.price,
          fullName: formState.fullName,
          email: formState.email,
        }),
      });
      const payload = await parseApiResponse(response);

      setFormState(emptyForm);
      setErrors({});
      setCopied(false);
      setSuccessState({
        reference: payload.order?.reference ?? "",
        email: payload.order?.email ?? formState.email.trim(),
        planName: payload.order?.planName ?? activePlan.name,
      });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "تعذر إنشاء الاشتراك حاليًا.");
    } finally {
      setSubmitting(false);
    }
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
                  "group panel cyber-card h-full overflow-hidden p-5 text-right transition duration-300",
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
                اشتراك بدون دفع فعلي
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
                يتم إنشاء رقم اشتراك تجريبي فقط داخل المنصة بدون أي ربط دفع حقيقي أو حفظ لبيانات بطاقات.
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-steel">
                  الاسم الكامل
                  <input
                    value={formState.fullName}
                    onChange={(event) => setFieldValue("fullName", event.target.value)}
                    className={controlClassName}
                    placeholder="الاسم الكامل"
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
              </div>

              {serverError ? (
                <div className="rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100">
                  {serverError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "جار إنشاء الاشتراك..." : "إنشاء الاشتراك"}
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
                  <span className="text-sm font-semibold">تم إنشاء الاشتراك بنجاح</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-100">
                  تم تسجيل <span className="font-semibold text-white">{successState.planName}</span> لصاحب
                  البريد <span className="text-white">{successState.email}</span>.
                </p>
                <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-midnight/60 p-4">
                  <p className="text-xs tracking-[0.16em] text-steel">رقم الاشتراك</p>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-heading text-3xl text-white">{successState.reference}</p>
                    <button
                      type="button"
                      onClick={() => void copyReference()}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
                    >
                      <Copy className="size-4" />
                      {copied ? "تم النسخ" : "نسخ الرقم"}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
              تم تنظيم مسار الاشتراكات ليكون جاهزًا للتوسعة لاحقًا نحو إدارة عضويات ومزايا أوسع، مع
              الحفاظ الآن على تجربة آمنة وخفيفة داخل النسخة الحالية.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/business-solutions"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
              >
                حلول الشركات
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
