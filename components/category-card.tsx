import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

import { CyberIcon } from "@/components/cyber-icon";
import { Category } from "@/types/cyber";

interface CategoryCardProps {
  category: Category;
  threatCount: number;
}

export function CategoryCard({ category, threatCount }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      aria-label={`الانتقال إلى تصنيف ${category.name}`}
      className="group panel cyber-card flex h-full flex-col justify-between overflow-hidden p-6 transition duration-300 hover:-translate-y-1.5 hover:border-cyanGlow/35 hover:shadow-glow"
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-l from-transparent via-cyanGlow/30 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className={`rounded-[1.4rem] bg-gradient-to-br ${category.color} p-4 ring-1 ring-white/10`}>
            <CyberIcon name={category.icon} className="size-7 text-cyanGlow" />
          </div>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-steel">
            {threatCount} تهديد
          </span>
        </div>
        <div className="space-y-3">
          <h3 className="font-heading text-2xl text-white">{category.name}</h3>
          <p className="text-sm leading-7 text-steel">{category.shortDescription}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {category.focusAreas.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-cyanGlow">
        <span>عرض التفاصيل</span>
        <ArrowUpLeft className="size-4 transition group-hover:-translate-x-1 group-hover:-translate-y-1" />
      </div>
    </Link>
  );
}
