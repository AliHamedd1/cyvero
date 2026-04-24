"use client";

import Link from "next/link";
import { CheckCircle2, MessageSquareText, Phone, Send, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  formatCurrency,
  getCompanyTypeOption,
  readBusinessQuoteSummary,
} from "@/data/business";
import { createPrototypeReference, isValidEmail } from "@/lib/prototype";

const emptyFormState = {
  fullName: "",
  email: "",
  companyName: "",
  phone: "",
  notes: "",
};

type SalesFormState = typeof emptyFormState;
type SalesFormErrors = Partial<Record<keyof SalesFormState, string>>;

function isValidPhone(value: string) {
  return /^\+?[0-9\s-]{8,16}$/.test(value.trim());
}

export function SalesContactExperience() {
  const searchParams = useSearchParams();
  const quoteSummary = readBusinessQuoteSummary(searchParams);
  const companyMeta = getCompanyTypeOption(quoteSummary.companyType);
  const hasTransferredData = Boolean(
    searchParams.get("companyType") || searchParams.get("computers") || searchParams.get("servers"),
  );

  const [formState, setFormState] = useState<SalesFormState>(emptyFormState);
  const [errors, setErrors] = useState<SalesFormErrors>({});
  const [successState, setSuccessState] = useState<null | {
    name: string;
    companyName: string;
    reference: string;
  }>(null);

  function setFieldValue(field: keyof SalesFormState, value: string) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validateForm() {
    const nextErrors: SalesFormErrors = {};

    if (formState.fullName.trim().length < 5) {
      nextErrors.fullName = "يرجى إدخال الاسم الكامل.";
    }

    if (!isValidEmail(formState.email.trim())) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صالح.";
    }

    if (formState.companyName.trim().length < 2) {
      nextErrors.companyName = "يرجى إدخال اسم الشركة.";
    }

    if (!isValidPhone(formState.phone)) {
      nextErrors.phone = "يرجى إدخال رقم جوال صالح.";
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
    setSuccessState({
      name: formState.fullName.trim(),
      companyName: formState.companyName.trim(),
      reference: createPrototypeReference("SAL"),
    });
    setFormState(emptyFormState);
  }

  const controlClassName =
    "w-full rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8";

  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="panel cyber-card overflow-hidden p-6 md:p-8">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
            <MessageSquareText className="size-4" />
            تواصل مع فريق المبيعات
          </div>
          <h3 className="font-heading text-3xl text-white">أرسل تفاصيلك وسيتواصل الفريق معك</h3>
          <p className="leading-8 text-steel">
            سيعتمد فريق المبيعات على الملخص المنقول من صفحة حلول الشركات بالإضافة إلى بيانات التواصل
            التالية لتقديم متابعة أكثر دقة واحترافية.
          </p>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-steel">
                الاسم
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
                  placeholder="name@company.com"
                  dir="ltr"
                />
                {errors.email ? <span className="text-xs text-danger">{errors.email}</span> : null}
              </label>

              <label className="grid gap-2 text-sm text-steel">
                اسم الشركة
                <input
                  value={formState.companyName}
                  onChange={(event) => setFieldValue("companyName", event.target.value)}
                  className={controlClassName}
                  placeholder="اسم الشركة"
                />
                {errors.companyName ? <span className="text-xs text-danger">{errors.companyName}</span> : null}
              </label>

              <label className="grid gap-2 text-sm text-steel">
                رقم الجوال
                <div className="relative">
                  <Phone className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                  <input
                    value={formState.phone}
                    onChange={(event) => setFieldValue("phone", event.target.value)}
                    className={`${controlClassName} pr-11`}
                    placeholder="+9665XXXXXXXX"
                    dir="ltr"
                  />
                </div>
                {errors.phone ? <span className="text-xs text-danger">{errors.phone}</span> : null}
              </label>
            </div>

            <label className="grid gap-2 text-sm text-steel">
              رسالة أو ملاحظات إضافية
              <textarea
                value={formState.notes}
                onChange={(event) => setFieldValue("notes", event.target.value)}
                rows={6}
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                placeholder="أضف أي ملاحظات تشغيلية أو متطلبات خاصة أو مواعيد مناسبة للتواصل."
              />
            </label>

            <div className="rounded-[1.5rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5 text-sm leading-7 text-steel">
              هذه الصفحة تجريبية ضمن نسخة Frontend أولية. لن يتم إرسال البيانات إلى Backend حقيقي في
              هذه المرحلة، ولكن تجربة الانتقال ونقل الملخص تعمل بالكامل داخل الواجهة.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
              >
                إرسال إلى فريق المبيعات
                <Send className="size-4" />
              </button>
              <Link
                href="/subscriptions/business"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
              >
                العودة إلى حلول الشركات
              </Link>
            </div>
          </form>

          {successState ? (
            <div className="rounded-[1.6rem] border border-success/30 bg-success/10 p-5" aria-live="polite">
              <div className="flex items-center gap-3 text-success">
                <CheckCircle2 className="size-5" />
                <span className="text-sm font-semibold">تم إرسال الطلب التجريبي بنجاح</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-100">
                شكرًا <span className="font-semibold text-white">{successState.name}</span>، سيُعامل طلب
                <span className="font-semibold text-white"> {successState.companyName} </span>
                كمتابعة مبيعات أولية داخل الواجهة.
              </p>
              <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-midnight/50 p-4">
                <p className="text-xs tracking-[0.16em] text-steel">رقم المتابعة التجريبي</p>
                <p className="mt-2 font-heading text-3xl text-white">{successState.reference}</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <aside className="panel cyber-card overflow-hidden p-6 md:p-8">
        <div className="space-y-6">
          <div className="rounded-[1.6rem] border border-cyanGlow/15 bg-gradient-to-br from-cyanGlow/18 via-cyanGlow/8 to-white/5 p-6">
            <p className="text-sm font-semibold text-cyanGlow">ملخص الطلب المنقول</p>
            <p className="mt-3 font-heading text-4xl text-white">{formatCurrency(quoteSummary.estimatedPrice)}</p>
            <p className="mt-3 text-sm leading-7 text-steel">
              {hasTransferredData
                ? "تم نقل هذا الملخص تلقائيًا من صفحة حلول الشركات."
                : "لم تصل تفاصيل تسعير بعد، ويمكنك استخدام هذه الصفحة للتواصل العام أو العودة للحاسبة."}
            </p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-steel">نوع الشركة</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {hasTransferredData ? companyMeta.label : "غير محدد بعد"}
              </p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-steel">عدد أجهزة الكمبيوتر</p>
              <p className="mt-1 text-lg font-semibold text-white">{quoteSummary.computerCount}</p>
            </div>
            <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-steel">عدد السيرفرات</p>
              <p className="mt-1 text-lg font-semibold text-white">{quoteSummary.serverCount}</p>
            </div>
            <div className="rounded-[1.35rem] border border-cyanGlow/15 bg-cyanGlow/10 p-4">
              <p className="text-sm text-cyanGlow">السعر التقديري النهائي</p>
              <p className="mt-1 text-2xl font-bold text-white">
                {formatCurrency(quoteSummary.estimatedPrice)}
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
            <div className="flex items-center gap-3 text-cyanGlow">
              <ShieldCheck className="size-4" />
              <span className="font-semibold">كيف سيستخدم الفريق هذه البيانات؟</span>
            </div>
            <p className="mt-3">
              سيعتمد فريق المبيعات على نوع الشركة، عدد أجهزة الكمبيوتر، عدد السيرفرات، والسعر
              التقديري لتجهيز متابعة تناسب التفاصيل التي تم اختيارها.
            </p>
          </div>
        </div>
      </aside>
    </section>
  );
}
