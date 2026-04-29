"use client";

import { AlertCircle, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { useState } from "react";

import { isValidEmail } from "@/lib/prototype";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFormErrors = Partial<Record<keyof ContactFormState, string>>;

const emptyForm: ContactFormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

async function parseApiResponse(response: Response) {
  const payload = (await response.json()) as {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error || "تعذر إرسال الرسالة حاليًا.");
  }
}

export function ContactForm() {
  const [formState, setFormState] = useState<ContactFormState>(emptyForm);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  function setFieldValue<K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) {
    setFormState((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setServerError("");
    setSuccessMessage("");
  }

  function validateForm() {
    const nextErrors: ContactFormErrors = {};

    if (formState.name.trim().length < 3) {
      nextErrors.name = "يرجى كتابة الاسم بشكل واضح.";
    }

    if (!isValidEmail(formState.email)) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صالح.";
    }

    if (formState.subject.trim().length < 3) {
      nextErrors.subject = "يرجى كتابة موضوع الرسالة.";
    }

    if (formState.message.trim().length < 15) {
      nextErrors.message = "يرجى كتابة رسالة أكثر تفصيلًا.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSuccessMessage("");
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });

      await parseApiResponse(response);
      setFormState(emptyForm);
      setErrors({});
      setSuccessMessage("تم إرسال رسالتك بنجاح، وسُجلت داخل المنصة كطلب تواصل جديد.");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "تعذر إرسال الرسالة حاليًا.");
    } finally {
      setSubmitting(false);
    }
  }

  const controlClassName =
    "w-full rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8";

  return (
    <form onSubmit={handleSubmit} className="panel space-y-5 p-6 md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
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

      <label className="grid gap-2 text-sm text-steel">
        الموضوع
        <input
          value={formState.subject}
          onChange={(event) => setFieldValue("subject", event.target.value)}
          className={controlClassName}
          placeholder="موضوع الرسالة"
        />
        {errors.subject ? <span className="text-xs text-danger">{errors.subject}</span> : null}
      </label>

      <label className="grid gap-2 text-sm text-steel">
        الرسالة
        <textarea
          value={formState.message}
          onChange={(event) => setFieldValue("message", event.target.value)}
          rows={6}
          className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
          placeholder="اكتب رسالتك أو استفسارك هنا"
        />
        {errors.message ? <span className="text-xs text-danger">{errors.message}</span> : null}
      </label>

      {serverError ? (
        <div className="flex items-start gap-3 rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100">
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" />
          <p>{serverError}</p>
        </div>
      ) : null}

      {successMessage ? (
        <div className="flex items-start gap-3 rounded-[1.35rem] border border-success/30 bg-success/10 px-4 py-3 text-sm text-emerald-100">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
          <p>{successMessage}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <LoaderCircle className="size-4 animate-spin" />
            جار إرسال الرسالة...
          </>
        ) : (
          <>
            إرسال الرسالة
            <Send className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
