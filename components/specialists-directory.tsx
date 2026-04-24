"use client";

import {
  BadgeCheck,
  CheckCircle2,
  Mail,
  MessageSquareText,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { specialists } from "@/data/specialists";
import { createPrototypeReference, getInitials, isValidEmail } from "@/lib/prototype";
import { normalizeArabicText } from "@/lib/utils";

const specialtyOptions = [
  { value: "all", label: "كل التخصصات" },
  ...Array.from(new Set(specialists.map((specialist) => specialist.primarySpecialty))).map((specialty) => ({
    value: specialty,
    label: specialty,
  })),
  { value: "unclassified", label: "الحالات غير المصنفة" },
];

const emptyRequestForm = {
  clientName: "",
  email: "",
  phone: "",
  issueTitle: "",
  issueDetails: "",
};

type SpecialistRequestForm = typeof emptyRequestForm;
type SpecialistRequestErrors = Partial<Record<keyof SpecialistRequestForm, string>>;

function isValidPhone(value: string) {
  return /^\+?[0-9\s-]{8,16}$/.test(value.trim());
}

export function SpecialistsDirectory() {
  const requestSectionRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(specialists[0]?.id ?? null);
  const [requestForm, setRequestForm] = useState<SpecialistRequestForm>(emptyRequestForm);
  const [requestErrors, setRequestErrors] = useState<SpecialistRequestErrors>({});
  const [submittedRequest, setSubmittedRequest] = useState<null | {
    reference: string;
    specialistName: string;
    clientName: string;
    issueTitle: string;
    issueDetails: string;
  }>(null);

  const selectedSpecialist = specialists.find((specialist) => specialist.id === selectedId) ?? null;
  const unclassifiedSpecialists = specialists.filter((specialist) => specialist.supportsUnclassified);
  const normalizedSearch = normalizeArabicText(search);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    requestSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    const timeoutId = window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [selectedId]);

  function setRequestField(field: keyof SpecialistRequestForm, value: string) {
    setRequestForm((current) => ({ ...current, [field]: value }));
    setRequestErrors((current) => ({ ...current, [field]: undefined }));
  }

  function selectSpecialist(specialistId: string) {
    setSelectedId(specialistId);
    setRequestErrors({});
    setSubmittedRequest(null);
    setRequestForm(emptyRequestForm);
  }

  function validateRequestForm() {
    const nextErrors: SpecialistRequestErrors = {};

    if (requestForm.clientName.trim().length < 4) {
      nextErrors.clientName = "يرجى إدخال الاسم بشكل واضح.";
    }

    if (!isValidEmail(requestForm.email.trim())) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صالح.";
    }

    if (!isValidPhone(requestForm.phone)) {
      nextErrors.phone = "يرجى إدخال رقم جوال صالح.";
    }

    if (requestForm.issueTitle.trim().length < 4) {
      nextErrors.issueTitle = "يرجى كتابة عنوان مختصر للمشكلة.";
    }

    if (requestForm.issueDetails.trim().length < 15) {
      nextErrors.issueDetails = "يرجى شرح المشكلة بتفصيل أكبر قليلًا.";
    }

    return nextErrors;
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSpecialist) {
      return;
    }

    const nextErrors = validateRequestForm();

    if (Object.keys(nextErrors).length > 0) {
      setRequestErrors(nextErrors);
      setSubmittedRequest(null);
      return;
    }

    setRequestErrors({});
    setSubmittedRequest({
      reference: createPrototypeReference("SPC"),
      specialistName: selectedSpecialist.name,
      clientName: requestForm.clientName.trim(),
      issueTitle: requestForm.issueTitle.trim(),
      issueDetails: requestForm.issueDetails.trim(),
    });
    setRequestForm(emptyRequestForm);
  }

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
      {selectedSpecialist ? (
        <section ref={requestSectionRef} className="panel cyber-card overflow-hidden p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
                <BadgeCheck className="size-4" />
                تم اختيار المختص
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-20 items-center justify-center rounded-[1.5rem] border border-cyanGlow/20 bg-gradient-to-br from-cyanGlow/20 via-cyanGlow/10 to-white/5 font-heading text-2xl text-white">
                  {getInitials(selectedSpecialist.name)}
                </div>
                <div>
                  <h3 className="font-heading text-3xl text-white">{selectedSpecialist.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-cyanGlow">{selectedSpecialist.primarySpecialty}</p>
                  <p className="mt-1 text-sm text-steel">{selectedSpecialist.experienceLevel}</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
                سيتم توجيه بيانات العميل والمشكلة مباشرة إلى هذا المختص داخل النسخة التجريبية الحالية
                على شكل رسالة واجهية فقط، بدون Backend حقيقي.
              </div>

              <div className="rounded-[1.5rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5 text-sm leading-7 text-steel">
                بعد الضغط على زر طلب المختص يتم فتح هذا النموذج تلقائيًا في أعلى الصفحة حتى يكمل
                العميل بياناته ويرسل المشكلة مباشرة إلى المختص المختار.
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs tracking-[0.14em] text-steel">المشكلات التي يتعامل معها المختص</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedSpecialist.handles.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-cyanGlow/15 bg-midnight/60 px-3 py-1 text-xs text-cyanGlow"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-7 text-steel">{selectedSpecialist.availability}</p>
              </div>

              {submittedRequest ? (
                <div className="rounded-[1.6rem] border border-success/30 bg-success/10 p-5" aria-live="polite">
                  <div className="flex items-center gap-3 text-success">
                    <CheckCircle2 className="size-5" />
                    <span className="text-sm font-semibold">تم إرسال الرسالة إلى المختص بنجاح</span>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-100">
                    وصل طلب <span className="font-semibold text-white">{submittedRequest.clientName}</span> إلى
                    المختص <span className="font-semibold text-white">{submittedRequest.specialistName}</span>.
                  </p>
                  <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-midnight/55 p-4">
                    <p className="text-xs tracking-[0.16em] text-steel">مرجع الطلب</p>
                    <p className="mt-2 font-heading text-3xl text-white">{submittedRequest.reference}</p>
                    <p className="mt-4 text-xs tracking-[0.16em] text-steel">الرسالة المرسلة إلى المختص</p>
                    <p className="mt-2 text-sm font-semibold text-white">{submittedRequest.issueTitle}</p>
                    <p className="mt-2 text-sm leading-7 text-steel">{submittedRequest.issueDetails}</p>
                  </div>
                </div>
              ) : null}
            </div>

            <form onSubmit={submitRequest} className="space-y-5">
              <div className="space-y-3">
                <h3 className="font-heading text-3xl text-white">اطلب هذا المختص الآن</h3>
                <p className="leading-8 text-steel">
                  أدخل معلوماتك ووصف المشكلة، وسيتم إنشاء رسالة تجريبية تُرسل إلى المختص المختار داخل
                  الواجهة.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-steel">
                  الاسم
                  <input
                    ref={firstFieldRef}
                    value={requestForm.clientName}
                    onChange={(event) => setRequestField("clientName", event.target.value)}
                    className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                    placeholder="الاسم الكامل"
                  />
                  {requestErrors.clientName ? (
                    <span className="text-xs text-danger">{requestErrors.clientName}</span>
                  ) : null}
                </label>

                <label className="grid gap-2 text-sm text-steel">
                  البريد الإلكتروني
                  <div className="relative">
                    <Mail className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                    <input
                      type="email"
                      value={requestForm.email}
                      onChange={(event) => setRequestField("email", event.target.value)}
                      className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-3.5 pl-4 pr-11 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                      placeholder="name@example.com"
                      dir="ltr"
                    />
                  </div>
                  {requestErrors.email ? <span className="text-xs text-danger">{requestErrors.email}</span> : null}
                </label>

                <label className="grid gap-2 text-sm text-steel md:col-span-2">
                  رقم الجوال
                  <div className="relative">
                    <Phone className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                    <input
                      value={requestForm.phone}
                      onChange={(event) => setRequestField("phone", event.target.value)}
                      className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-3.5 pl-4 pr-11 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                      placeholder="+9665XXXXXXXX"
                      dir="ltr"
                    />
                  </div>
                  {requestErrors.phone ? <span className="text-xs text-danger">{requestErrors.phone}</span> : null}
                </label>

                <label className="grid gap-2 text-sm text-steel md:col-span-2">
                  عنوان المشكلة
                  <div className="relative">
                    <MessageSquareText className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                    <input
                      value={requestForm.issueTitle}
                      onChange={(event) => setRequestField("issueTitle", event.target.value)}
                      className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-3.5 pl-4 pr-11 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                      placeholder="مثال: اشتباه باختراق بريد العمل"
                    />
                  </div>
                  {requestErrors.issueTitle ? (
                    <span className="text-xs text-danger">{requestErrors.issueTitle}</span>
                  ) : null}
                </label>
              </div>

              <label className="grid gap-2 text-sm text-steel">
                وصف المشكلة
                <textarea
                  value={requestForm.issueDetails}
                  onChange={(event) => setRequestField("issueDetails", event.target.value)}
                  rows={7}
                  className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                  placeholder="اشرح للمختص ما الذي حدث، متى بدأ، وما هي المؤشرات أو الأعراض التي لاحظتها."
                />
                {requestErrors.issueDetails ? (
                  <span className="text-xs text-danger">{requestErrors.issueDetails}</span>
                ) : null}
              </label>

              <div className="rounded-[1.5rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5 text-sm leading-7 text-steel">
                هذا التدفق تجريبي داخل Frontend فقط. بعد الإرسال ستظهر رسالة تؤكد أن الطلب وصل إلى
                المختص المختار داخل الواجهة، بدون إرسال حقيقي إلى خادم في هذه المرحلة.
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
              >
                إرسال الطلب إلى المختص
                <Sparkles className="size-4" />
              </button>
            </form>
          </div>
        </section>
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
                    onClick={() => selectSpecialist(specialist.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
                  >
                    اطلب المختص
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
