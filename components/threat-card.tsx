import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

import { CyberIcon } from "@/components/cyber-icon";
import { audienceMap, severityMap } from "@/lib/utils";
import { Threat } from "@/types/cyber";

export function ThreatCard({ threat }: { threat: Threat }) {
  return (
    <Link
      href={`/threats/${threat.slug}`}
      aria-label={`قراءة تفاصيل التهديد ${threat.name}`}
      className="group panel cyber-card flex h-full flex-col justify-between overflow-hidden p-6 transition duration-300 hover:-translate-y-0.5 hover:border-cyanGlow/25 hover:shadow-glow"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-l from-transparent via-cyanGlow/25 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="absolute left-6 top-6 rounded-[1rem] border border-cyanGlow/15 bg-cyanGlow/10 p-3 text-cyanGlow opacity-90">
        <CyberIcon name={threat.icon} className="size-5" />
      </div>

      <div className="space-y-5 pt-10">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityMap[threat.severity].className}`}>
            {severityMap[threat.severity].label}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-steel">
            {threat.category}
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-steel">
            {audienceMap[threat.audience]}
          </span>
          <span className="rounded-full border border-cyanGlow/10 bg-cyanGlow/5 px-3 py-1 text-xs text-cyanGlow">
            {threat.threatType}
          </span>
        </div>
        <div className="space-y-3">
          <h3 className="font-heading text-2xl text-white">{threat.name}</h3>
          <p className="text-sm leading-7 text-steel">{threat.shortDescription}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {threat.affectedSystems.slice(0, 3).map((system) => (
            <span key={system} className="rounded-full border border-cyanGlow/10 bg-cyanGlow/5 px-3 py-1 text-xs text-cyanGlow">
              {system}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-cyanGlow">
        <span>قراءة التفاصيل الدفاعية</span>
        <ArrowUpLeft className="size-4 transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
