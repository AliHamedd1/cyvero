"use client";

import { AlertCircle, KeyRound, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ADMIN_PASSWORD, ADMIN_SESSION_KEY, ADMIN_USERNAME } from "@/lib/prototype";

const emptyFormState = {
  username: "",
  password: "",
};

export function AdminLoginForm() {
  const router = useRouter();
  const [formState, setFormState] = useState(emptyFormState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "authenticated") {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (formState.username === ADMIN_USERNAME && formState.password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
      setError("");
      router.push("/admin/dashboard");
      return;
    }

    setError("بيانات الدخول غير صحيحة. يرجى التحقق من اسم المستخدم وكلمة المرور.");
  }

  const controlClassName = "control-field";

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="panel-soft cyber-card p-6 md:p-8">
        <div className="space-y-4">
          <div className="eyebrow">وضع تجريبي</div>
          <h3 className="font-heading text-3xl text-white">دخول الأدمن داخل الواجهة فقط</h3>
          <p className="leading-8 text-steel">
            هذه النسخة لا تحتوي على نظام Backend أو جلسات مصادقة حقيقية. التحقق الحالي محلي وتجريبي فقط بهدف معاينة
            لوحة الأدمن التي تعرض الطلبات والبلاغات.
          </p>

          <div className="surface-note">
            <p className="font-semibold text-white">بيانات الاختبار</p>
            <p className="mt-3">
              اسم المستخدم: <span className="text-cyanGlow">{ADMIN_USERNAME}</span>
            </p>
            <p className="mt-1">
              كلمة المرور: <span className="text-cyanGlow">{ADMIN_PASSWORD}</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="panel cyber-card overflow-hidden p-6 md:p-8">
        <div className="space-y-5">
          <div className="eyebrow inline-flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Cyvero Admin Access
          </div>
          <h3 className="font-heading text-3xl text-white">تسجيل دخول الأدمن</h3>
          <p className="leading-8 text-steel">
            أدخل بيانات الاعتماد التجريبية للوصول إلى لوحة الأدمن التي تعرض الطلبات والبلاغات والإحصاءات التجريبية.
          </p>

          <div className="grid gap-4">
            <label className="grid gap-2 text-sm text-steel">
              اسم المستخدم
              <div className="relative">
                <UserRound className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                <input
                  value={formState.username}
                  onChange={(event) => setFormState((current) => ({ ...current, username: event.target.value }))}
                  className={`${controlClassName} pr-11`}
                  placeholder="Admin"
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
                  onChange={(event) => setFormState((current) => ({ ...current, password: event.target.value }))}
                  className={`${controlClassName} pr-11`}
                  placeholder="A12345a"
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

          <button type="submit" className="btn-primary w-full">
            دخول لوحة الطلبات
          </button>
        </div>
      </form>
    </section>
  );
}
