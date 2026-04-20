import { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpLeft, SearchX } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryAction?: ReactNode;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="panel-soft flex flex-col items-center gap-4 px-6 py-10 text-center">
      <div className="rounded-3xl border border-cyanGlow/20 bg-cyanGlow/10 p-4 text-cyanGlow">
        <SearchX className="size-7" />
      </div>
      <div className="space-y-2">
        <h3 className="font-heading text-2xl text-white">{title}</h3>
        <p className="max-w-2xl leading-8 text-steel">{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        {actionLabel && actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
          >
            {actionLabel}
            <ArrowUpLeft className="size-4" />
          </Link>
        ) : null}
        {secondaryAction}
      </div>
    </div>
  );
}
