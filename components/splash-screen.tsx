"use client";

import { useEffect, useState } from "react";

import { BrandMark } from "@/components/brand-mark";

const SPLASH_SESSION_KEY = "cyvero-splash-seen";

export function SplashScreen({ enabled }: { enabled: boolean }) {
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<"idle" | "enter" | "exit">("idle");

  useEffect(() => {
    if (!enabled) {
      setVisible(false);
      setPhase("idle");
      return;
    }

    const hasSeenSplash = window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "true";

    if (hasSeenSplash) {
      setVisible(false);
      setPhase("idle");
      return;
    }

    setVisible(true);
    setPhase("enter");

    const exitTimer = window.setTimeout(() => {
      setPhase("exit");
    }, 1100);

    const closeTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(SPLASH_SESSION_KEY, "true");
      setVisible(false);
      setPhase("idle");
    }, 1900);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(closeTimer);
    };
  }, [enabled]);

  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(126,231,255,0.18),transparent_28%),linear-gradient(180deg,rgba(5,8,22,0.96),rgba(5,8,22,0.985))]">
      <div
        className={`flex w-full max-w-2xl flex-col items-center gap-6 px-6 text-center transition-all duration-700 ${
          phase === "exit" ? "-translate-y-20 opacity-0" : "translate-y-0 opacity-100"
        }`}
      >
        <div className="rounded-[2rem] border border-cyanGlow/20 bg-white/5 px-6 py-5 shadow-glow">
          <BrandMark showSubtitle className="scale-125" />
        </div>
        <div className="space-y-3">
          <h1 className="font-heading text-4xl text-white md:text-5xl">Cyvero</h1>
          <p className="text-base leading-8 text-steel md:text-lg">
            منصة سيبرانية لحماية الأفراد والشركات من التهديدات الرقمية
          </p>
        </div>
      </div>
    </div>
  );
}
