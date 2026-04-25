"use client";

import { AlertCircle, CheckCircle2, LoaderCircle, Quote, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { SectionHeading } from "@/components/section-heading";
import { formatArabicDate } from "@/lib/prototype";
import { cn } from "@/lib/utils";
import { RatingReview } from "@/types/cyber";

const ratingCategories = [
  "التجربة العامة",
  "وضوح المحتوى",
  "المحتوى السيبراني",
  "حلول الشركات",
  "المختصون والخدمات",
] as const;

type ReviewFormState = {
  name: string;
  role: string;
  category: string;
  rating: number;
  comment: string;
};

type ReviewFormErrors = Partial<Record<keyof ReviewFormState, string>>;

const emptyReviewForm: ReviewFormState = {
  name: "",
  role: "",
  category: ratingCategories[0],
  rating: 5,
  comment: "",
};

async function parseReviewResponse(response: Response) {
  const payload = (await response.json()) as {
    error?: string;
    review?: RatingReview;
    reviews?: RatingReview[];
  };

  if (!response.ok) {
    throw new Error(payload.error || "تعذر تنفيذ العملية حاليًا.");
  }

  return payload;
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<RatingReview[]>([]);
  const [reviewForm, setReviewForm] = useState<ReviewFormState>(emptyReviewForm);
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadReviews() {
      try {
        const response = await fetch("/api/community-reviews", { cache: "no-store" });
        const payload = await parseReviewResponse(response);

        if (active) {
          setReviews(payload.reviews ?? []);
          setServerError("");
        }
      } catch (error) {
        if (active) {
          setServerError(error instanceof Error ? error.message : "تعذر تحميل التقييمات الحالية.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadReviews();

    return () => {
      active = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : 0;
    const recommendationRate =
      total > 0
        ? Math.round((reviews.filter((review) => review.rating >= 4).length / total) * 100)
        : 0;

    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((review) => review.rating === rating).length;

      return {
        rating,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      };
    });

    return {
      total,
      average,
      recommendationRate,
      distribution,
    };
  }, [reviews]);

  function setFieldValue<K extends keyof ReviewFormState>(field: K, value: ReviewFormState[K]) {
    setReviewForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
    setServerError("");
  }

  function validateForm() {
    const nextErrors: ReviewFormErrors = {};

    if (reviewForm.name.trim().length < 3) {
      nextErrors.name = "يرجى كتابة الاسم بشكل واضح.";
    }

    if (reviewForm.role.trim().length < 3) {
      nextErrors.role = "يرجى كتابة الصفة أو الجهة.";
    }

    if (reviewForm.comment.trim().length < 20) {
      nextErrors.comment = "يرجى كتابة تعليق أكثر تفصيلًا.";
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      nextErrors.rating = "يرجى اختيار تقييم من نجمة إلى خمس نجوم.";
    }

    return nextErrors;
  }

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setSubmitting(true);
    setServerError("");

    try {
      const response = await fetch("/api/community-reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewForm),
      });
      const payload = await parseReviewResponse(response);

      if (payload.review) {
        setReviews((current) => [payload.review!, ...current]);
      }

      setReviewForm(emptyReviewForm);
      setErrors({});
      setSubmitted(true);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "تعذر إرسال التقييم حاليًا.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="ratings" className="space-y-8">
      <SectionHeading
        eyebrow="نظام التقييم"
        title="تقييمات بشرية فعلية تعكس تجربة Cyvero كما يراها المستخدمون"
        description="لم تعد هناك أي مراجعات مزروعة أو أسماء وهمية. هذا القسم يعرض فقط التقييمات التي يرسلها الزوار فعليًا داخل المنصة."
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="panel cyber-card overflow-hidden p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1fr]">
            <div className="space-y-5">
              <div className="rounded-[1.7rem] border border-cyanGlow/15 bg-gradient-to-br from-cyanGlow/18 via-cyanGlow/8 to-white/5 p-6">
                <p className="text-sm font-semibold text-cyanGlow">متوسط التقييم</p>
                <p className="mt-3 font-heading text-6xl text-white">{stats.average.toFixed(1)}</p>
                <div className="mt-3 flex gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={cn(
                        "size-5",
                        index < Math.round(stats.average) ? "fill-current" : "opacity-35",
                      )}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-7 text-steel">
                  بناءً على <span className="text-white">{stats.total}</span> تقييمًا بشريًا محفوظًا داخل هذه
                  النسخة.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-steel">إجمالي التقييمات</p>
                  <p className="mt-2 font-heading text-3xl text-white">{stats.total}</p>
                </div>
                <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-steel">نسبة التوصية</p>
                  <p className="mt-2 font-heading text-3xl text-white">{stats.recommendationRate}%</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">توزيع النجوم</p>
                <div className="mt-4 space-y-3">
                  {stats.distribution.map((item) => (
                    <div key={item.rating} className="grid grid-cols-[40px_1fr_42px] items-center gap-3">
                      <span className="text-sm text-steel">{item.rating}★</span>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-cyanGlow"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-white">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
                كل مراجعة جديدة تنعكس مباشرة على المتوسط وتوزيع النجوم وقائمة الآراء، لذلك يعرض القسم صورة
                أقرب إلى الواقع بدل الاعتماد على انطباعات ثابتة.
              </div>
            </div>
          </div>

          {serverError && !reviews.length ? (
            <div className="mt-6 flex items-start gap-3 rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" />
              <p>{serverError}</p>
            </div>
          ) : null}

          {loading ? (
            <div className="mt-6 flex min-h-[180px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 text-steel">
              <span className="inline-flex items-center gap-2">
                <LoaderCircle className="size-4 animate-spin" />
                جار تحميل التقييمات الحالية...
              </span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="mt-6 rounded-[1.5rem] border border-dashed border-cyanGlow/20 bg-cyanGlow/10 p-6 text-center">
              <p className="font-heading text-2xl text-white">لا توجد تقييمات بشرية بعد</p>
              <p className="mt-3 leading-8 text-steel">
                كن أول من يضيف رأيه في Cyvero، وسيظهر تقييمك هنا مباشرة بعد الإرسال.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {reviews.slice(0, 6).map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.55rem] border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-cyanGlow/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex gap-1 text-amber-300">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={cn("size-4", index < item.rating && "fill-current")}
                        />
                      ))}
                    </div>
                    <div className="rounded-2xl border border-cyanGlow/15 bg-cyanGlow/10 p-2 text-cyanGlow">
                      <Quote className="size-4" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-cyanGlow">{item.category}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-100">&ldquo;{item.comment}&rdquo;</p>
                  <div className="mt-5 border-t border-white/8 pt-4">
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="mt-1 text-sm text-steel">{item.role}</p>
                    <p className="mt-1 text-xs text-steel">{formatArabicDate(item.submittedAt)}</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={submitReview} className="panel cyber-card overflow-hidden p-6 md:p-8">
          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="font-heading text-3xl text-white">أضف تقييمك الآن</h3>
              <p className="leading-8 text-steel">
                شارك رأيك في Cyvero، وسيتم احتساب تقييمك مباشرة ضمن المتوسط العام بدون أي مراجعات وهمية
                مسبقة.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-steel">
                الاسم
                <input
                  value={reviewForm.name}
                  onChange={(event) => setFieldValue("name", event.target.value)}
                  className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                  placeholder="اسمك"
                />
                {errors.name ? <span className="text-xs text-danger">{errors.name}</span> : null}
              </label>

              <label className="grid gap-2 text-sm text-steel">
                الصفة أو الجهة
                <input
                  value={reviewForm.role}
                  onChange={(event) => setFieldValue("role", event.target.value)}
                  className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                  placeholder="مثل: مسؤول تقنية أو مستخدم فردي"
                />
                {errors.role ? <span className="text-xs text-danger">{errors.role}</span> : null}
              </label>

              <label className="grid gap-2 text-sm text-steel md:col-span-2">
                مجال التقييم
                <select
                  value={reviewForm.category}
                  onChange={(event) => setFieldValue("category", event.target.value)}
                  className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                >
                  {ratingCategories.map((category) => (
                    <option key={category} value={category} className="bg-slatecore text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-white">اختر التقييم</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {Array.from({ length: 5 }).map((_, index) => {
                  const rating = index + 1;
                  const active = reviewForm.rating >= rating;

                  return (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFieldValue("rating", rating)}
                      className={cn(
                        "rounded-2xl border px-4 py-3 text-sm transition",
                        active
                          ? "border-cyanGlow/25 bg-cyanGlow/10 text-cyanGlow"
                          : "border-white/10 bg-midnight/40 text-steel hover:text-white",
                      )}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Star className={cn("size-4", active && "fill-current")} />
                        {rating}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors.rating ? <p className="mt-3 text-xs text-danger">{errors.rating}</p> : null}
            </div>

            <label className="grid gap-2 text-sm text-steel">
              تعليقك
              <textarea
                value={reviewForm.comment}
                onChange={(event) => setFieldValue("comment", event.target.value)}
                rows={7}
                className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                placeholder="ما الذي أعجبك؟ وما الذي يحتاج تطويرًا؟"
              />
              {errors.comment ? <span className="text-xs text-danger">{errors.comment}</span> : null}
            </label>

            <div className="rounded-[1.5rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5 text-sm leading-7 text-steel">
              التقييمات هنا لم تعد ثابتة داخل المتصفح فقط، بل تُحفظ ضمن هذه النسخة التجريبية ويُعاد عرضها لجميع
              الزوار على نفس البيئة.
            </div>

            {serverError ? (
              <div className="flex items-start gap-3 rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100">
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" />
                <p>{serverError}</p>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  جار إرسال التقييم...
                </>
              ) : (
                "إرسال التقييم"
              )}
            </button>

            {submitted ? (
              <div className="flex items-start gap-3 rounded-[1.35rem] border border-success/30 bg-success/10 px-4 py-3 text-sm text-emerald-100">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                <p>تم استلام تقييمك وإضافته مباشرة إلى تقييمات Cyvero البشرية الحالية.</p>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  );
}
