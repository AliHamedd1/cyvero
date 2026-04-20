import { ShieldCheck, Waypoints } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  compact?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export function BrandMark({
  compact = false,
  showSubtitle = false,
  className,
}: BrandMarkProps) {
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <span className="relative flex items-center justify-center overflow-hidden rounded-[1.25rem] border border-cyanGlow/20 bg-[radial-gradient(circle_at_top,_rgba(126,231,255,0.28),_rgba(10,17,34,0.92)_62%)] text-white shadow-glow">
        <span className={cn("absolute inset-[5px] rounded-[0.95rem] border border-white/10", compact ? "inset-1" : "")} />
        <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(126,231,255,0.22),transparent_55%,rgba(126,231,255,0.12))]" />
        <span className={cn("relative z-10", compact ? "p-2" : "p-3")}>
          <ShieldCheck className={compact ? "size-4" : "size-5"} />
        </span>
        <Waypoints className={cn("absolute text-cyanGlow/60", compact ? "bottom-1 left-1 size-3" : "bottom-1.5 left-1.5 size-3.5")} />
      </span>
      <span className="grid leading-none">
        <span className={cn("font-heading tracking-[0.08em] text-white", compact ? "text-lg" : "text-2xl")}>
          Cyvero
        </span>
        {showSubtitle ? (
          <span className="mt-1 text-[0.72rem] text-steel">Cyber Vigilance for Arabic Readiness</span>
        ) : null}
      </span>
    </div>
  );
}
