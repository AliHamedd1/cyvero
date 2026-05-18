import { cn } from "@/lib/utils";

export function CyberBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-radial opacity-80" />
      <div className="absolute -right-10 top-8 h-40 w-40 rounded-full bg-cyanGlow/12 blur-3xl" />
      <div className="absolute -left-8 bottom-8 h-32 w-32 rounded-full bg-cyber/10 blur-3xl" />
      <div className="absolute right-[11%] top-[20%] h-px w-32 bg-gradient-to-l from-transparent via-cyanGlow/30 to-transparent" />
    </div>
  );
}
