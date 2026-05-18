import { NextResponse } from "next/server";

import { readRuntimeCollection, runtimeFiles, writeRuntimeCollection } from "@/lib/runtime-store";
import { RatingReview } from "@/types/cyber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sortReviews(reviews: RatingReview[]) {
  return [...reviews].sort((left, right) => Date.parse(right.submittedAt) - Date.parse(left.submittedAt));
}

export async function GET() {
  try {
    const reviews = await readRuntimeCollection<RatingReview[]>(runtimeFiles.communityReviews, []);
    return NextResponse.json({ reviews: sortReviews(reviews) });
  } catch {
    return NextResponse.json({ error: "تعذر تحميل التقييمات المجتمعية حاليًا." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<RatingReview>;

    if (!payload.name || payload.name.trim().length < 3) {
      return NextResponse.json({ error: "يرجى كتابة الاسم بشكل واضح." }, { status: 400 });
    }

    if (!payload.role || payload.role.trim().length < 3) {
      return NextResponse.json({ error: "يرجى كتابة الصفة أو الجهة." }, { status: 400 });
    }

    if (!payload.category || payload.category.trim().length < 2) {
      return NextResponse.json({ error: "يرجى تحديد مجال التقييم." }, { status: 400 });
    }

    if (!payload.comment || payload.comment.trim().length < 20) {
      return NextResponse.json({ error: "يرجى كتابة تعليق أكثر تفصيلًا." }, { status: 400 });
    }

    if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
      return NextResponse.json({ error: "يرجى اختيار تقييم من 1 إلى 5." }, { status: 400 });
    }

    const reviews = await readRuntimeCollection<RatingReview[]>(runtimeFiles.communityReviews, []);
    const review: RatingReview = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      role: payload.role.trim(),
      category: payload.category.trim(),
      rating: payload.rating,
      comment: payload.comment.trim(),
      submittedAt: new Date().toISOString(),
    };

    await writeRuntimeCollection(runtimeFiles.communityReviews, [review, ...reviews]);

    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر إرسال التقييم المجتمعي حاليًا." }, { status: 500 });
  }
}
