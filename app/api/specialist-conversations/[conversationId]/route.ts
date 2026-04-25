import { NextResponse } from "next/server";

import { readRuntimeCollection, runtimeFiles, writeRuntimeCollection } from "@/lib/runtime-store";
import { SpecialistConversation, SpecialistConversationStatus } from "@/types/cyber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses: SpecialistConversationStatus[] = ["pending", "active", "awaiting-client", "closed"];

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
  };

  if (!payload.status || !allowedStatuses.includes(payload.status)) {
    return NextResponse.json({ error: "حالة المحادثة غير صالحة." }, { status: 400 });
  }

  const conversations = await readRuntimeCollection<SpecialistConversation[]>(
    runtimeFiles.specialistConversations,
    [],
  );
  const conversationIndex = conversations.findIndex((item) => item.id === conversationId);

  if (conversationIndex === -1) {
    return NextResponse.json({ error: "المحادثة غير موجودة." }, { status: 404 });
  }

  const updatedConversation: SpecialistConversation = {
    ...conversations[conversationIndex],
    status: payload.status,
    updatedAt: new Date().toISOString(),
  };

  conversations[conversationIndex] = updatedConversation;
  await writeRuntimeCollection(runtimeFiles.specialistConversations, conversations);

  return NextResponse.json({ conversation: updatedConversation });
}
