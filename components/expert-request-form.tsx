"use client";

import { useState } from "react";
import { CheckCircle2, UploadCloud } from "lucide-react";

export function ExpertRequestForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="panel flex min-h-[420px] flex-col items-center justify-center gap-4 p-8 text-center">
        <CheckCircle2 className="size-16 text-cyanGlow" />
        <h2 className="font-heading text-3xl text-white">تم إرسال الطلب بنجاح</h2>
        <p className="max-w-2xl leading-8 text-steel">
          استلمت Cyvero بياناتك بصيغة أولية. الواجهة الحالية تجريبية، لكن تصميمها جاهز لربط نظام
          تذاكر، إدارة حالات، ومختصين مع صلاحيات قانونية واضحة لاحقًا.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
      className="panel grid gap-5 p-6 md:grid-cols-2 md:p-8"
    >
      <label className="grid gap-2 text-sm text-steel">
        الاسم
        <input name="name" required className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
      </label>
      <label className="grid gap-2 text-sm text-steel">
        البريد الإلكتروني
        <input
          name="email"
          type="email"
          required
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none"
        />
      </label>
      <label className="grid gap-2 text-sm text-steel">
        نوع المشكلة
        <select name="issueType" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
          <option className="bg-slatecore">اختراق حسابات</option>
          <option className="bg-slatecore">اشتباه بفدية أو برمجية خبيثة</option>
          <option className="bg-slatecore">تصيد أو انتحال</option>
          <option className="bg-slatecore">تسريب بيانات</option>
          <option className="bg-slatecore">مراجعة أو استشارة عامة</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm text-steel">
        المنصة أو النظام المتأثر
        <input name="platform" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
      </label>
      <label className="grid gap-2 text-sm text-steel">
        درجة الاستعجال
        <select name="urgency" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none">
          <option className="bg-slatecore">منخفضة</option>
          <option className="bg-slatecore">متوسطة</option>
          <option className="bg-slatecore">مرتفعة</option>
          <option className="bg-slatecore">حرجة</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm text-steel md:col-span-2">
        وصف الحالة
        <textarea
          name="description"
          required
          rows={7}
          className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none"
        />
      </label>
      <div className="md:col-span-2">
        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-3xl border border-dashed border-cyanGlow/20 bg-cyanGlow/5 px-5 py-8 text-center text-sm text-steel transition hover:border-cyanGlow/35 hover:text-white">
          <UploadCloud className="size-5 text-cyanGlow" />
          رفع ملفات أو صور بشكل شكلي
          <input type="file" name="attachments" className="hidden" aria-label="رفع ملفات أو صور" />
        </label>
      </div>
      <label className="md:col-span-2 flex gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-steel">
        <input type="checkbox" required className="mt-1 size-4 accent-cyanGlow" />
        أقر بأن الطلب قانوني، وأنني صاحب الحساب أو الجهاز أو أملك صلاحية قانونية واضحة لطلب
        المساعدة بشأنه.
      </label>
      <button
        type="submit"
        className="md:col-span-2 rounded-2xl bg-cyanGlow px-6 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
      >
        إرسال الطلب
      </button>
    </form>
  );
}
