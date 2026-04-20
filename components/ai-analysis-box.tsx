"use client";

import Link from "next/link";
import { startTransition, useState, useTransition } from "react";
import { ArrowUpLeft, Sparkles, TriangleAlert } from "lucide-react";

import { analyzeThreatCase } from "@/lib/analysis";
import { severityMap } from "@/lib/utils";

const samples = [
  "دخلت رابط مشبوه ووصلتني صفحة تسجيل دخول تشبه الخدمة الأصلية",
  "حسابي صار فيه نشاط غريب وظهرت جلسات من أجهزة لا أعرفها",
  "جهازي أصبح بطيئًا وظهرت ملفات بامتدادات غير مألوفة",
  "وصلتني رسالة ابتزاز تدعي امتلاك بيانات خاصة بي",
];

export function AIAnalysisBox() {
  const [input, setInput] = useState(samples[0]);
  const [result, setResult] = useState(() => analyzeThreatCase(samples[0]));
  const [isPending, startAnalysis] = useTransition();

  function onAnalyze() {
    startAnalysis(() => {
      setResult(analyzeThreatCase(input));
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="panel p-6 md:p-8">
        <div className="flex items-center gap-3 text-cyanGlow">
          <Sparkles className="size-5" />
          <span className="text-sm font-semibold">حلّل حالتي</span>
        </div>
        <h2 className="mt-4 font-heading text-3xl text-white">تحليل أولي دفاعي وآمن</h2>
        <p className="mt-3 leading-8 text-steel">
          اكتب الحالة بصياغة طبيعية، وسيعرض Cyvero تقييمًا شكليًا مبدئيًا يركز على الاحتواء الآمن
          والتوصيات العامة فقط. هذه النسخة تعمل بمنطق محلي بسيط وجاهزة للربط لاحقًا مع الذكاء
          الاصطناعي.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {samples.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => startTransition(() => setInput(sample))}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-steel transition hover:border-cyanGlow/20 hover:text-white"
            >
              {sample}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={8}
          className="mt-6 w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-8 text-white outline-none placeholder:text-steel"
          placeholder="اكتب الحالة هنا..."
        />

        <button
          type="button"
          onClick={onAnalyze}
          className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-cyanGlow px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-white"
          aria-busy={isPending}
        >
          {isPending ? "جارٍ التحليل..." : "ابدأ التحليل"}
          <Sparkles className="size-4" />
        </button>
      </div>

      <div className="panel flex flex-col gap-5 p-6 md:p-8" aria-live="polite">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${severityMap[result.severity].className}`}
          >
            {severityMap[result.severity].label}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-steel">
            {result.threatType}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-steel">
            {result.needsExpert ? "يُنصح بمختص" : "يكفي التحقق الأولي"}
          </span>
        </div>

        <div>
          <h3 className="font-heading text-2xl text-white">{result.title}</h3>
          <p className="mt-3 leading-8 text-steel">{result.summary}</p>
        </div>

        <div className="rounded-3xl border border-cyanGlow/15 bg-cyanGlow/5 p-5">
          <div className="flex items-center gap-2 text-cyanGlow">
            <TriangleAlert className="size-4" />
            <span className="text-sm font-semibold">الخطوات الدفاعية الأولية</span>
          </div>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-100">
            {result.firstSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <h4 className="text-sm font-semibold text-white">توصيات عامة</h4>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-steel">
            {result.recommendations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
          <Link
            href="/request-expert"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
          >
            اطلب مساعدة من مختص
            <ArrowUpLeft className="size-4" />
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
          >
            تصفح التهديدات
            <ArrowUpLeft className="size-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
