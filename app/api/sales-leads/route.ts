import { NextResponse } from "next/server";

import { createPrototypeReference, isValidEmail, isValidPhone } from "@/lib/prototype";
import { readRuntimeCollection, runtimeFiles, writeRuntimeCollection } from "@/lib/runtime-store";
import { BusinessQuoteSummary, SalesLead } from "@/types/cyber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidQuoteSummary(value: Partial<BusinessQuoteSummary> | undefined) {
  if (!value) {
    return false;
  }

  return (
    typeof value.companyType === "string" &&
    Number.isFinite(value.computerCount) &&
    Number.isFinite(value.serverCount) &&
    Number.isFinite(value.estimatedPrice)
  );
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Partial<SalesLead>;

    if (!payload.fullName || payload.fullName.trim().length < 4) {
      return NextResponse.json({ error: "يرجى إدخال الاسم الكامل." }, { status: 400 });
    }

    if (!isValidEmail(payload.email ?? "")) {
      return NextResponse.json({ error: "يرجى إدخال بريد إلكتروني صالح." }, { status: 400 });
    }

    if (!payload.companyName || payload.companyName.trim().length < 2) {
      return NextResponse.json({ error: "يرجى إدخال اسم الشركة." }, { status: 400 });
    }

    if (!isValidPhone(payload.phone ?? "")) {
      return NextResponse.json({ error: "يرجى إدخال رقم جوال صالح." }, { status: 400 });
    }

    if (!isValidQuoteSummary(payload.quoteSummary)) {
      return NextResponse.json({ error: "بيانات التسعير المنقولة غير مكتملة." }, { status: 400 });
    }

    const leads = await readRuntimeCollection<SalesLead[]>(runtimeFiles.salesLeads, []);
    const email = payload.email!.trim();
    const phone = payload.phone!.trim();
    const lead: SalesLead = {
      id: crypto.randomUUID(),
      reference: createPrototypeReference("SAL"),
      fullName: payload.fullName.trim(),
      email,
      companyName: payload.companyName.trim(),
      phone,
      notes: payload.notes?.trim() ?? "",
      submittedAt: new Date().toISOString(),
      quoteSummary: payload.quoteSummary as BusinessQuoteSummary,
    };

    await writeRuntimeCollection(runtimeFiles.salesLeads, [lead, ...leads]);

    return NextResponse.json({ lead }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر إرسال الطلب إلى فريق المبيعات حاليًا." }, { status: 500 });
  }
}
