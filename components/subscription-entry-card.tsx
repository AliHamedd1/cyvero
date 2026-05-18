import Link from "next/link";
import { ArrowUpLeft, type LucideIcon } from "lucide-react";

interface SubscriptionEntryCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  badge: string;
}

export function SubscriptionEntryCard({
  title,
  description,
  href,
  icon: Icon,
  badge,
}: SubscriptionEntryCardProps) {
  return (
    <Link
      href={href}
      className="group panel cyber-card flex h-full flex-col justify-between overflow-hidden p-6 transition duration-300 hover:-translate-y-0.5 hover:border-cyanGlow/25 hover:shadow-glow"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-l from-transparent via-cyanGlow/25 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="icon-shell p-4">
            <Icon className="size-7" />
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-steel">
            {badge}
          </span>
        </div>
        <div className="space-y-3">
          <h3 className="font-heading text-[1.75rem] text-white">{title}</h3>
          <p className="text-sm leading-8 text-steel">{description}</p>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-cyanGlow">
        <span>دخول القسم</span>
        <ArrowUpLeft className="size-4 transition group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
