import { NextRequest, NextResponse } from "next/server";

import { specialists } from "@/data/specialists";
import { createPrototypeReference, isValidEmail, isValidPhone } from "@/lib/prototype";
import { readRuntimeCollection, runtimeFiles, writeRuntimeCollection } from "@/lib/runtime-store";
import { SpecialistConversation } from "@/types/cyber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sortConversations(conversations: SpecialistConversation[]) {
  return [...conversations].sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
}

export async function GET(request: NextRequest) {
  try {
    const conversations = await readRuntimeCollection<SpecialistConversation[]>(
      runtimeFiles.specialistConversations,
      [],
    );
    const specialistId = request.nextUrl.searchParams.get("specialistId");
    const conversationId = request.nextUrl.searchParams.get("conversationId");
    const reference = request.nextUrl.searchParams.get("reference");

    if (conversationId) {
      const conversation = conversations.find((item) => item.id === conversationId);

      if (!conversation) {
        return NextResponse.json({ error: "لم يتم العثور على المحادثة المطلوبة." }, { status: 404 });
      }

      return NextResponse.json({ conversation });
    }

    if (reference) {
      const normalizedReference = reference.trim().toUpperCase();
      const conversation = conversations.find((item) => item.reference.toUpperCase() === normalizedReference);

      if (!conversation) {
        return NextResponse.json({ error: "مرجع المحادثة غير موجود." }, { status: 404 });
      }

      return NextResponse.json({ conversation });
    }

    if (specialistId) {
      return NextResponse.json({
        conversations: sortConversations(
          conversations.filter((conversation) => conversation.specialistId === specialistId),
        ),
      });
    }

    return NextResponse.json({ conversations: sortConversations(conversations) });
  } catch {
    return NextResponse.json({ error: "تعذر تحميل محادثات المختصين حاليًا." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      specialistId?: string;
      issueTitle?: string;
      issueDetails?: string;
      urgency?: SpecialistConversation["urgency"];
      client?: SpecialistConversation["client"];
    };

    const specialist = specialists.find((item) => item.id === payload.specialistId);

    if (!specialist) {
      return NextResponse.json({ error: "المختص المطلوب غير متاح حاليًا." }, { status: 400 });
    }

    if (!payload.client || payload.client.name.trim().length < 4) {
      return NextResponse.json({ error: "يرجى إدخال الاسم الكامل بشكل واضح." }, { status: 400 });
    }

    if (!isValidEmail(payload.client.email)) {
      return NextResponse.json({ error: "يرجى إدخال بريد إلكتروني صالح." }, { status: 400 });
    }

    if (!isValidPhone(payload.client.phone)) {
      return NextResponse.json({ error: "يرجى إدخال رقم جوال صالح." }, { status: 400 });
    }

    if (!payload.client.organization || payload.client.organization.trim().length < 2) {
      return NextResponse.json({ error: "يرجى إدخال اسم الجهة أو المنشأة." }, { status: 400 });
    }

    if (!payload.client.role || payload.client.role.trim().length < 2) {
      return NextResponse.json({ error: "يرجى تحديد صفة مقدم الطلب." }, { status: 400 });
    }

    if (!payload.client.city || payload.client.city.trim().length < 2) {
      return NextResponse.json({ error: "يرجى إدخال المدينة." }, { status: 400 });
    }

    if (!payload.issueTitle || payload.issueTitle.trim().length < 4) {
      return NextResponse.json({ error: "يرجى كتابة عنوان مختصر للمشكلة." }, { status: 400 });
    }

    if (!payload.issueDetails || payload.issueDetails.trim().length < 20) {
      return NextResponse.json({ error: "يرجى شرح المشكلة بشكل أوضح." }, { status: 400 });
    }

    const now = new Date().toISOString();
    const conversations = await readRuntimeCollection<SpecialistConversation[]>(
      runtimeFiles.specialistConversations,
      [],
    );
    const conversation: SpecialistConversation = {
      id: crypto.randomUUID(),
      reference: createPrototypeReference("SPC"),
      specialistId: specialist.id,
      specialistName: specialist.name,
      status: "pending",
      urgency: payload.urgency ?? "routine",
      issueTitle: payload.issueTitle.trim(),
      issueDetails: payload.issueDetails.trim(),
      createdAt: now,
      updatedAt: now,
      verificationNote:
        "تم التحقق الأولي من الاسم والبريد ورقم الجوال وحقول تعريف الجهة قبل فتح الطلب التجريبي.",
      client: {
        name: payload.client.name.trim(),
        email: payload.client.email.trim(),
        phone: payload.client.phone.trim(),
        organization: payload.client.organization.trim(),
        role: payload.client.role.trim(),
        city: payload.client.city.trim(),
      },
      messages: [
        {
          id: crypto.randomUUID(),
          sender: "system",
          senderName: "Cyvero",
          body: "تم فتح قناة المراسلة مع المختص وإرسال الطلب إلى بوابته الداخلية بانتظار المراجعة.",
          sentAt: now,
        },
        {
          id: crypto.randomUUID(),
          sender: "client",
          senderName: payload.client.name.trim(),
          body: `${payload.issueTitle.trim()}\n\n${payload.issueDetails.trim()}`,
          sentAt: now,
        },
      ],
    };

    await writeRuntimeCollection(runtimeFiles.specialistConversations, [conversation, ...conversations]);

    return NextResponse.json({ conversation }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر إنشاء طلب المختص حاليًا." }, { status: 500 });
  }
}
