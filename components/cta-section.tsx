import Link from "next/link";
import { ArrowUpLeft, ShieldCheck } from "lucide-react";

interface CTASectionProps {
  title: string;
  description: string;
}

export function CTASection({ title, description }: CTASectionProps) {
  return (
    <section className="panel relative overflow-hidden px-6 py-8 md:px-10 md:py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-cyanGlow/10 via-transparent to-transparent" />
      <div className="relative grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div className="space-y-4">
          <span className="eyebrow inline-flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Cyvero
          </span>
          <h2 className="font-heading text-3xl leading-tight text-white md:text-4xl">{title}</h2>
          <p className="max-w-2xl leading-8 text-steel">{description}</p>
        </div>
        <div className="grid gap-3 md:justify-self-end">
          <Link href="/why-cyvero" className="btn-primary justify-between">
            لماذا Cyvero؟
            <ArrowUpLeft className="size-4" />
          </Link>
          <Link href="/categories" className="btn-secondary justify-between">
            ابدأ بتصفح التهديدات
            <ArrowUpLeft className="size-4" />
          </Link>
          <Link href="/analyze" className="btn-secondary justify-between">
            حلّل حالتي الآن
            <ArrowUpLeft className="size-4" />
          </Link>
          <Link href="/request-expert" className="btn-secondary justify-between">
            اطلب مختص
            <ArrowUpLeft className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
