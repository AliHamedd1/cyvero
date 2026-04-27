"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

import { DEVICE_PREFERENCE_KEY } from "@/lib/prototype";
import { cn } from "@/lib/utils";

type DeviceSwitcherButtonProps = {
  fullWidth?: boolean;
  compact?: boolean;
};

export function DeviceSwitcherButton({
  fullWidth = false,
  compact = false,
}: DeviceSwitcherButtonProps) {
  const router = useRouter();

  function handleSwitch() {
    window.localStorage.removeItem(DEVICE_PREFERENCE_KEY);
    router.push("/");
  }

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10",
        compact ? "px-4 py-2.5" : "px-5 py-3.5",
        fullWidth && "w-full",
      )}
    >
      <RefreshCw className="size-4" />
      تغيير نوع الجهاز
    </button>
  );
}
