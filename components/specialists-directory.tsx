"use client";

import Link from "next/link";
import { BadgeCheck, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import { specialists } from "@/data/specialists";
import { getInitials } from "@/lib/prototype";
import { normalizeArabicText } from "@/lib/utils";

const specialtyOptions = [
  { value: "all", label: "كل التخصصات" },
  ...Array.from(new Set(specialists.map((specialist) => specialist.primarySpecialty))).map((specialty) => ({
    value: specialty,
    label: specialty,
  })),
  { value: "unclassified", label: "الحالات غير المصنفة" },
];

export function SpecialistsDirectory() {
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(specialists[0]?.id ?? null);

  const selectedSpecialist = specialists.find((specialist) => specialist.id === selectedId) ?? null;
  const unclassifiedSpecialists = specialists.filter((specialist) => specialist.supportsUnclassified);
  const normalizedSearch = normalizeArabicText(search);

  const filteredSpecialists = specialists.filter((specialist) => {
    const matchesSpecialty =
      specialtyFilter === "all" ||
      specialist.primarySpecialty === specialtyFilter ||
      (specialtyFilter === "unclassified" && specialist.supportsUnclassified);

    if (!matchesSpecialty) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const searchableText = normalizeArabicText(
      [
        specialist.name,
        specialist.primarySpecialty,
        specialist.description,
        specialist.subSpecialties.join(" "),
        specialist.handles.join(" "),
      ].join(" "),
    );

    return searchableText.includes(normalizedSearch);
  });

  return (
    <div className="space-y-8">
      <section className="panel cyber-card overflow-hidden p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
              <ShieldCheck className="size-4" />
              بوابة المختصين
            </div>
            <h3 className="font-heading text-3xl text-white">تسجيل دخول المختصين</h3>
            <p className="max-w-3xl leading-8 text-steel">
              يتم الدخول إلى لوحة الإدارة الخاصة بعرض الطلبات والبلاغات عبر بوابة الأدمن في هذه النسخة
              التجريبية، ولا يوجد مسار دخول مستقل للمختصين حاليًا.
            </p>
          </div>

          <Link
            href="/admin-login"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
          >
            دخول لوحة الأدمن
            <Sparkles className="size-4" />
          </Link>
        </div>
      </section>

      {selectedSpecialist ? (
        <div className="panel cyber-card overflow-hidden p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
                <BadgeCheck className="size-4" />
                تم اختيار المختص
              </div>
              <h3 className="mt-4 font-heading text-3xl text-white">{selectedSpecialist.name}</h3>
              <p className="mt-2 text-steel">
                {selectedSpecialist.primarySpecialty} · {selectedSpecialist.experienceLevel}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-sm leading-7 text-steel">
              تم تسجيل اختيارك بشكل أولي داخل الواجهة. يمكنك متابعة استعراض التفاصيل أو استخدام صفحة
              طلب المختص لاحقًا عند توسيع التدفق.
            </div>
          </div>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        {unclassifiedSpecialists.map((specialist) => (
          <article key={specialist.id} className="panel-soft cyber-card p-5">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-[1.2rem] border border-cyanGlow/20 bg-cyanGlow/10 font-heading text-lg text-white">
                {getInitials(specialist.name)}
              </div>
              <div>
                <p className="text-sm text-cyanGlow">للحالات غير المصنفة</p>
                <h3 className="font-heading text-2xl text-white">{specialist.name}</h3>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-steel">{specialist.description}</p>
          </article>
        ))}
      </section>

      <section className="panel cyber-card overflow-hidden p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <label className="grid gap-2 text-sm text-steel">
            البحث باسم المختص أو نوع التخصص
            <div className="relative">
              <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث عن مختص أو مشكلة أو تخصص"
                className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-3.5 pl-4 pr-11 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
              />
            </div>
          </label>

          <label className="grid gap-2 text-sm text-steel">
            فلترة حسب التخصص
            <select
              value={specialtyFilter}
              onChange={(event) => setSpecialtyFilter(event.target.value)}
              className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
            >
              {specialtyOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-slatecore text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 rounded-[1.35rem] border border-cyanGlow/15 bg-cyanGlow/10 px-4 py-3 text-sm text-steel">
          يتم عرض <span className="text-white">{filteredSpecialists.length}</span> مختصًا من أصل
          <span className="text-white"> {specialists.length} </span>
          ضمن دليل Cyvero.
        </div>
      </section>

      {filteredSpecialists.length === 0 ? (
        <div className="panel flex min-h-[260px] items-center justify-center p-8 text-center">
          <div className="space-y-3">
            <p className="font-heading text-2xl text-white">لا يوجد مختص مطابق حاليًا</p>
            <p className="text-steel">جرّب توسيع البحث أو اختيار كل التخصصات لإظهار المزيد من النتائج.</p>
          </div>
        </div>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {filteredSpecialists.map((specialist) => {
            const isExpanded = expandedId === specialist.id;

            return (
              <article key={specialist.id} className="panel cyber-card overflow-hidden p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-[1.35rem] border border-cyanGlow/20 bg-gradient-to-br from-cyanGlow/20 via-cyanGlow/10 to-white/5 font-heading text-xl text-white">
                      {getInitials(specialist.name)}
                    </div>
                    <div>
                      <h3 className="font-heading text-3xl text-white">{specialist.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-cyanGlow">{specialist.primarySpecialty}</p>
                      <p className="mt-1 text-sm text-steel">{specialist.experienceLevel}</p>
                    </div>
                  </div>
                  {specialist.supportsUnclassified ? (
                    <span className="rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-3 py-1 text-xs text-cyanGlow">
                      للحالات العامة
                    </span>
                  ) : null}
                </div>

                <p className="mt-5 text-sm leading-8 text-steel">{specialist.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {specialist.subSpecialties.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs tracking-[0.14em] text-steel">نوع المشكلات التي يتعامل معها</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {specialist.handles.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-cyanGlow/15 bg-midnight/60 px-3 py-1 text-xs text-cyanGlow"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {isExpanded ? (
                  <div className="mt-5 rounded-[1.4rem] border border-cyanGlow/15 bg-cyanGlow/10 p-4 text-sm leading-7 text-steel">
                    <div className="flex items-center gap-2 text-cyanGlow">
                      <ShieldCheck className="size-4" />
                      <span className="font-semibold">تفاصيل إضافية</span>
                    </div>
                    <p className="mt-3">{specialist.availability}</p>
                    <p className="mt-2">
                      {specialist.supportsUnclassified
                        ? "هذا المختص مناسب أيضًا عندما لا يجد العميل تصنيفًا دقيقًا للمشكلة."
                        : "هذا المختص مناسب للحالات التي تحتاج خبرة مباشرة في هذا المجال دون فرز عام أولي."}
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setSelectedId(specialist.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
                  >
                    اختيار المختص
                    <Sparkles className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : specialist.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
                  >
                    {isExpanded ? "إخفاء التفاصيل" : "عرض التفاصيل"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
