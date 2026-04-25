import { NextResponse } from "next/server";

import { specialistAccounts } from "@/data/specialist-accounts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const payload = (await request.json()) as {
    username?: string;
    password?: string;
  };

  const username = payload.username?.trim().toLowerCase() ?? "";
  const password = payload.password ?? "";

  const account = specialistAccounts.find(
    (item) => item.username.toLowerCase() === username && item.password === password,
  );

  if (!account) {
    return NextResponse.json(
      { error: "بيانات دخول المختص غير صحيحة. تحقق من اسم المستخدم وكلمة المرور." },
      { status: 401 },
    );
  }

  return NextResponse.json({
    session: {
      specialistId: account.specialistId,
      specialistName: account.specialistName,
      username: account.username,
      loggedInAt: new Date().toISOString(),
    },
  });
}
