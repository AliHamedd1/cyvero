import { NextResponse } from "next/server";

import { readRuntimeCollection, runtimeFiles, writeRuntimeCollection } from "@/lib/runtime-store";
import {
  SpecialistCancellationReason,
  SpecialistConversation,
  SpecialistConversationStatus,
  SpecialistQuoteStatus,
} from "@/types/cyber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses: SpecialistConversationStatus[] = [
  "pending",
  "quoted",
  "active",
  "awaiting-client",
  "closed",
  "cancelled",
];

const allowedQuoteDecisions: SpecialistQuoteStatus[] = ["accepted", "rejected"];
const allowedCancellationReasons: SpecialistCancellationReason[] = [
  "السعر مرتفع",
  "غير مناسب",
  "تم الحل",
  "سبب آخر",
];

type Context = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function GET(_: Request, context: Context) {
  const { conversationId } = await context.params;
  const conversations = await readRuntimeCollection<SpecialistConversation[]>(
    runtimeFiles.specialistConversations,
    [],
  );
  const conversation = conversations.find((item) => item.id === conversationId);

  if (!conversation) {
    return NextResponse.json({ error: "المحادثة غير موجودة." }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}

export async function PATCH(request: Request, context: Context) {
  const { conversationId } = await context.params;
  const payload = (await request.json()) as {
    status?: SpecialistConversationStatus;
    quote?: {
      price?: number;
      durationDays?: number;
    };
    quoteDecision?: SpecialistQuoteStatus;
    cancellation?: {
      reason?: SpecialistCancellationReason;
      details?: string;
      cancelledBy?: "client" | "specialist";
    };
  };

  const conversations = await readRuntimeCollection<SpecialistConversation[]>(
    runtimeFiles.specialistConversations,
    [],
  );
  const conversationIndex = conversations.findIndex((item) => item.id === conversationId);

  if (conversationIndex === -1) {
    return NextResponse.json({ error: "المحادثة غير موجودة." }, { status: 404 });
  }

  const currentConversation = conversations[conversationIndex];
  const now = new Date().toISOString();
  let updatedConversation: SpecialistConversation = {
    ...currentConversation,
    updatedAt: now,
  };

  if (payload.quote) {
    const price = Number(payload.quote.price);
    const durationDays = Number(payload.quote.durationDays);

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "يرجى إدخال سعر صالح." }, { status: 400 });
    }

    if (!Number.isFinite(durationDays) || durationDays <= 0) {
      return NextResponse.json({ error: "يرجى إدخال مدة تنفيذ صالحة." }, { status: 400 });
    }

    updatedConversation = {
      ...updatedConversation,
      status: "quoted",
      quote: {
        price,
        durationDays,
        status: "pending-client",
        proposedAt: now,
      },
      messages: [
        ...updatedConversation.messages,
        {
          id: crypto.randomUUID(),
          sender: "system",
          senderName: "Cyvero",
          body: `أضاف المختص عرضًا سعريًا جديدًا بقيمة ${price} ريال ومدة تنفيذ ${durationDays} يوم.`,
          sentAt: now,
        },
      ],
    };
  }

  if (payload.quoteDecision) {
    if (!updatedConversation.quote) {
      return NextResponse.json({ error: "لا يوجد عرض سعري مرتبط بهذه المحادثة." }, { status: 400 });
    }

    if (!allowedQuoteDecisions.includes(payload.quoteDecision)) {
      return NextResponse.json({ error: "قرار التسعير غير صالح." }, { status: 400 });
    }

    const nextStatus = payload.quoteDecision === "accepted" ? "active" : "pending";
    const decisionMessage =
      payload.quoteDecision === "accepted"
        ? "وافق العميل على العرض السعري وتم تفعيل الطلب."
        : "رفض العميل العرض السعري الحالي بانتظار مراجعة المختص.";

    updatedConversation = {
      ...updatedConversation,
      status: nextStatus,
      quote: {
        ...updatedConversation.quote,
        status: payload.quoteDecision,
        respondedAt: now,
      },
      messages: [
        ...updatedConversation.messages,
        {
          id: crypto.randomUUID(),
          sender: "system",
          senderName: "Cyvero",
          body: decisionMessage,
          sentAt: now,
        },
      ],
    };
  }

  if (payload.cancellation) {
    if (!payload.cancellation.reason || !allowedCancellationReasons.includes(payload.cancellation.reason)) {
      return NextResponse.json({ error: "يرجى اختيار سبب إلغاء صالح." }, { status: 400 });
    }

    if (payload.cancellation.reason === "سبب آخر" && !payload.cancellation.details?.trim()) {
      return NextResponse.json({ error: "يرجى كتابة سبب الإلغاء الآخر." }, { status: 400 });
    }

    updatedConversation = {
      ...updatedConversation,
      status: "cancelled",
      cancellation: {
        reason: payload.cancellation.reason,
        details: payload.cancellation.details?.trim() || undefined,
        cancelledAt: now,
        cancelledBy: payload.cancellation.cancelledBy ?? "client",
      },
      messages: [
        ...updatedConversation.messages,
        {
          id: crypto.randomUUID(),
          sender: "system",
          senderName: "Cyvero",
          body: `تم إلغاء الطلب. السبب: ${payload.cancellation.reason}${
            payload.cancellation.details ? ` - ${payload.cancellation.details.trim()}` : ""
          }`,
          sentAt: now,
        },
      ],
    };
  }

  if (payload.status) {
    if (!allowedStatuses.includes(payload.status)) {
      return NextResponse.json({ error: "حالة المحادثة غير صالحة." }, { status: 400 });
    }

    updatedConversation = {
      ...updatedConversation,
      status: payload.status,
      closedAt: payload.status === "closed" ? now : updatedConversation.closedAt,
    };
  }

  conversations[conversationIndex] = updatedConversation;
  await writeRuntimeCollection(runtimeFiles.specialistConversations, conversations);

  return NextResponse.json({ conversation: updatedConversation });
}
