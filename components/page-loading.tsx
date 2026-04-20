import { BrandMark } from "@/components/brand-mark";

interface PageLoadingProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export function PageLoading({
  eyebrow = "Cyvero Loading State",
  title = "يتم تجهيز تجربة Cyvero...",
  description = "نحمّل العناصر الأساسية والبيانات التفاعلية حتى تظهر الصفحة بشكل منظم وواضح.",
}: PageLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="panel mx-auto flex max-w-5xl flex-col gap-8 overflow-hidden px-6 py-10 md:px-10"
    >
      <BrandMark showSubtitle />
      <div className="space-y-3">
        <p className="eyebrow">{eyebrow}</p>
        <div className="h-10 w-full max-w-2xl animate-pulse rounded-2xl bg-white/8" />
        <div className="h-4 w-full max-w-3xl animate-pulse rounded-full bg-white/8" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded-full bg-white/8" />
      </div>
      <div className="space-y-2">
        <p className="text-base font-semibold text-white">{title}</p>
        <p className="max-w-3xl text-sm leading-7 text-steel">{description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="panel-soft h-48 animate-pulse bg-white/5" />
        ))}
      </div>
      <span className="sr-only">جارٍ التحميل</span>
    </div>
  );
}
