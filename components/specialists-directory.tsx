"use client";

import {
  ArrowUpLeft,
  BadgeCheck,
  Building2,
  Clock3,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { specialists } from "@/data/specialists";
import {
  CLIENT_SPECIALIST_CONVERSATIONS_KEY,
  formatArabicDate,
  formatArabicDateTime,
  isValidEmail,
  isValidPhone,
} from "@/lib/prototype";
import { cn, normalizeArabicText } from "@/lib/utils";
import {
  SpecialistCancellationReason,
  SpecialistConversation,
  SpecialistConversationStatus,
  SpecialistConversationUrgency,
  SpecialistProfile,
  SpecialistRating,
} from "@/types/cyber";

const specialtyOptions = [
  { value: "all", label: "كل التخصصات" },
  ...Array.from(new Set(specialists.map((specialist) => specialist.primarySpecialty))).map((specialty) => ({
    value: specialty,
    label: specialty,
  })),
];

const urgencyOptions: Array<{
  value: SpecialistConversationUrgency;
  label: string;
  description: string;
}> = [
  { value: "routine", label: "اعتيادي", description: "مناسب للحالات العامة أو الاستشارية." },
  { value: "priority", label: "عالي", description: "الحالة تؤثر على الاستخدام وتحتاج متابعة أسرع." },
  { value: "critical", label: "حرج", description: "هناك أثر واضح أو خطر مرتفع ويتطلب انتباهًا فوريًا." },
];

const cancellationReasons: SpecialistCancellationReason[] = [
  "السعر مرتفع",
  "غير مناسب",
  "تم الحل",
  "سبب آخر",
];

const conversationStatusMap: Record<
  SpecialistConversationStatus,
  {
    label: string;
    className: string;
  }
> = {
  pending: {
    label: "بانتظار المختص",
    className: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  },
  quoted: {
    label: "بانتظار قرار العميل",
    className: "border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow",
  },
  active: {
    label: "نشط",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
  "awaiting-client": {
    label: "بانتظار العميل",
    className: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  },
  closed: {
    label: "مكتمل",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  },
  cancelled: {
    label: "ملغي",
    className: "border-danger/30 bg-danger/10 text-rose-100",
  },
};

const emptyRequestForm = {
  clientName: "",
  email: "",
  phone: "",
  organization: "",
  role: "",
  city: "",
  issueTitle: "",
  issueDetails: "",
  urgency: "routine" as SpecialistConversationUrgency,
};

const emptyRatingForm = {
  serviceArea: "",
  rating: 5,
  comment: "",
};

type SpecialistRequestForm = typeof emptyRequestForm;
type SpecialistRequestErrors = Partial<Record<keyof SpecialistRequestForm, string>>;
type SpecialistRatingForm = typeof emptyRatingForm;
type SpecialistRatingErrors = Partial<Record<keyof SpecialistRatingForm, string>>;

function getConversationIndex() {
  if (typeof window === "undefined") {
    return {} as Record<string, string>;
  }

  try {
    return JSON.parse(window.localStorage.getItem(CLIENT_SPECIALIST_CONVERSATIONS_KEY) ?? "{}") as Record<
      string,
      string
    >;
  } catch {
    return {};
  }
}

function setConversationIndexValue(specialistId: string, conversationId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getConversationIndex();
  current[specialistId] = conversationId;
  window.localStorage.setItem(CLIENT_SPECIALIST_CONVERSATIONS_KEY, JSON.stringify(current));
}

function clearConversationIndexValue(specialistId: string) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getConversationIndex();
  delete current[specialistId];
  window.localStorage.setItem(CLIENT_SPECIALIST_CONVERSATIONS_KEY, JSON.stringify(current));
}

async function parseApiResponse<T extends { error?: string }>(response: Response) {
  const payload = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(payload.error || "تعذر تنفيذ العملية حاليًا.");
  }

  return payload;
}

function buildRatingSummary(items: SpecialistRating[]) {
  const total = items.length;
  const average = total > 0 ? items.reduce((sum, item) => sum + item.rating, 0) / total : 0;

  return {
    total,
    average,
  };
}

function canOpenNewRequest(conversation: SpecialistConversation | null) {
  if (!conversation) {
    return true;
  }

  return ["closed", "cancelled"].includes(conversation.status);
}

