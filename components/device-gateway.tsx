"use client";

import { ArrowUpLeft, LoaderCircle, Monitor, ShieldCheck, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DEVICE_PREFERENCE_KEY } from "@/lib/prototype";
import { cn } from "@/lib/utils";
import { DevicePreference } from "@/types/cyber";

const deviceOptions: Array<{
  id: DevicePreference;
  title: string;
  description: string;
  icon: typeof Smartphone;
}> = [
  {
    id: "mobile",
    title: "الجوال",
    description: "ادخل إلى صفحة مخصصة لحماية الجوال من التطبيقات والروابط والرسائل والمخاطر اليومية.",
    icon: Smartphone,
  },
  {
    id: "desktop",
    title: "الكمبيوتر",
    description: "ادخل إلى صفحة مخصصة لحماية الكمبيوتر من البرمجيات الخبيثة ومخاطر الشبكات والأنظمة.",
    icon: Monitor,
  },
];

function getDeviceLabel(value: DevicePreference) {
  return value === "mobile" ? "الجوال" : "الكمبيوتر";
}

export function DeviceGateway() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [redirectingTo, setRedirectingTo] = useState<DevicePreference | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(DEVICE_PREFERENCE_KEY);

    if (stored === "mobile" || stored === "desktop") {
      setRedirectingTo(stored);
      router.replace(`/${stored}`);
      return;
    }

    setReady(true);
  }, [router]);

  function selectDevice(device: DevicePreference) {
    window.localStorage.setItem(DEVICE_PREFERENCE_KEY, device);
    router.push(`/${device}`);
  }

  if (!ready) {
    return (
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(61,244,255,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(61,244,255,0.1),transparent_30%)]" />
        <div className="panel cyber-card relative max-w-2xl overflow-hidden p-8 text-center">
          <div className="mx-auto inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-4 text-cyanGlow">
            <LoaderCircle className="size-6 animate-spin" />
          </div>
          <h1 className="mt-6 font-heading text-4xl text-white">
            {redirectingTo ? `جار فتح صفحة ${getDeviceLabel(redirectingTo)}` : "جار تجهيز صفحة الاختيار"}
          </h1>
          <p className="mt-4 leading-8 text-steel">
            يتم التحقق من اختيار الجهاز المحفوظ لديك لتوجيهك مباشرة إلى المسار المناسب.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(61,244,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(61,244,255,0.12),transparent_28%)]" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
            <ShieldCheck className="size-4" />
            Cyvero Device Gateway
          </div>
          <h1 className="font-heading text-4xl leading-tight text-white md:text-5xl lg:text-6xl">
            اختر نوع الجهاز قبل الدخول إلى المحتوى
          </h1>
          <p className="text-base leading-8 text-steel md:text-lg">
            اختر ما إذا كنت تريد مسارًا مخصصًا للجوال أو للكمبيوتر. سيتم حفظ اختيارك وتوجيهك إليه
            تلقائيًا عند زيارتك القادمة.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {deviceOptions.map((option) => {
            const Icon = option.icon;

            return (
              <article
                key={option.id}
                className={cn(
                  "cyber-card rounded-[2.2rem] border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:border-cyanGlow/20 hover:bg-cyanGlow/8",
                  option.id === "mobile" && "bg-[linear-gradient(180deg,rgba(61,244,255,0.08),rgba(255,255,255,0.03))]",
                  option.id === "desktop" && "bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(61,244,255,0.08))]",
                )}
              >
                <div className="inline-flex rounded-[1.5rem] border border-cyanGlow/20 bg-cyanGlow/10 p-4 text-cyanGlow">
                  <Icon className="size-8" />
                </div>

                <h2 className="mt-8 font-heading text-5xl text-white">{option.title}</h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-steel">{option.description}</p>

                <button
                  type="button"
                  onClick={() => selectDevice(option.id)}
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
                >
                  دخول صفحة {option.title}
                  <ArrowUpLeft className="size-4" />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
