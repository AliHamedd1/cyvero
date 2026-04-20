import { cn } from "@/lib/utils";

export function CyberBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-grid bg-[size:52px_52px] opacity-[0.08]" />
      <div className="absolute inset-0 bg-radial opacity-90" />
      <div className="absolute -right-12 top-8 h-40 w-40 rounded-full border border-cyanGlow/15 bg-cyanGlow/8 blur-3xl" />
      <div className="absolute -left-12 bottom-0 h-48 w-48 rounded-full border border-sky-400/10 bg-sky-500/10 blur-3xl" />
      <div className="absolute right-[10%] top-[18%] h-px w-40 bg-gradient-to-l from-transparent via-cyanGlow/30 to-transparent" />
      <div className="absolute left-[12%] top-[30%] h-px w-28 bg-gradient-to-l from-transparent via-white/20 to-transparent" />
      <div className="absolute right-[14%] top-[17%] size-2 rounded-full bg-cyanGlow/60 shadow-[0_0_14px_rgba(126,231,255,0.6)]" />
      <div className="absolute left-[18%] top-[29.5%] size-2 rounded-full bg-white/40 shadow-[0_0_12px_rgba(255,255,255,0.18)]" />
      <div className="absolute bottom-[18%] left-[24%] h-16 w-16 rounded-full border border-white/6" />
      <div className="absolute bottom-[16%] left-[26%] h-10 w-10 rounded-full border border-cyanGlow/10" />
    </div>
  );
}
