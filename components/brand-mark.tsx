import { ShieldCheck, Waypoints } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  compact?: boolean;
  showSubtitle?: boolean;
  showWordmark?: boolean;
  className?: string;
}

export function BrandMark({
  compact = false,
  showSubtitle = false,
  showWordmark = true,
  className,
}: BrandMarkProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <span className="relative flex items-center justify-center overflow-hidden rounded-[1.05rem] border border-cyanGlow/20 bg-[linear-gradient(180deg,rgba(15,28,51,0.96),rgba(11,22,40,0.88))] text-white shadow-[0_10px_24px_rgba(2,8,23,0.22)]">
        <span className={cn("absolute inset-[4px] rounded-[0.82rem] border border-white/10", compact ? "inset-[3px]" : "")} />
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(56,189,248,0.18),transparent_55%,rgba(14,165,233,0.08))]" />
        <span className={cn("relative z-10", compact ? "p-2" : "p-3")}>
          <ShieldCheck className={compact ? "size-4" : "size-5"} />
        </span>
        <Waypoints
          className={cn(
            "absolute text-cyanGlow/70",
            compact ? "bottom-1 left-1 size-3" : "bottom-1.5 left-1.5 size-3.5",
          )}
        />
      </span>

      {showWordmark ? (
        <span className="grid gap-1 leading-none">
          <span className={cn("font-heading tracking-[0.04em] text-white", compact ? "text-base" : "text-2xl")}>
            Cyvero
          </span>
          {showSubtitle ? (
            <span className="text-[0.72rem] text-steel">منصة سيبرانية عربية لحماية الأفراد والشركات</span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
}
