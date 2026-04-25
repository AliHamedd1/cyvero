import { NextRequest, NextResponse } from "next/server";

import { specialists } from "@/data/specialists";
import { readRuntimeCollection, runtimeFiles, writeRuntimeCollection } from "@/lib/runtime-store";
import { SpecialistConversation, SpecialistRating } from "@/types/cyber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sortRatings(ratings: SpecialistRating[]) {
  return [...ratings].sort((left, right) => Date.parse(right.submittedAt) - Date.parse(left.submittedAt));
}

export async function GET(request: NextRequest) {
  const specialistId = request.nextUrl.searchParams.get("specialistId");
  const ratings = await readRuntimeCollection<SpecialistRating[]>(runtimeFiles.specialistRatings, []);

  if (specialistId) {
    return NextResponse.json({
      ratings: sortRatings(ratings.filter((rating) => rating.specialistId === specialistId)),
    });
  }

  return NextResponse.json({ ratings: sortRatings(ratings) });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<SpecialistRating>;
  const specialist = specialists.find((item) => item.id === payload.specialistId);

  if (!specialist) {
    return NextResponse.json({ error: "المختص المطلوب غير متاح." }, { status: 400 });
  }

  if (!payload.clientName || payload.clientName.trim().length < 3) {
    return NextResponse.json({ error: "يرجى كتابة اسم صاحب التقييم." }, { status: 400 });
  }

  if (!payload.reference || payload.reference.trim().length < 6) {
    return NextResponse.json({ error: "يرجى إدخال مرجع المحادثة." }, { status: 400 });
  }

  if (!payload.serviceArea || payload.serviceArea.trim().length < 3) {
    return NextResponse.json({ error: "يرجى تحديد نوع الخدمة أو المشكلة." }, { status: 400 });
  }

  if (!payload.comment || payload.comment.trim().length < 15) {
    return NextResponse.json({ error: "يرجى كتابة تقييم أكثر تفصيلًا." }, { status: 400 });
  }

  if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
    return NextResponse.json({ error: "يرجى اختيار تقييم من 1 إلى 5." }, { status: 400 });
  }

  const conversations = await readRuntimeCollection<SpecialistConversation[]>(
    runtimeFiles.specialistConversations,
    [],
  );
  const matchingConversation = conversations.find(
    (item) =>
      item.reference.toUpperCase() === payload.reference?.trim().toUpperCase() &&
      item.specialistId === specialist.id,
  );

  if (!matchingConversation) {
    return NextResponse.json(
      { error: "لا يمكن تقييم المختص إلا باستخدام مرجع محادثة صحيح مرتبط به." },
      { status: 400 },
    );
  }

  const ratings = await readRuntimeCollection<SpecialistRating[]>(runtimeFiles.specialistRatings, []);
  const duplicateRating = ratings.find(
    (item) =>
      item.specialistId === specialist.id &&
      item.reference.toUpperCase() === payload.reference?.trim().toUpperCase(),
  );

  if (duplicateRating) {
    return NextResponse.json(
      { error: "تم إرسال تقييم لهذا المرجع مسبقًا، ولا يمكن تكراره في هذه النسخة." },
      { status: 409 },
    );
  }

  const rating: SpecialistRating = {
    id: crypto.randomUUID(),
    specialistId: specialist.id,
    specialistName: specialist.name,
    clientName: payload.clientName.trim(),
    reference: payload.reference.trim().toUpperCase(),
    serviceArea: payload.serviceArea.trim(),
    rating: payload.rating,
    comment: payload.comment.trim(),
    submittedAt: new Date().toISOString(),
  };

  const nextRatings = [rating, ...ratings];
  await writeRuntimeCollection(runtimeFiles.specialistRatings, nextRatings);

  return NextResponse.json({ rating }, { status: 201 });
}
