import { NextResponse } from "next/server";

import { isValidEmail } from "@/lib/prototype";
import { readRuntimeCollection, runtimeFiles, writeRuntimeCollection } from "@/lib/runtime-store";
import { ContactSubmission } from "@/types/cyber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<ContactSubmission>;

    if (!payload.name || payload.name.trim().length < 3) {
      return NextResponse.json({ error: "يرجى إدخال الاسم بشكل واضح." }, { status: 400 });
    }

    if (!isValidEmail(payload.email ?? "")) {
      return NextResponse.json({ error: "يرجى إدخال بريد إلكتروني صالح." }, { status: 400 });
    }

    if (!payload.subject || payload.subject.trim().length < 3) {
      return NextResponse.json({ error: "يرجى كتابة موضوع الرسالة." }, { status: 400 });
    }

    if (!payload.message || payload.message.trim().length < 15) {
      return NextResponse.json({ error: "يرجى كتابة رسالة أكثر تفصيلًا." }, { status: 400 });
    }

    const submissions = await readRuntimeCollection<ContactSubmission[]>(runtimeFiles.contactSubmissions, []);
    const email = payload.email!.trim();
    const submission: ContactSubmission = {
      id: crypto.randomUUID(),
      name: payload.name.trim(),
      email,
      subject: payload.subject.trim(),
      message: payload.message.trim(),
      submittedAt: new Date().toISOString(),
    };

    await writeRuntimeCollection(runtimeFiles.contactSubmissions, [submission, ...submissions]);

    return NextResponse.json({ submission }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر معالجة طلب التواصل حاليًا." }, { status: 500 });
  }
}