export function SpecialistsDirectory() {
  const requestSectionRef = useRef<HTMLElement | null>(null);
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string>(specialists[0]?.id ?? "");
  const [requestForm, setRequestForm] = useState<SpecialistRequestForm>(emptyRequestForm);
  const [requestErrors, setRequestErrors] = useState<SpecialistRequestErrors>({});
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [ratings, setRatings] = useState<SpecialistRating[]>([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [ratingsError, setRatingsError] = useState("");
  const [activeConversation, setActiveConversation] = useState<SpecialistConversation | null>(null);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationNotice, setConversationNotice] = useState("");
  const [conversationError, setConversationError] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [messageSubmitting, setMessageSubmitting] = useState(false);
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState<SpecialistCancellationReason>("السعر مرتفع");
  const [cancelOtherReason, setCancelOtherReason] = useState("");
  const [cancelSubmitting, setCancelSubmitting] = useState(false);
  const [ratingForm, setRatingForm] = useState<SpecialistRatingForm>(emptyRatingForm);
  const [ratingErrors, setRatingErrors] = useState<SpecialistRatingErrors>({});
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingNotice, setRatingNotice] = useState("");

  const selectedSpecialist = specialists.find((specialist) => specialist.id === selectedId) ?? null;
  const normalizedSearch = normalizeArabicText(search);

  const filteredSpecialists = useMemo(() => {
    return specialists.filter((specialist) => {
      const matchesSpecialty = specialtyFilter === "all" || specialist.primarySpecialty === specialtyFilter;

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
  }, [normalizedSearch, specialtyFilter]);

  useEffect(() => {
    if (!filteredSpecialists.length) {
      return;
    }

    if (!filteredSpecialists.some((specialist) => specialist.id === selectedId)) {
      setSelectedId(filteredSpecialists[0].id);
    }
  }, [filteredSpecialists, selectedId]);

  useEffect(() => {
    let active = true;

    async function loadRatings() {
      try {
        const response = await fetch("/api/specialist-ratings", { cache: "no-store" });
        const payload = await parseApiResponse<{ ratings: SpecialistRating[]; error?: string }>(response);

        if (active) {
          setRatings(payload.ratings ?? []);
          setRatingsError("");
        }
      } catch (error) {
        if (active) {
          setRatingsError(error instanceof Error ? error.message : "تعذر تحميل التقييمات.");
        }
      } finally {
        if (active) {
          setRatingsLoading(false);
        }
      }
    }

    void loadRatings();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    const conversationId = getConversationIndex()[selectedId];

    if (!conversationId) {
      setActiveConversation(null);
      setConversationNotice("");
      setConversationError("");
      setShowCancelForm(false);
      return;
    }

    let active = true;

    async function restoreConversation() {
      setConversationLoading(true);

      try {
        const response = await fetch(
          `/api/specialist-conversations?conversationId=${encodeURIComponent(conversationId)}`,
          { cache: "no-store" },
        );
        const payload = await parseApiResponse<{ conversation: SpecialistConversation; error?: string }>(response);

        if (active) {
          setActiveConversation(payload.conversation);
          setConversationError("");
          setConversationNotice("تم استعادة آخر طلب محفوظ مع هذا المختص.");
        }
      } catch {
        if (active) {
          clearConversationIndexValue(selectedId);
          setActiveConversation(null);
        }
      } finally {
        if (active) {
          setConversationLoading(false);
        }
      }
    }

    void restoreConversation();

    return () => {
      active = false;
    };
  }, [selectedId]);

  const selectedSpecialistRatings = useMemo(() => {
    if (!selectedSpecialist) {
      return [];
    }

    return ratings.filter((rating) => rating.specialistId === selectedSpecialist.id);
  }, [ratings, selectedSpecialist]);

  const selectedSpecialistRatingSummary = buildRatingSummary(selectedSpecialistRatings);

  const ratingSummaryBySpecialist = useMemo(() => {
    return specialists.reduce<Record<string, ReturnType<typeof buildRatingSummary>>>((collection, specialist) => {
      collection[specialist.id] = buildRatingSummary(
        ratings.filter((rating) => rating.specialistId === specialist.id),
      );
      return collection;
    }, {});
  }, [ratings]);

  const alreadyRatedCurrentConversation = useMemo(() => {
    if (!activeConversation || !selectedSpecialist) {
      return false;
    }

    return ratings.some(
      (rating) =>
        rating.specialistId === selectedSpecialist.id &&
        rating.reference.toUpperCase() === activeConversation.reference.toUpperCase(),
    );
  }, [activeConversation, ratings, selectedSpecialist]);

  function setRequestFieldValue<K extends keyof SpecialistRequestForm>(
    field: K,
    value: SpecialistRequestForm[K],
  ) {
    setRequestForm((current) => ({ ...current, [field]: value }));
    setRequestErrors((current) => ({ ...current, [field]: undefined }));
    setConversationError("");
    setConversationNotice("");
  }

  function setRatingFieldValue<K extends keyof SpecialistRatingForm>(
    field: K,
    value: SpecialistRatingForm[K],
  ) {
    setRatingForm((current) => ({ ...current, [field]: value }));
    setRatingErrors((current) => ({ ...current, [field]: undefined }));
    setRatingNotice("");
  }

  function focusRequestSection() {
    requestSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function handleSelectSpecialist(specialist: SpecialistProfile) {
    setSelectedId(specialist.id);
    focusRequestSection();
  }

  function validateRequestForm() {
    const nextErrors: SpecialistRequestErrors = {};

    if (requestForm.clientName.trim().length < 4) {
      nextErrors.clientName = "يرجى إدخال الاسم الكامل بشكل واضح.";
    }

    if (!isValidEmail(requestForm.email)) {
      nextErrors.email = "يرجى إدخال بريد إلكتروني صالح.";
    }

    if (!isValidPhone(requestForm.phone)) {
      nextErrors.phone = "يرجى إدخال رقم جوال صالح.";
    }

    if (requestForm.organization.trim().length < 2) {
      nextErrors.organization = "يرجى إدخال اسم الجهة أو المنشأة.";
    }

    if (requestForm.role.trim().length < 2) {
      nextErrors.role = "يرجى تحديد صفة مقدم الطلب.";
    }

    if (requestForm.city.trim().length < 2) {
      nextErrors.city = "يرجى إدخال المدينة.";
    }

    if (requestForm.issueTitle.trim().length < 4) {
      nextErrors.issueTitle = "يرجى كتابة عنوان مختصر للمشكلة.";
    }

    if (requestForm.issueDetails.trim().length < 20) {
      nextErrors.issueDetails = "يرجى شرح المشكلة بشكل أوضح للمختص.";
    }

    return nextErrors;
  }

  function validateRatingForm() {
    const nextErrors: SpecialistRatingErrors = {};

    if (ratingForm.serviceArea.trim().length < 3) {
      nextErrors.serviceArea = "يرجى تحديد نوع الخدمة أو نطاق المشكلة.";
    }

    if (ratingForm.comment.trim().length < 15) {
      nextErrors.comment = "يرجى كتابة تقييم أكثر تفصيلًا.";
    }

    if (ratingForm.rating < 1 || ratingForm.rating > 5) {
      nextErrors.rating = "يرجى اختيار تقييم من 1 إلى 5.";
    }

    return nextErrors;
  }

  function prepareNewRequest() {
    if (selectedSpecialist) {
      clearConversationIndexValue(selectedSpecialist.id);
    }

    setActiveConversation(null);
    setRequestForm(emptyRequestForm);
    setConversationError("");
    setConversationNotice("");
    setShowCancelForm(false);
    setMessageDraft("");
    focusRequestSection();
  }

  async function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSpecialist) {
      return;
    }

    const nextErrors = validateRequestForm();

    if (Object.keys(nextErrors).length > 0) {
      setRequestErrors(nextErrors);
      return;
    }

    setRequestSubmitting(true);
    setConversationError("");
    setConversationNotice("");

    try {
      const response = await fetch("/api/specialist-conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          specialistId: selectedSpecialist.id,
          issueTitle: requestForm.issueTitle,
          issueDetails: requestForm.issueDetails,
          urgency: requestForm.urgency,
          client: {
            name: requestForm.clientName,
            email: requestForm.email,
            phone: requestForm.phone,
            organization: requestForm.organization,
            role: requestForm.role,
            city: requestForm.city,
          },
        }),
      });
      const payload = await parseApiResponse<{ conversation: SpecialistConversation; error?: string }>(response);

      setConversationIndexValue(selectedSpecialist.id, payload.conversation.id);
      setActiveConversation(payload.conversation);
      setRequestErrors({});
      setConversationNotice("تم إنشاء الطلب وفتح محادثة مباشرة مع المختص.");
      setMessageDraft("");
    } catch (error) {
      setConversationError(error instanceof Error ? error.message : "تعذر فتح المحادثة حاليًا.");
    } finally {
      setRequestSubmitting(false);
    }
  }

  async function sendClientMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!activeConversation || messageDraft.trim().length < 3) {
      setConversationError("يرجى كتابة رسالة واضحة قبل الإرسال.");
      return;
    }

    setMessageSubmitting(true);
    setConversationError("");
    setConversationNotice("");

    try {
      const response = await fetch(
        `/api/specialist-conversations/${activeConversation.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sender: "client",
            senderName: activeConversation.client.name,
            body: messageDraft,
          }),
        },
      );
      const payload = await parseApiResponse<{ conversation: SpecialistConversation; error?: string }>(response);

      setActiveConversation(payload.conversation);
      setMessageDraft("");
      setConversationNotice("تم إرسال رسالتك إلى المختص.");
    } catch (error) {
      setConversationError(error instanceof Error ? error.message : "تعذر إرسال الرسالة.");
    } finally {
      setMessageSubmitting(false);
    }
  }

  async function handleQuoteDecision(decision: "accepted" | "rejected") {
    if (!activeConversation) {
      return;
    }

    setQuoteSubmitting(true);
    setConversationError("");
    setConversationNotice("");

    try {
      const response = await fetch(`/api/specialist-conversations/${activeConversation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quoteDecision: decision,
        }),
      });
      const payload = await parseApiResponse<{ conversation: SpecialistConversation; error?: string }>(response);

      setActiveConversation(payload.conversation);
      setConversationNotice(
        decision === "accepted"
          ? "تم قبول العرض السعري وتفعيل الطلب."
          : "تم رفض العرض السعري الحالي، ويمكن انتظار تعديل جديد من المختص.",
      );
    } catch (error) {
      setConversationError(error instanceof Error ? error.message : "تعذر تحديث قرار التسعير.");
    } finally {
      setQuoteSubmitting(false);
    }
  }

  async function cancelRequest() {
    if (!activeConversation) {
      return;
    }

    if (cancelReason === "سبب آخر" && !cancelOtherReason.trim()) {
      setConversationError("يرجى كتابة سبب الإلغاء الآخر.");
      return;
    }

    setCancelSubmitting(true);
    setConversationError("");
    setConversationNotice("");

    try {
      const response = await fetch(`/api/specialist-conversations/${activeConversation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancellation: {
            reason: cancelReason,
            details: cancelReason === "سبب آخر" ? cancelOtherReason : undefined,
            cancelledBy: "client",
          },
        }),
      });
      const payload = await parseApiResponse<{ conversation: SpecialistConversation; error?: string }>(response);

      setActiveConversation(payload.conversation);
      setShowCancelForm(false);
      setConversationNotice("تم إلغاء الطلب بنجاح.");
    } catch (error) {
      setConversationError(error instanceof Error ? error.message : "تعذر إلغاء الطلب.");
    } finally {
      setCancelSubmitting(false);
    }
  }

  async function submitRating(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedSpecialist || !activeConversation) {
      return;
    }

    const nextErrors = validateRatingForm();

    if (Object.keys(nextErrors).length > 0) {
      setRatingErrors(nextErrors);
      return;
    }

    setRatingSubmitting(true);
    setRatingNotice("");

    try {
      const response = await fetch("/api/specialist-ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          specialistId: selectedSpecialist.id,
          clientName: activeConversation.client.name,
          reference: activeConversation.reference,
          serviceArea: ratingForm.serviceArea,
          rating: ratingForm.rating,
          comment: ratingForm.comment,
        }),
      });
      const payload = await parseApiResponse<{ rating: SpecialistRating; error?: string }>(response);

      setRatings((current) => [payload.rating, ...current]);
      setRatingNotice("تم حفظ تقييمك وإضافته إلى تقييمات هذا المختص.");
      setRatingErrors({});
      setRatingForm(emptyRatingForm);
    } catch (error) {
      setRatingNotice(error instanceof Error ? error.message : "تعذر إرسال التقييم.");
    } finally {
      setRatingSubmitting(false);
    }
  }

  const specialistsWithRatings = Object.values(ratingSummaryBySpecialist).filter((summary) => summary.total > 0).length;

  return (
    <div className="space-y-8">
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="panel-soft cyber-card p-5">
          <p className="text-sm text-steel">عدد المختصين</p>
          <p className="mt-3 font-heading text-4xl text-white">{specialists.length}</p>
        </div>
        <div className="panel-soft cyber-card p-5">
          <p className="text-sm text-steel">التخصصات</p>
          <p className="mt-3 font-heading text-4xl text-white">{specialtyOptions.length - 1}</p>
        </div>
        <div className="panel-soft cyber-card p-5">
          <p className="text-sm text-steel">مختصون لديهم تقييمات</p>
          <p className="mt-3 font-heading text-4xl text-white">{specialistsWithRatings}</p>
        </div>
        <div className="panel-soft cyber-card p-5">
          <p className="text-sm text-steel">متوسط تقييم المختص المحدد</p>
          <p className="mt-3 font-heading text-4xl text-white">
            {selectedSpecialistRatingSummary.average.toFixed(1)}
          </p>
        </div>
      </section>

      <section className="panel cyber-card overflow-hidden p-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          <label className="grid gap-2 text-sm text-steel">
            البحث داخل المختصين
            <div className="relative">
              <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث بالاسم أو التخصص أو الوصف"
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
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredSpecialists.length === 0 ? (
          <div className="panel col-span-full p-8 text-center">
            <p className="font-heading text-2xl text-white">لا توجد نتائج مطابقة</p>
            <p className="mt-3 leading-8 text-steel">
              جرّب تغيير كلمات البحث أو فلترة التخصص للوصول إلى مختص آخر.
            </p>
          </div>
        ) : (
          filteredSpecialists.map((specialist) => {
            const ratingSummary = ratingSummaryBySpecialist[specialist.id] ?? { total: 0, average: 0 };
            const selected = specialist.id === selectedId;

            return (
              <article
                key={specialist.id}
                className={cn(
                  "panel cyber-card overflow-hidden p-6 transition duration-300",
                  selected ? "border-cyanGlow/35 bg-cyanGlow/10 shadow-glow" : "hover:-translate-y-1 hover:border-cyanGlow/20",
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-2xl text-white">{specialist.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-cyanGlow">{specialist.primarySpecialty}</p>
                  </div>
                  {selected ? (
                    <span className="rounded-full border border-cyanGlow/25 bg-cyanGlow/10 px-3 py-1 text-xs text-cyanGlow">
                      المختص الحالي
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-sm leading-7 text-steel">{specialist.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {specialist.subSpecialties.slice(0, 4).map((item) => (
                    <span key={item} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-steel">الخبرة</p>
                    <p className="mt-1 text-sm text-white">{specialist.experienceLevel}</p>
                  </div>
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-steel">التقييم</p>
                    <p className="mt-1 text-sm text-white">
                      {ratingSummary.total > 0
                        ? `${ratingSummary.average.toFixed(1)} من 5`
                        : "لا توجد تقييمات بعد"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSelectSpecialist(specialist)}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
                >
                  اختيار المختص
                  <ArrowUpLeft className="size-4" />
                </button>
              </article>
            );
          })
        )}
      </section>

      {selectedSpecialist ? (
        <section ref={requestSectionRef} className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <article className="panel cyber-card overflow-hidden p-6 md:p-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
                  <UserCheck className="size-4" />
                  المختص المحدد
                </div>
                <div>
                  <h3 className="font-heading text-4xl text-white">{selectedSpecialist.name}</h3>
                  <p className="mt-3 text-base font-semibold text-cyanGlow">
                    {selectedSpecialist.primarySpecialty}
                  </p>
                </div>
                <p className="leading-8 text-steel">{selectedSpecialist.description}</p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-steel">الخبرة</p>
                    <p className="mt-1 text-white">{selectedSpecialist.experienceLevel}</p>
                  </div>
                  <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-steel">التوفر</p>
                    <p className="mt-1 text-white">{selectedSpecialist.availability}</p>
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">يعالج عادة</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedSpecialist.handles.map((item) => (
                      <span key={item} className="rounded-full border border-cyanGlow/15 bg-cyanGlow/10 px-3 py-1 text-xs text-cyanGlow">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-white">تقييمات هذا المختص</p>
                    <span className="text-sm text-cyanGlow">
                      {selectedSpecialistRatingSummary.average.toFixed(1)} / 5
                    </span>
                  </div>
                  {ratingsLoading ? (
                    <div className="mt-4 flex items-center gap-2 text-sm text-steel">
                      <LoaderCircle className="size-4 animate-spin" />
                      جار تحميل التقييمات...
                    </div>
                  ) : selectedSpecialistRatings.length === 0 ? (
                    <p className="mt-4 text-sm leading-7 text-steel">لا توجد تقييمات مرتبطة بهذا المختص بعد.</p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {selectedSpecialistRatings.slice(0, 3).map((rating) => (
                        <div key={rating.id} className="rounded-[1.25rem] border border-white/10 bg-midnight/40 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold text-white">{rating.clientName}</p>
                            <div className="flex gap-1 text-amber-300">
                              {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                  key={index}
                                  className={cn("size-4", index < rating.rating && "fill-current")}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-sm font-semibold text-cyanGlow">{rating.serviceArea}</p>
                          <p className="mt-2 text-sm leading-7 text-steel">{rating.comment}</p>
                          <p className="mt-2 text-xs text-steel">{formatArabicDate(rating.submittedAt)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {ratingsError ? <p className="mt-4 text-sm text-danger">{ratingsError}</p> : null}
                </div>
              </div>
            </article>
          </div>

          <div className="space-y-5">
            {conversationError ? (
              <div className="rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100">
                {conversationError}
              </div>
            ) : null}

            {conversationNotice ? (
              <div className="rounded-[1.35rem] border border-success/30 bg-success/10 px-4 py-3 text-sm text-emerald-100">
                {conversationNotice}
              </div>
            ) : null}

            {conversationLoading ? (
              <div className="panel flex min-h-[320px] items-center justify-center p-8">
                <span className="inline-flex items-center gap-2 text-steel">
                  <LoaderCircle className="size-4 animate-spin" />
                  جار تحميل الطلب الحالي...
                </span>
              </div>
            ) : activeConversation ? (
              <>
                <section className="panel cyber-card overflow-hidden p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs tracking-[0.16em] text-steel">مرجع الطلب</p>
                      <h3 className="mt-2 font-heading text-3xl text-white">{activeConversation.reference}</h3>
                      <p className="mt-3 text-sm font-semibold text-cyanGlow">{activeConversation.issueTitle}</p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs",
                        conversationStatusMap[activeConversation.status].className,
                      )}
                    >
                      {conversationStatusMap[activeConversation.status].label}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-steel">
                        <Building2 className="size-4 text-cyanGlow" />
                        <span className="text-xs">الجهة</span>
                      </div>
                      <p className="mt-2 text-white">{activeConversation.client.organization}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-steel">
                        <MapPin className="size-4 text-cyanGlow" />
                        <span className="text-xs">المدينة</span>
                      </div>
                      <p className="mt-2 text-white">{activeConversation.client.city}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-steel">
                        <Mail className="size-4 text-cyanGlow" />
                        <span className="text-xs">البريد الإلكتروني</span>
                      </div>
                      <p className="mt-2 text-white" dir="ltr">
                        {activeConversation.client.email}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 text-steel">
                        <Phone className="size-4 text-cyanGlow" />
                        <span className="text-xs">رقم الجوال</span>
                      </div>
                      <p className="mt-2 text-white" dir="ltr">
                        {activeConversation.client.phone}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[1.35rem] border border-cyanGlow/15 bg-cyanGlow/10 p-4 text-sm leading-7 text-steel">
                    {activeConversation.verificationNote}
                  </div>

                  {activeConversation.quote ? (
                    <div className="mt-5 rounded-[1.5rem] border border-cyanGlow/20 bg-cyanGlow/10 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-cyanGlow">عرض التسعير</p>
                          <p className="mt-2 font-heading text-4xl text-white">
                            {activeConversation.quote.price.toLocaleString("ar-SA")} ريال
                          </p>
                        </div>
                        <div className="rounded-[1.25rem] border border-white/10 bg-midnight/40 px-4 py-3 text-sm text-white">
                          <div className="inline-flex items-center gap-2">
                            <Clock3 className="size-4 text-cyanGlow" />
                            مدة التنفيذ: {activeConversation.quote.durationDays} يوم
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-steel">
                        حالة التسعير:{" "}
                        <span className="text-white">
                          {activeConversation.quote.status === "pending-client"
                            ? "بانتظار قرارك"
                            : activeConversation.quote.status === "accepted"
                              ? "تمت الموافقة"
                              : "تم الرفض"}
                        </span>
                      </p>

                      {activeConversation.quote.status === "pending-client" &&
                      activeConversation.status !== "cancelled" ? (
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <button
                            type="button"
                            disabled={quoteSubmitting}
                            onClick={() => void handleQuoteDecision("accepted")}
                            className="rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            قبول السعر
                          </button>
                          <button
                            type="button"
                            disabled={quoteSubmitting}
                            onClick={() => void handleQuoteDecision("rejected")}
                            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            رفض السعر
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-[1.35rem] border border-dashed border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
                      لم يضف المختص تسعيرًا بعد. سيظهر هنا السعر ومدة التنفيذ فور إدخالهما من بوابة المختص.
                    </div>
                  )}

                  {activeConversation.cancellation ? (
                    <div className="mt-5 rounded-[1.35rem] border border-danger/30 bg-danger/10 p-4 text-sm leading-7 text-rose-100">
                      <div className="flex items-center gap-2 font-semibold">
                        <XCircle className="size-4" />
                        تم إلغاء الطلب
                      </div>
                      <p className="mt-2">
                        السبب: {activeConversation.cancellation.reason}
                        {activeConversation.cancellation.details
                          ? ` - ${activeConversation.cancellation.details}`
                          : ""}
                      </p>
                    </div>
                  ) : null}

                  {activeConversation.status !== "closed" && activeConversation.status !== "cancelled" ? (
                    <div className="mt-5">
                      {showCancelForm ? (
                        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                          <p className="text-sm font-semibold text-white">سبب الإلغاء</p>
                          <div className="mt-4 grid gap-3">
                            {cancellationReasons.map((reason) => (
                              <label
                                key={reason}
                                className="flex items-center gap-3 rounded-[1.1rem] border border-white/10 bg-midnight/35 px-4 py-3 text-sm text-white"
                              >
                                <input
                                  type="radio"
                                  name="cancellationReason"
                                  checked={cancelReason === reason}
                                  onChange={() => setCancelReason(reason)}
                                  className="size-4 accent-cyanGlow"
                                />
                                {reason}
                              </label>
                            ))}
                          </div>
                          {cancelReason === "سبب آخر" ? (
                            <textarea
                              value={cancelOtherReason}
                              onChange={(event) => setCancelOtherReason(event.target.value)}
                              rows={4}
                              className="mt-4 w-full rounded-[1.35rem] border border-white/10 bg-midnight/35 px-4 py-3 text-white outline-none"
                              placeholder="اكتب سبب الإلغاء"
                            />
                          ) : null}
                          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                            <button
                              type="button"
                              disabled={cancelSubmitting}
                              onClick={() => void cancelRequest()}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-danger/30 bg-danger/10 px-5 py-4 text-sm font-semibold text-rose-100 transition hover:bg-danger/20 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              تأكيد الإلغاء
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowCancelForm(false)}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
                            >
                              تراجع
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setShowCancelForm(true)}
                          className="inline-flex items-center gap-2 rounded-2xl border border-danger/30 bg-danger/10 px-5 py-4 text-sm font-semibold text-rose-100 transition hover:bg-danger/20"
                        >
                          إلغاء الطلب
                        </button>
                      )}
                    </div>
                  ) : null}

                  {canOpenNewRequest(activeConversation) ? (
                    <button
                      type="button"
                      onClick={prepareNewRequest}
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
                    >
                      فتح طلب جديد مع هذا المختص
                    </button>
                  ) : null}
                </section>

                <section className="panel cyber-card overflow-hidden p-6">
                  <div className="flex items-center gap-2 text-cyanGlow">
                    <MessageSquareText className="size-4" />
                    <span className="text-sm font-semibold">سجل المحادثة</span>
                  </div>
                  <div className="mt-5 space-y-3">
                    {activeConversation.messages.map((message) => (
                      <article
                        key={message.id}
                        className={cn(
                          "rounded-[1.35rem] border p-4",
                          message.sender === "specialist"
                            ? "border-cyanGlow/20 bg-cyanGlow/10"
                            : message.sender === "system"
                              ? "border-white/10 bg-midnight/50"
                              : "border-white/10 bg-white/5",
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-white">{message.senderName}</p>
                          <p className="text-xs text-steel">{formatArabicDateTime(message.sentAt)}</p>
                        </div>
                        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-100">{message.body}</p>
                      </article>
                    ))}
                  </div>
                </section>

                {activeConversation.status !== "closed" && activeConversation.status !== "cancelled" ? (
                  <form onSubmit={sendClientMessage} className="panel cyber-card overflow-hidden p-6">
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-white">رسالة إلى المختص</p>
                        <p className="mt-2 text-sm leading-7 text-steel">
                          استخدم هذه القناة لإرسال التفاصيل الإضافية أو الاستفسار عن الطلب أو التسعير.
                        </p>
                      </div>
                      <textarea
                        value={messageDraft}
                        onChange={(event) => setMessageDraft(event.target.value)}
                        rows={5}
                        className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                        placeholder="اكتب رسالتك هنا"
                      />
                      <button
                        type="submit"
                        disabled={messageSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {messageSubmitting ? (
                          <>
                            <LoaderCircle className="size-4 animate-spin" />
                            جار الإرسال...
                          </>
                        ) : (
                          "إرسال الرسالة"
                        )}
                      </button>
                    </div>
                  </form>
                ) : null}

                {activeConversation.status === "closed" ? (
                  <form onSubmit={submitRating} className="panel cyber-card overflow-hidden p-6">
                    <div className="space-y-5">
                      <div className="flex items-center gap-2 text-cyanGlow">
                        <BadgeCheck className="size-4" />
                        <span className="text-sm font-semibold">تقييم المختص</span>
                      </div>
                      <p className="text-sm leading-7 text-steel">
                        بعد انتهاء الطلب يمكنك إرسال تقييم نجوم وتعليق، وسيظهر في صفحة المختصين والصفحة
                        الرئيسية.
                      </p>

                      {alreadyRatedCurrentConversation ? (
                        <div className="rounded-[1.35rem] border border-success/30 bg-success/10 px-4 py-3 text-sm text-emerald-100">
                          تم إرسال تقييم لهذا الطلب مسبقًا.
                        </div>
                      ) : (
                        <>
                          <label className="grid gap-2 text-sm text-steel">
                            نوع الخدمة
                            <input
                              value={ratingForm.serviceArea}
                              onChange={(event) => setRatingFieldValue("serviceArea", event.target.value)}
                              className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                              placeholder="مثل: استعادة حساب أو تحليل إصابة"
                            />
                            {ratingErrors.serviceArea ? (
                              <span className="text-xs text-danger">{ratingErrors.serviceArea}</span>
                            ) : null}
                          </label>

                          <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                            <p className="text-sm font-semibold text-white">التقييم بالنجوم</p>
                            <div className="mt-4 flex flex-wrap gap-3">
                              {Array.from({ length: 5 }).map((_, index) => {
                                const rating = index + 1;
                                const active = ratingForm.rating >= rating;

                                return (
                                  <button
                                    key={rating}
                                    type="button"
                                    onClick={() => setRatingFieldValue("rating", rating)}
                                    className={cn(
                                      "rounded-2xl border px-4 py-3 text-sm transition",
                                      active
                                        ? "border-cyanGlow/25 bg-cyanGlow/10 text-cyanGlow"
                                        : "border-white/10 bg-midnight/40 text-steel hover:text-white",
                                    )}
                                  >
                                    <span className="inline-flex items-center gap-2">
                                      <Star className={cn("size-4", active && "fill-current")} />
                                      {rating}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                            {ratingErrors.rating ? (
                              <p className="mt-3 text-xs text-danger">{ratingErrors.rating}</p>
                            ) : null}
                          </div>

                          <label className="grid gap-2 text-sm text-steel">
                            التعليق
                            <textarea
                              value={ratingForm.comment}
                              onChange={(event) => setRatingFieldValue("comment", event.target.value)}
                              rows={5}
                              className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                              placeholder="صف تجربتك مع المختص بشكل مختصر ومفيد"
                            />
                            {ratingErrors.comment ? (
                              <span className="text-xs text-danger">{ratingErrors.comment}</span>
                            ) : null}
                          </label>

                          <button
                            type="submit"
                            disabled={ratingSubmitting}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {ratingSubmitting ? (
                              <>
                                <LoaderCircle className="size-4 animate-spin" />
                                جار إرسال التقييم...
                              </>
                            ) : (
                              "إرسال التقييم"
                            )}
                          </button>
                        </>
                      )}

                      {ratingNotice ? (
                        <div className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
                          {ratingNotice}
                        </div>
                      ) : null}
                    </div>
                  </form>
                ) : null}
              </>
            ) : (
              <form onSubmit={submitRequest} className="panel cyber-card overflow-hidden p-6 md:p-8">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
                    <ShieldCheck className="size-4" />
                    إنشاء طلب جديد
                  </div>
                  <p className="leading-8 text-steel">
                    بعد اختيار المختص يمكنك تعبئة الطلب، ثم يتم فتح قناة محادثة مباشرة ومتابعة التسعير
                    والقرار حتى التقييم النهائي.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-steel">
                      الاسم
                      <input
                        value={requestForm.clientName}
                        onChange={(event) => setRequestFieldValue("clientName", event.target.value)}
                        className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                      />
                      {requestErrors.clientName ? (
                        <span className="text-xs text-danger">{requestErrors.clientName}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel">
                      البريد الإلكتروني
                      <input
                        value={requestForm.email}
                        onChange={(event) => setRequestFieldValue("email", event.target.value)}
                        className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                        dir="ltr"
                      />
                      {requestErrors.email ? (
                        <span className="text-xs text-danger">{requestErrors.email}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel">
                      رقم الجوال
                      <input
                        value={requestForm.phone}
                        onChange={(event) => setRequestFieldValue("phone", event.target.value)}
                        className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                        dir="ltr"
                      />
                      {requestErrors.phone ? (
                        <span className="text-xs text-danger">{requestErrors.phone}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel">
                      الجهة أو المنشأة
                      <input
                        value={requestForm.organization}
                        onChange={(event) => setRequestFieldValue("organization", event.target.value)}
                        className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                      />
                      {requestErrors.organization ? (
                        <span className="text-xs text-danger">{requestErrors.organization}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel">
                      الصفة
                      <input
                        value={requestForm.role}
                        onChange={(event) => setRequestFieldValue("role", event.target.value)}
                        className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                        placeholder="مثل: مالك الحساب أو مسؤول تقنية"
                      />
                      {requestErrors.role ? <span className="text-xs text-danger">{requestErrors.role}</span> : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel">
                      المدينة
                      <input
                        value={requestForm.city}
                        onChange={(event) => setRequestFieldValue("city", event.target.value)}
                        className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                      />
                      {requestErrors.city ? <span className="text-xs text-danger">{requestErrors.city}</span> : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel md:col-span-2">
                      عنوان المشكلة
                      <input
                        value={requestForm.issueTitle}
                        onChange={(event) => setRequestFieldValue("issueTitle", event.target.value)}
                        className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                        placeholder="مثل: فقدان الوصول إلى حساب العمل"
                      />
                      {requestErrors.issueTitle ? (
                        <span className="text-xs text-danger">{requestErrors.issueTitle}</span>
                      ) : null}
                    </label>

                    <div className="grid gap-3 rounded-[1.35rem] border border-white/10 bg-white/5 p-4 md:col-span-2">
                      <p className="text-sm font-semibold text-white">درجة الاستعجال</p>
                      <div className="grid gap-3 md:grid-cols-3">
                        {urgencyOptions.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setRequestFieldValue("urgency", option.value)}
                            className={cn(
                              "rounded-[1.2rem] border px-4 py-4 text-right transition",
                              requestForm.urgency === option.value
                                ? "border-cyanGlow/25 bg-cyanGlow/10 text-cyanGlow"
                                : "border-white/10 bg-midnight/40 text-steel hover:text-white",
                            )}
                          >
                            <p className="font-semibold">{option.label}</p>
                            <p className="mt-1 text-xs leading-6">{option.description}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="grid gap-2 text-sm text-steel md:col-span-2">
                      وصف الحالة
                      <textarea
                        value={requestForm.issueDetails}
                        onChange={(event) => setRequestFieldValue("issueDetails", event.target.value)}
                        rows={7}
                        className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                        placeholder="اشرح ما حدث، ومتى بدأ، وما الأثر الظاهر"
                      />
                      {requestErrors.issueDetails ? (
                        <span className="text-xs text-danger">{requestErrors.issueDetails}</span>
                      ) : null}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {requestSubmitting ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        جار إنشاء الطلب...
                      </>
                    ) : (
                      <>
                        إنشاء الطلب
                        <Sparkles className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}
