"use client";

import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";

type SplashScreenProps = {
  phase?: "enter" | "exit";
};

export function SplashScreen({ phase = "enter" }: SplashScreenProps) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#06101E,#09172B)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_30%)]" />

      <div
        className={cn(
          "relative flex w-full max-w-xl flex-col items-center gap-5 px-6 text-center transition-all duration-1000 ease-out",
          phase === "exit" ? "-translate-y-8 scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100",
        )}
      >
        <div className="flex size-28 animate-pulse-soft items-center justify-center rounded-[1.8rem] border border-cyanGlow/20 bg-white/[0.03] shadow-panel backdrop-blur-md md:size-32">
          <BrandMark showWordmark={false} className="scale-[1.55]" />
        </div>

        <div className="space-y-3">
          <h1 className="font-heading text-4xl text-white md:text-5xl">Cyvero</h1>
          <p className="mx-auto max-w-lg text-sm leading-8 text-steel md:text-base">
            منصة سيبرانية لحماية الأفراد والشركات من التهديدات الرقمية
          </p>
        </div>
      </div>
    </div>
  );
}
