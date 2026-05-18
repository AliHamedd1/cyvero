"use client";

import { AlertCircle, CheckCircle2, LoaderCircle, UploadCloud } from "lucide-react";
import { useState } from "react";

import { readApiPayload } from "@/lib/fetch";
import { isValidEmail } from "@/lib/prototype";

type ExpertRequestFormState = {
  name: string;
  email: string;
  issueType: string;
  platform: string;
  urgency: string;
  description: string;
  consent: boolean;
  attachmentsName: string;
};

type ExpertRequestErrors = Partial<Record<keyof ExpertRequestFormState, string>>;

const emptyForm: ExpertRequestFormState = {
  name: "",
  email: "",
  issueType: "اختراق حسابات",
  platform: "",
  urgency: "متوسطة",
  description: "",
  consent: false,
  attachmentsName: "",
};

export function ExpertRequestForm() {
  const [formState, setFormState] = useState<ExpertRequestFormState>(emptyForm);
  const [errors, setErrors] = useState<ExpertRequestErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successState, setSuccessState] = useState<null | { reference: string }>(null);

  function setFieldValue<K extends keyof ExpertRequestFormState>(
    field: K,
    value: ExpertRequestFormState[K],
  ) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError("");
    setSuccessState(null);
  }

  function validateForm() {
    const nextErrors: ExpertRequestErrors = {};

    if (formState.name.trim().length < 3) {
      nextErrors.name = "يرجى كتابة الاسم بشكل واضح.";
    }

    if (!isValidEmail(formState.email)) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صالح.";
    }

    if (formState.platform.trim().length < 2) {
      nextErrors.platform = "يرجى تحديد المنصة أو النظام المتأثر.";
    }

    if (formState.description.trim().length < 20) {
      nextErrors.description = "يرجى كتابة وصف أوضح للحالة.";
    }

    if (!formState.consent) {
      nextErrors.consent = "يجب الموافقة على الإقرار القانوني قبل الإرسال.";
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
      const response = await fetch("/api/expert-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      const payload = await readApiPayload<{
        error?: string;
        submission?: {
          reference: string;
        };
      }>(response, "تعذر إرسال الطلب حاليًا.");

      setFormState(emptyForm);
      setErrors({});
      setSuccessState({
        reference: payload.submission?.reference ?? "",
      });
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "تعذر إرسال الطلب حاليًا.");
    } finally {
      setSubmitting(false);
    }
  }

  const controlClassName =
    "w-full rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8";

  return (
    <form onSubmit={handleSubmit} className="panel grid gap-5 p-6 md:grid-cols-2 md:p-8" noValidate>
      <label className="grid gap-2 text-sm text-steel">
        الاسم
        <input
          value={formState.name}
          onChange={(event) => setFieldValue("name", event.target.value)}
          className={controlClassName}
          placeholder="الاسم الكامل"
        />
        {errors.name ? <span className="text-xs text-danger">{errors.name}</span> : null}
      </label>

      <label className="grid gap-2 text-sm text-steel">
        البريد الإلكتروني
        <input
          type="text"
          inputMode="email"
          value={formState.email}
          onChange={(event) => setFieldValue("email", event.target.value)}
          className={controlClassName}
          placeholder="name@example.com"
          dir="ltr"
          autoComplete="email"
        />
        {errors.email ? <span className="text-xs text-danger">{errors.email}</span> : null}
      </label>

      <label className="grid gap-2 text-sm text-steel">
        نوع المشكلة
        <select
          value={formState.issueType}
          onChange={(event) => setFieldValue("issueType", event.target.value)}
          className={controlClassName}
        >
          {[
            "اختراق حسابات",
            "اشتباه بفدية أو برمجية خبيثة",
            "تصيد أو انتحال",
            "تسريب بيانات",
            "مراجعة أو استشارة عامة",
          ].map((option) => (
            <option key={option} value={option} className="bg-slatecore text-white">
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm text-steel">
        المنصة أو النظام المتأثر
        <input
          value={formState.platform}
          onChange={(event) => setFieldValue("platform", event.target.value)}
          className={controlClassName}
          placeholder="مثل: بريد العمل أو واتساب أو خادم ملفات"
        />
        {errors.platform ? <span className="text-xs text-danger">{errors.platform}</span> : null}
      </label>

      <label className="grid gap-2 text-sm text-steel">
        درجة الاستعجال
        <select
          value={formState.urgency}
          onChange={(event) => setFieldValue("urgency", event.target.value)}
          className={controlClassName}
        >
          {["منخفضة", "متوسطة", "مرتفعة", "حرجة"].map((option) => (
            <option key={option} value={option} className="bg-slatecore text-white">
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-2 text-sm text-steel md:col-span-2">
        وصف الحالة
        <textarea
          value={formState.description}
          onChange={(event) => setFieldValue("description", event.target.value)}
          rows={7}
          className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
          placeholder="اشرح ما حدث، ومتى بدأ، وما الأثر الظاهر حاليًا"
        />
        {errors.description ? <span className="text-xs text-danger">{errors.description}</span> : null}
      </label>

      <div className="md:col-span-2">
        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-3xl border border-dashed border-cyanGlow/20 bg-cyanGlow/5 px-5 py-8 text-center text-sm text-steel transition hover:border-cyanGlow/35 hover:text-white">
          <UploadCloud className="size-5 text-cyanGlow" />
          {formState.attachmentsName || "رفع ملف أو صورة مرجعية بشكل اختياري"}
          <input
            type="file"
            className="hidden"
            aria-label="رفع ملف مرجعي"
            onChange={(event) => setFieldValue("attachmentsName", event.target.files?.[0]?.name ?? "")}
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm text-steel md:col-span-2">
        <span className="flex gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 leading-7">
          <input
            type="checkbox"
            checked={formState.consent}
            onChange={(event) => setFieldValue("consent", event.target.checked)}
            className="mt-1 size-4 accent-cyanGlow"
          />
          أقر بأن الطلب قانوني، وأنني صاحب الحساب أو الجهاز أو أملك صلاحية قانونية واضحة لطلب المساعدة بشأنه.
        </span>
        {errors.consent ? <span className="text-xs text-danger">{errors.consent}</span> : null}
      </label>

      {serverError ? (
        <div className="flex items-start gap-3 rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100 md:col-span-2">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" />
          <p>{serverError}</p>
        </div>
      ) : null}

      {successState ? (
        <div className="rounded-[1.6rem] border border-success/30 bg-success/10 p-5 md:col-span-2" aria-live="polite">
          <div className="flex items-center gap-3 text-success">
            <CheckCircle2 className="size-5" />
            <span className="text-sm font-semibold">تم إرسال الطلب بنجاح</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-slate-100">
            تم تسجيل طلبك داخل Cyvero وتحويله إلى قائمة الطلبات الأولية للمراجعة.
          </p>
          <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-midnight/60 p-4">
            <p className="text-xs tracking-[0.16em] text-steel">رقم الطلب</p>
            <p className="mt-2 font-heading text-3xl text-white">{successState.reference}</p>
          </div>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
      >
        {submitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            جار إرسال الطلب...
          </>
        ) : (
          "إرسال الطلب"
        )}
      </button>
    </form>
  );
}
