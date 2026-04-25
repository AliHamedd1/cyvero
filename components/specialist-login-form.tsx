"use client";

import { AlertCircle, BadgeCheck, KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SPECIALIST_SESSION_KEY } from "@/lib/prototype";
import { SpecialistSession } from "@/types/cyber";

type SpecialistLoginFormProps = {
  accounts: Array<{
    specialistName: string;
    username: string;
  }>;
  demoPassword: string;
};

const emptyFormState = {
  username: "",
  password: "",
};

async function parseApiResponse(response: Response) {
  const payload = (await response.json()) as {
    error?: string;
    session?: SpecialistSession;
  };

  if (!response.ok) {
    throw new Error(payload.error || "تعذر تسجيل الدخول حاليًا.");
  }

  return payload;
}

export function SpecialistLoginForm({ accounts, demoPassword }: SpecialistLoginFormProps) {
  const router = useRouter();
  const [formState, setFormState] = useState(emptyFormState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(SPECIALIST_SESSION_KEY)) {
      router.replace("/specialists/portal");
    }
  }, [router]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/specialist-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      const payload = await parseApiResponse(response);

      if (payload.session) {
        window.sessionStorage.setItem(SPECIALIST_SESSION_KEY, JSON.stringify(payload.session));
        router.push("/specialists/portal");
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "تعذر تسجيل الدخول حاليًا.");
    } finally {
      setSubmitting(false);
    }
  }

  const controlClassName =
    "w-full rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8";

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="panel-soft cyber-card p-6 md:p-8">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
            وضع تجريبي للمختصين
          </div>
          <h3 className="font-heading text-3xl text-white">بوابة تشغيل المختصين داخل Cyvero</h3>
          <p className="leading-8 text-steel">
            بعد تسجيل الدخول يمكن للمختص استعراض المحادثات الواردة له، قراءة بيانات التحقق الأولي، ثم الرد
            على العملاء وتحديث حالة كل محادثة.
          </p>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
            <p className="font-semibold text-white">بيانات الاختبار</p>
            <p className="mt-3">
              كلمة المرور المشتركة: <span className="text-cyanGlow">{demoPassword}</span>
            </p>
            <p className="mt-2">
              اختر اسم المستخدم المناسب للمختص الذي تريد دخول بوابته. جميع الحسابات أدناه تجريبية داخل
              الواجهة فقط.
            </p>
          </div>

          <div className="grid gap-3">
            {accounts.map((account) => (
              <div key={account.username} className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{account.specialistName}</p>
                    <p className="mt-1 text-sm text-steel" dir="ltr">
                      {account.username}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-2 text-cyanGlow">
                    <BadgeCheck className="size-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="panel cyber-card overflow-hidden p-6 md:p-8">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
            <ShieldCheck className="size-4" />
            Specialist Access
          </div>
          <h3 className="font-heading text-3xl text-white">تسجيل دخول المختص</h3>
          <p className="leading-8 text-steel">
            أدخل بيانات المختص التجريبية لفتح بوابة المحادثات والتعامل مع طلبات العملاء المرسلة من صفحة
            المختصين.
          </p>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-steel">
              اسم المستخدم
              <div className="relative">
                <UserRound className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                <input
                  value={formState.username}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, username: event.target.value }))
                  }
                  className={`${controlClassName} pr-11`}
                  placeholder="salem.network"
                  dir="ltr"
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm text-steel">
              كلمة المرور
              <div className="relative">
                <KeyRound className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                <input
                  type="password"
                  value={formState.password}
                  onChange={(event) =>
                    setFormState((current) => ({ ...current, password: event.target.value }))
                  }
                  className={`${controlClassName} pr-11`}
                  placeholder="Cyvero123"
                  dir="ltr"
                />
              </div>
            </label>
          </div>

          {error ? (
            <div className="flex items-start gap-3 rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" />
              <p>{error}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "جار تسجيل الدخول..." : "دخول بوابة المختص"}
          </button>
        </div>
      </form>
    </section>
  );
}
