"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="panel space-y-5 p-6 md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-steel">
          الاسم
          <input name="name" required className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
        </label>
        <label className="grid gap-2 text-sm text-steel">
          البريد الإلكتروني
          <input
            type="email"
            name="email"
            required
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
          />
        </label>
      </div>
      <label className="grid gap-2 text-sm text-steel">
        الموضوع
        <input name="subject" required className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
      </label>
      <label className="grid gap-2 text-sm text-steel">
        الرسالة
        <textarea
          name="message"
          required
          rows={6}
          className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
        />
      </label>
      <button
        type="submit"
        className="rounded-2xl bg-cyanGlow px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
      >
        إرسال الرسالة
      </button>
      {submitted ? (
        <div aria-live="polite" className="flex items-center gap-3 rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-3 text-sm text-cyanGlow">
          <CheckCircle2 className="size-4" />
          تم إرسال الرسالة بنجاح بصيغة تجريبية.
        </div>
      ) : null}
    </form>
  );
}
