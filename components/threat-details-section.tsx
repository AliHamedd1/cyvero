import { ReactNode } from "react";

interface ThreatDetailsSectionProps {
  title: string;
  description?: string;
  items?: string[];
  icon?: ReactNode;
}

export function ThreatDetailsSection({
  title,
  description,
  items,
  icon,
}: ThreatDetailsSectionProps) {
  return (
    <section className="panel-soft p-6 md:p-8">
      <div className="flex items-start gap-4">
        {icon ? (
          <div className="rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
            {icon}
          </div>
        ) : null}
        <div className="w-full space-y-4">
          <h3 className="font-heading text-2xl text-white">{title}</h3>
          {description ? <p className="leading-8 text-steel">{description}</p> : null}
          {items ? (
            <ul className="space-y-3 text-sm leading-7 text-slate-100">
              {items.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-base text-slate-100"
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}
