import { NextResponse } from "next/server";

import { createPrototypeReference, isValidEmail } from "@/lib/prototype";
import { readRuntimeCollection, runtimeFiles, writeRuntimeCollection } from "@/lib/runtime-store";
import { SubscriptionOrder } from "@/types/cyber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<SubscriptionOrder>;

    if (!payload.planId || !payload.planName || !payload.planPrice) {
      return NextResponse.json({ error: "يرجى اختيار باقة الاشتراك أولًا." }, { status: 400 });
    }

    if (!payload.fullName || payload.fullName.trim().length < 3) {
      return NextResponse.json({ error: "يرجى إدخال الاسم الكامل." }, { status: 400 });
    }

    if (!isValidEmail(payload.email ?? "")) {
      return NextResponse.json({ error: "يرجى إدخال بريد إلكتروني صالح." }, { status: 400 });
    }

    const orders = await readRuntimeCollection<SubscriptionOrder[]>(runtimeFiles.subscriptionOrders, []);
    const email = payload.email!.trim();
    const order: SubscriptionOrder = {
      id: crypto.randomUUID(),
      reference: createPrototypeReference("SUB"),
      planId: payload.planId,
      planName: payload.planName,
      planPrice: payload.planPrice,
      fullName: payload.fullName.trim(),
      email,
      submittedAt: new Date().toISOString(),
    };

    await writeRuntimeCollection(runtimeFiles.subscriptionOrders, [order, ...orders]);

    return NextResponse.json({ order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر إنشاء الاشتراك حاليًا." }, { status: 500 });
  }
}
