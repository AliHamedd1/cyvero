"use client";

import { LoaderCircle, Quote, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { formatArabicDate } from "@/lib/prototype";
import { cn } from "@/lib/utils";
import { SpecialistRating } from "@/types/cyber";

async function parseApiResponse(response: Response) {
  const payload = (await response.json()) as {
    error?: string;
    ratings?: SpecialistRating[];
  };

  if (!response.ok) {
    throw new Error(payload.error || "تعذر تحميل تقييمات المختصين.");
  }

  return payload;
}

export function SpecialistReviewsSection() {
  const [ratings, setRatings] = useState<SpecialistRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRatings() {
      try {
        const response = await fetch("/api/specialist-ratings", { cache: "no-store" });
        const payload = await parseApiResponse(response);

        if (active) {
          setRatings(payload.ratings ?? []);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "تعذر تحميل تقييمات المختصين.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadRatings();

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const total = ratings.length;
    const average = total > 0 ? ratings.reduce((sum, item) => sum + item.rating, 0) / total : 0;

    return {
      total,
      average,
    };
  }, [ratings]);

  return (
    <section className="space-y-6">
      <SectionHeading
        eyebrow="تقييمات المختصين"
        title="تجارب العملاء مع المختصين تظهر هنا مباشرة"
        description="بعد انتهاء الطلب يمكن للعميل إضافة تقييم نجوم وتعليق، وتنعكس هذه التقييمات على الصفحة الرئيسية وصفحة المختصين."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="panel cyber-card overflow-hidden p-6 md:p-8">
          <p className="text-sm font-semibold text-cyanGlow">ملخص عام</p>
          <p className="mt-4 font-heading text-6xl text-white">{summary.average.toFixed(1)}</p>
          <div className="mt-4 flex gap-1 text-amber-300">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={cn("size-5", index < Math.round(summary.average) && "fill-current")}
              />
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-steel">
            مبني على <span className="text-white">{summary.total}</span> تقييمات مرتبطة بطلبات مختصين داخل
            النسخة الحالية.
          </p>
          {error ? (
            <p className="mt-4 rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="panel col-span-full flex min-h-[220px] items-center justify-center text-steel">
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                جار تحميل تقييمات المختصين...
              </span>
            </div>
          ) : ratings.length === 0 ? (
            <div className="panel col-span-full p-8 text-center">
              <p className="font-heading text-2xl text-white">لا توجد تقييمات مختصين بعد</p>
              <p className="mt-3 leading-8 text-steel">
                ستظهر هنا التقييمات الجديدة فور إتمام أول الطلبات وإرسال مراجعات العملاء.
              </p>
            </div>
          ) : (
            ratings.slice(0, 6).map((rating) => (
              <article
                key={rating.id}
                className="panel-soft cyber-card overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-cyanGlow/25"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-1 text-amber-300">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className={cn("size-4", index < rating.rating && "fill-current")} />
                    ))}
                  </div>
                  <div className="rounded-2xl border border-cyanGlow/15 bg-cyanGlow/10 p-2 text-cyanGlow">
                    <Quote className="size-4" />
                  </div>
                </div>
                <p className="mt-4 font-semibold text-white">{rating.specialistName}</p>
                <p className="mt-1 text-sm text-cyanGlow">{rating.serviceArea}</p>
                <p className="mt-3 text-sm leading-7 text-steel">{rating.comment}</p>
                <div className="mt-4 border-t border-white/8 pt-4">
                  <p className="text-sm text-white">{rating.clientName}</p>
                  <p className="mt-1 text-xs text-steel">{formatArabicDate(rating.submittedAt)}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
