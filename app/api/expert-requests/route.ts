import { NextResponse } from "next/server";

import { createPrototypeReference, isValidEmail } from "@/lib/prototype";
import { readRuntimeCollection, runtimeFiles, writeRuntimeCollection } from "@/lib/runtime-store";
import { ExpertRequestSubmission } from "@/types/cyber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<ExpertRequestSubmission>;

  if (!payload.name || payload.name.trim().length < 3) {
    return NextResponse.json({ error: "يرجى إدخال الاسم بشكل واضح." }, { status: 400 });
  }

  if (!isValidEmail(payload.email ?? "")) {
    return NextResponse.json({ error: "يرجى إدخال بريد إلكتروني صالح." }, { status: 400 });
  }

  if (!payload.issueType || payload.issueType.trim().length < 3) {
    return NextResponse.json({ error: "يرجى تحديد نوع المشكلة." }, { status: 400 });
  }

  if (!payload.platform || payload.platform.trim().length < 2) {
    return NextResponse.json({ error: "يرجى تحديد المنصة أو النظام المتأثر." }, { status: 400 });
  }

  if (!payload.urgency || payload.urgency.trim().length < 2) {
    return NextResponse.json({ error: "يرجى تحديد درجة الاستعجال." }, { status: 400 });
  }

  if (!payload.description || payload.description.trim().length < 20) {
    return NextResponse.json({ error: "يرجى كتابة وصف أوضح للحالة." }, { status: 400 });
  }

  if (!payload.consent) {
    return NextResponse.json({ error: "يجب الموافقة على الإقرار القانوني قبل الإرسال." }, { status: 400 });
  }

  const requests = await readRuntimeCollection<ExpertRequestSubmission[]>(
    runtimeFiles.expertRequests,
    [],
  );
  const submission: ExpertRequestSubmission = {
    id: crypto.randomUUID(),
    reference: createPrototypeReference("EXP"),
    name: payload.name.trim(),
    email: payload.email!.trim(),
    issueType: payload.issueType.trim(),
    platform: payload.platform.trim(),
    urgency: payload.urgency.trim(),
    description: payload.description.trim(),
    attachmentsName: payload.attachmentsName?.trim() || undefined,
    consent: true,
    submittedAt: new Date().toISOString(),
  };

  await writeRuntimeCollection(runtimeFiles.expertRequests, [submission, ...requests]);

  return NextResponse.json({ submission }, { status: 201 });
}
