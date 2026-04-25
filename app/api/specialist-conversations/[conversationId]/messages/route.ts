import { NextResponse } from "next/server";

import { readRuntimeCollection, runtimeFiles, writeRuntimeCollection } from "@/lib/runtime-store";
import { SpecialistConversation, SpecialistConversationMessage } from "@/types/cyber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function POST(request: Request, context: Context) {
  const { conversationId } = await context.params;
  const payload = (await request.json()) as {
    sender?: SpecialistConversationMessage["sender"];
    senderName?: string;
    body?: string;
  };

  if (!payload.body || payload.body.trim().length < 3) {
    return NextResponse.json({ error: "يرجى كتابة رسالة واضحة." }, { status: 400 });
  }

  if (!payload.sender || !["client", "specialist", "system"].includes(payload.sender)) {
    return NextResponse.json({ error: "نوع المرسل غير صالح." }, { status: 400 });
  }

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
  const message: SpecialistConversationMessage = {
    id: crypto.randomUUID(),
    sender: payload.sender,
    senderName:
      payload.senderName?.trim() ||
      (payload.sender === "client" ? currentConversation.client.name : currentConversation.specialistName),
    body: payload.body.trim(),
    sentAt: now,
  };

  const hasSpecialistReply = currentConversation.messages.some((item) => item.sender === "specialist");
  const nextStatus =
    payload.sender === "specialist"
      ? "active"
      : hasSpecialistReply
        ? "active"
        : "pending";

  const updatedConversation: SpecialistConversation = {
    ...currentConversation,
    status: nextStatus,
    updatedAt: now,
    messages: [...currentConversation.messages, message],
  };

  conversations[conversationIndex] = updatedConversation;
  await writeRuntimeCollection(runtimeFiles.specialistConversations, conversations);

  return NextResponse.json({ conversation: updatedConversation, message }, { status: 201 });
}
