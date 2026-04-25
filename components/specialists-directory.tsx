"use client";

import Link from "next/link";
import {
  ArrowUpLeft,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  LoaderCircle,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { specialists } from "@/data/specialists";
import {
  CLIENT_SPECIALIST_CONVERSATIONS_KEY,
  formatArabicDate,
  formatArabicDateTime,
  getInitials,
  isValidEmail,
  isValidPhone,
} from "@/lib/prototype";
import { cn, normalizeArabicText } from "@/lib/utils";
import {
  SpecialistConversation,
  SpecialistConversationStatus,
  SpecialistConversationUrgency,
  SpecialistRating,
} from "@/types/cyber";

const specialtyOptions = [
  { value: "all", label: "كل التخصصات" },
  ...Array.from(new Set(specialists.map((specialist) => specialist.primarySpecialty))).map((specialty) => ({
    value: specialty,
    label: specialty,
  })),
  { value: "unclassified", label: "الحالات غير المصنفة" },
];

const urgencyOptions: Array<{
  value: SpecialistConversationUrgency;
  label: string;
  description: string;
}> = [
  { value: "routine", label: "اعتيادي", description: "حالة قابلة للمتابعة خلال وقت العمل." },
  { value: "priority", label: "عالي", description: "الحالة تؤثر على التشغيل وتحتاج متابعة أسرع." },
  { value: "critical", label: "حرج", description: "مؤشرات مرتفعة الخطورة أو توقف واضح للخدمة." },
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
  active: {
    label: "نشطة",
    className: "border-cyanGlow/30 bg-cyanGlow/10 text-cyanGlow",
  },
  "awaiting-client": {
    label: "بانتظار العميل",
    className: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  },
  closed: {
    label: "مغلقة",
    className: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
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

export function SpecialistsDirectory() {
  const requestSectionRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string>(specialists[0]?.id ?? "");
  const [expandedId, setExpandedId] = useState<string | null>(specialists[0]?.id ?? null);
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
  const [referenceLookup, setReferenceLookup] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [messageSubmitting, setMessageSubmitting] = useState(false);
  const [ratingForm, setRatingForm] = useState<SpecialistRatingForm>(emptyRatingForm);
  const [ratingErrors, setRatingErrors] = useState<SpecialistRatingErrors>({});
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingNotice, setRatingNotice] = useState("");

  const selectedSpecialist = specialists.find((specialist) => specialist.id === selectedId) ?? null;
  const unclassifiedSpecialists = specialists.filter((specialist) => specialist.supportsUnclassified);
  const normalizedSearch = normalizeArabicText(search);

  const filteredSpecialists = useMemo(() => {
    return specialists.filter((specialist) => {
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
  }, [normalizedSearch, specialtyFilter]);

  const ratingSummaryBySpecialist = useMemo(() => {
    return specialists.reduce<Record<string, ReturnType<typeof buildRatingSummary>>>((collection, specialist) => {
      collection[specialist.id] = buildRatingSummary(
        ratings.filter((rating) => rating.specialistId === specialist.id),
      );
      return collection;
    }, {});
  }, [ratings]);

  const selectedSpecialistRatings = useMemo(() => {
    if (!selectedSpecialist) {
      return [];
    }

    return ratings.filter((rating) => rating.specialistId === selectedSpecialist.id);
  }, [ratings, selectedSpecialist]);

  const selectedSpecialistRatingSummary = buildRatingSummary(selectedSpecialistRatings);

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
          setRatingsError(error instanceof Error ? error.message : "تعذر تحميل تقييمات المختصين.");
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

    let active = true;
    const conversationId = getConversationIndex()[selectedId];

    if (!conversationId) {
      setActiveConversation(null);
      setConversationError("");
      setConversationNotice("");
      setReferenceLookup("");
      return;
    }

    async function restoreConversation() {
      setConversationLoading(true);

      try {
        const response = await fetch(
          `/api/specialist-conversations?conversationId=${encodeURIComponent(conversationId)}`,
          { cache: "no-store" },
        );
        const payload = await parseApiResponse<{
          conversation: SpecialistConversation;
          error?: string;
        }>(response);

        if (active) {
          setActiveConversation(payload.conversation);
          setReferenceLookup(payload.conversation.reference);
          setConversationError("");
          setConversationNotice("تم استعادة آخر محادثة محفوظة مع هذا المختص.");
        }
      } catch {
        if (active) {
          setActiveConversation(null);
          setReferenceLookup("");
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

  useEffect(() => {
    if (!activeConversation) {
      return;
    }

    setRatingForm({
      serviceArea: activeConversation.issueTitle,
      rating: 5,
      comment: "",
    });
    setRatingErrors({});
    setRatingNotice("");
  }, [activeConversation]);

  function setRequestField<K extends keyof SpecialistRequestForm>(field: K, value: SpecialistRequestForm[K]) {
    setRequestForm((current) => ({ ...current, [field]: value }));
    setRequestErrors((current) => ({ ...current, [field]: undefined }));
    setConversationError("");
    setConversationNotice("");
  }

  function setRatingField<K extends keyof SpecialistRatingForm>(field: K, value: SpecialistRatingForm[K]) {
    setRatingForm((current) => ({ ...current, [field]: value }));
    setRatingErrors((current) => ({ ...current, [field]: undefined }));
    setRatingNotice("");
  }

  function chooseSpecialist(specialistId: string) {
    setSelectedId(specialistId);
    setExpandedId(specialistId);

    requestSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.setTimeout(() => {
      firstFieldRef.current?.focus();
    }, 280);
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

  async function loadConversationByReference() {
    if (!referenceLookup.trim()) {
      setConversationError("أدخل مرجع المحادثة أولًا.");
      setConversationNotice("");
      return;
    }

    setLookupLoading(true);
    setConversationError("");
    setConversationNotice("");

    try {
      const response = await fetch(
        `/api/specialist-conversations?reference=${encodeURIComponent(referenceLookup.trim())}`,
        { cache: "no-store" },
      );
      const payload = await parseApiResponse<{ conversation: SpecialistConversation; error?: string }>(response);

      setConversationIndexValue(payload.conversation.specialistId, payload.conversation.id);
      setSelectedId(payload.conversation.specialistId);
      setExpandedId(payload.conversation.specialistId);
      setActiveConversation(payload.conversation);
      setReferenceLookup(payload.conversation.reference);
      setConversationNotice("تم العثور على المحادثة واستعادتها بنجاح.");
    } catch (error) {
      setConversationError(error instanceof Error ? error.message : "تعذر استعادة المحادثة.");
    } finally {
      setLookupLoading(false);
    }
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
      setReferenceLookup(payload.conversation.reference);
      setRequestErrors({});
      setConversationNotice("تم التحقق الأولي من البيانات وفتح محادثة مباشرة مع المختص.");
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
      const response = await fetch(`/api/specialist-conversations/${activeConversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "client",
          senderName: activeConversation.client.name,
          body: messageDraft,
        }),
      });
      const payload = await parseApiResponse<{ conversation: SpecialistConversation; error?: string }>(response);

      setActiveConversation(payload.conversation);
      setMessageDraft("");
      setConversationNotice("تم إرسال رسالتك إلى المختص داخل القناة الحالية.");
    } catch (error) {
      setConversationError(error instanceof Error ? error.message : "تعذر إرسال الرسالة.");
    } finally {
      setMessageSubmitting(false);
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
    } catch (error) {
      setRatingNotice(error instanceof Error ? error.message : "تعذر إرسال التقييم.");
    } finally {
      setRatingSubmitting(false);
    }
  }

  const specialistsWithRatings = Object.values(ratingSummaryBySpecialist).filter((summary) => summary.total > 0).length;

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel cyber-card overflow-hidden p-6 md:p-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
              <ShieldCheck className="size-4" />
              بوابة الطلبات والمحادثات
            </div>
            <h3 className="font-heading text-4xl leading-tight text-white">
              اختر المختص، وثّق بياناتك، وافتح قناة محادثة مباشرة داخل Cyvero
            </h3>
            <p className="leading-8 text-steel">
              صمّمنا هذه التجربة لتكون أقرب إلى مسار عمل حقيقي: اختيار مختص مناسب، تحقق أولي من بيانات
              التواصل، قناة رسائل بين العميل والمختص، ثم تقييم موثّق مرتبط بمرجع المحادثة.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/specialists/login"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
              >
                دخول المختصين
                <ArrowUpLeft className="size-4" />
              </Link>
              <button
                type="button"
                onClick={() => chooseSpecialist(selectedId)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
              >
                ابدأ مع المختص الحالي
                <Sparkles className="size-4" />
              </button>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
              النسخة الحالية تجريبية، لكنها تحفظ المحادثات والتقييمات داخل المشروع نفسه لتجربة أكثر واقعية
              من الرسائل الوهمية المؤقتة فقط.
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <div className="panel-soft cyber-card p-5">
            <p className="text-sm text-steel">عدد المختصين</p>
            <p className="mt-3 font-heading text-4xl text-white">{specialists.length}</p>
            <p className="mt-2 text-sm text-cyanGlow">تغطية لتخصصات متعددة</p>
          </div>
          <div className="panel-soft cyber-card p-5">
            <p className="text-sm text-steel">ممرات غير مصنفة</p>
            <p className="mt-3 font-heading text-4xl text-white">{unclassifiedSpecialists.length}</p>
            <p className="mt-2 text-sm text-cyanGlow">للعملاء الذين لا يعرفون نوع المشكلة</p>
          </div>
          <div className="panel-soft cyber-card p-5">
            <p className="text-sm text-steel">مختصون لديهم تقييمات</p>
            <p className="mt-3 font-heading text-4xl text-white">{ratingsLoading ? "..." : specialistsWithRatings}</p>
            <p className="mt-2 text-sm text-cyanGlow">تقييمات مرتبطة بمراجع محادثات</p>
          </div>
        </div>
      </section>

      {selectedSpecialist ? (
        <section ref={requestSectionRef} className="panel cyber-card overflow-hidden p-6 md:p-8">
          <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
                <BadgeCheck className="size-4" />
                المختص المحدد
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

              <p className="text-sm leading-8 text-steel">{selectedSpecialist.description}</p>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.14em] text-steel">تقييم هذا المختص</p>
                    <p className="mt-2 font-heading text-3xl text-white">
                      {selectedSpecialistRatingSummary.average.toFixed(1)}
                    </p>
                  </div>
                  <div className="flex gap-1 text-amber-300">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={cn(
                          "size-5",
                          index < Math.round(selectedSpecialistRatingSummary.average) && "fill-current",
                        )}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-steel">
                  {ratingsLoading
                    ? "جار تحميل تقييمات المختص..."
                    : selectedSpecialistRatingSummary.total > 0
                      ? `${selectedSpecialistRatingSummary.total} تقييمات مرتبطة بطلبات حقيقية`
                      : "لا توجد تقييمات لهذا المختص بعد."}
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-xs tracking-[0.14em] text-steel">المشكلات التي يتعامل معها</p>
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

              <div className="rounded-[1.5rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5">
                <div className="flex items-center gap-2 text-cyanGlow">
                  <ClipboardCheck className="size-4" />
                  <span className="text-sm font-semibold">التخصصات الفرعية</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedSpecialist.subSpecialties.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {selectedSpecialistRatings.slice(0, 3).length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-white">آخر تقييمات المختص</p>
                  {selectedSpecialistRatings.slice(0, 3).map((item) => (
                    <article key={item.id} className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-white">{item.clientName}</p>
                        <div className="flex gap-1 text-amber-300">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={cn("size-4", index < item.rating && "fill-current")}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-cyanGlow">{item.serviceArea}</p>
                      <p className="mt-2 text-sm leading-7 text-steel">{item.comment}</p>
                      <p className="mt-3 text-xs text-steel">{formatArabicDate(item.submittedAt)}</p>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <h3 className="font-heading text-3xl text-white">قناة العميل مع المختص</h3>
                <p className="leading-8 text-steel">
                  يمكنك فتح محادثة جديدة بعد التحقق الأولي من بياناتك، أو استعادة محادثة سابقة باستخدام مرجع
                  الطلب.
                </p>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">لدي محادثة سابقة</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    value={referenceLookup}
                    onChange={(event) => setReferenceLookup(event.target.value)}
                    className="w-full rounded-[1.35rem] border border-white/10 bg-midnight/40 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                    placeholder="أدخل مرجع المحادثة مثل SPC-2026-XXXX"
                    dir="ltr"
                  />
                  <button
                    type="button"
                    onClick={() => void loadConversationByReference()}
                    disabled={lookupLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 px-5 py-4 text-sm font-semibold text-cyanGlow transition hover:bg-cyanGlow/15 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {lookupLoading ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        جار الاستعادة...
                      </>
                    ) : (
                      "استعادة المحادثة"
                    )}
                  </button>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-7 text-amber-50">
                لا تشارك كلمات المرور أو رموز التحقق أو بيانات الدفع. هذا المسار مخصص لبيانات التواصل ووصف
                الحالة فقط.
              </div>

              {conversationNotice ? (
                <div className="flex items-start gap-3 rounded-[1.35rem] border border-success/30 bg-success/10 px-4 py-3 text-sm text-emerald-100">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                  <p>{conversationNotice}</p>
                </div>
              ) : null}

              {conversationError ? (
                <div className="flex items-start gap-3 rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100">
                  <ShieldAlert className="mt-0.5 size-4 shrink-0 text-danger" />
                  <p>{conversationError}</p>
                </div>
              ) : null}

              {conversationLoading ? (
                <div className="flex min-h-[220px] items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/5 text-steel">
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="size-4 animate-spin" />
                    جار تحميل المحادثة...
                  </span>
                </div>
              ) : activeConversation && activeConversation.specialistId === selectedSpecialist.id ? (
                <div className="space-y-5">
                  <div className="rounded-[1.6rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs tracking-[0.16em] text-steel">مرجع المحادثة</p>
                        <p className="mt-2 font-heading text-3xl text-white">{activeConversation.reference}</p>
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
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[1.2rem] border border-white/10 bg-midnight/50 p-4">
                        <p className="text-xs tracking-[0.14em] text-steel">العنوان</p>
                        <p className="mt-2 font-semibold text-white">{activeConversation.issueTitle}</p>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/10 bg-midnight/50 p-4">
                        <p className="text-xs tracking-[0.14em] text-steel">آخر تحديث</p>
                        <p className="mt-2 font-semibold text-white">
                          {formatArabicDateTime(activeConversation.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-steel">{activeConversation.verificationNote}</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm font-semibold text-white">بيانات التحقق الأولي</p>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-[1.2rem] border border-white/10 bg-midnight/40 p-4">
                        <p className="text-xs text-steel">الاسم</p>
                        <p className="mt-2 text-white">{activeConversation.client.name}</p>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/10 bg-midnight/40 p-4">
                        <p className="text-xs text-steel">البريد الإلكتروني</p>
                        <p className="mt-2 text-white" dir="ltr">
                          {activeConversation.client.email}
                        </p>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/10 bg-midnight/40 p-4">
                        <p className="text-xs text-steel">رقم الجوال</p>
                        <p className="mt-2 text-white" dir="ltr">
                          {activeConversation.client.phone}
                        </p>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/10 bg-midnight/40 p-4">
                        <p className="text-xs text-steel">الجهة والصفة</p>
                        <p className="mt-2 text-white">
                          {activeConversation.client.organization} / {activeConversation.client.role}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-white">المحادثة</p>
                        <p className="mt-1 text-sm text-steel">
                          الردود التي يكتبها المختص من بوابته ستظهر هنا مباشرة عند تحديث الصفحة أو استعادة
                          المحادثة.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {activeConversation.messages.map((message) => {
                        const isClient = message.sender === "client";
                        const isSystem = message.sender === "system";

                        return (
                          <article
                            key={message.id}
                            className={cn(
                              "rounded-[1.35rem] border p-4",
                              isClient
                                ? "border-cyanGlow/20 bg-cyanGlow/10"
                                : isSystem
                                  ? "border-white/10 bg-midnight/50"
                                  : "border-emerald-400/20 bg-emerald-400/10",
                            )}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-white">{message.senderName}</p>
                              <p className="text-xs text-steel">{formatArabicDateTime(message.sentAt)}</p>
                            </div>
                            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-100">
                              {message.body}
                            </p>
                          </article>
                        );
                      })}
                    </div>
                  </div>

                  <form onSubmit={sendClientMessage} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <label className="grid gap-2 text-sm text-steel">
                      أرسل متابعة أو تفاصيل إضافية
                      <textarea
                        value={messageDraft}
                        onChange={(event) => setMessageDraft(event.target.value)}
                        rows={5}
                        className="w-full rounded-[1.5rem] border border-white/10 bg-midnight/40 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                        placeholder="أضف تفاصيل جديدة، نتائج الفحص، أو أي توضيح يحتاجه المختص."
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={messageSubmitting}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {messageSubmitting ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin" />
                          جار الإرسال...
                        </>
                      ) : (
                        <>
                          إرسال الرسالة
                          <MessageSquareText className="size-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <form onSubmit={submitRating} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-white">قيّم هذا المختص</p>
                      <p className="text-sm leading-7 text-steel">
                        التقييم هنا مرتبط مباشرة بمرجع المحادثة الحالي حتى يكون أقرب للتجربة الحقيقية.
                      </p>
                    </div>

                    {alreadyRatedCurrentConversation ? (
                      <div className="mt-4 rounded-[1.35rem] border border-success/30 bg-success/10 px-4 py-3 text-sm text-emerald-100">
                        تم تسجيل تقييم لهذا المرجع مسبقًا، ولن يظهر نموذج تقييم إضافي لنفس المحادثة.
                      </div>
                    ) : (
                      <>
                        <label className="mt-4 grid gap-2 text-sm text-steel">
                          نطاق الخدمة أو نوع المشكلة
                          <input
                            value={ratingForm.serviceArea}
                            onChange={(event) => setRatingField("serviceArea", event.target.value)}
                            className="w-full rounded-[1.35rem] border border-white/10 bg-midnight/40 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                            placeholder="مثال: اختراق بريد الشركة"
                          />
                          {ratingErrors.serviceArea ? (
                            <span className="text-xs text-danger">{ratingErrors.serviceArea}</span>
                          ) : null}
                        </label>

                        <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-midnight/40 p-4">
                          <p className="text-sm font-semibold text-white">عدد النجوم</p>
                          <div className="mt-4 flex flex-wrap gap-3">
                            {Array.from({ length: 5 }).map((_, index) => {
                              const rating = index + 1;
                              const active = ratingForm.rating >= rating;

                              return (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => setRatingField("rating", rating)}
                                  className={cn(
                                    "rounded-2xl border px-4 py-3 text-sm transition",
                                    active
                                      ? "border-cyanGlow/25 bg-cyanGlow/10 text-cyanGlow"
                                      : "border-white/10 bg-white/5 text-steel hover:text-white",
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

                        <label className="mt-4 grid gap-2 text-sm text-steel">
                          تعليقك على المختص
                          <textarea
                            value={ratingForm.comment}
                            onChange={(event) => setRatingField("comment", event.target.value)}
                            rows={5}
                            className="w-full rounded-[1.5rem] border border-white/10 bg-midnight/40 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                            placeholder="شارك رأيك في سرعة الاستجابة، وضوح التوجيه، وفهم المختص للحالة."
                          />
                          {ratingErrors.comment ? (
                            <span className="text-xs text-danger">{ratingErrors.comment}</span>
                          ) : null}
                        </label>

                        <button
                          type="submit"
                          disabled={ratingSubmitting}
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 px-5 py-4 text-sm font-bold text-cyanGlow transition hover:bg-cyanGlow/15 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {ratingSubmitting ? (
                            <>
                              <LoaderCircle className="size-4 animate-spin" />
                              جار حفظ التقييم...
                            </>
                          ) : (
                            "إرسال تقييم المختص"
                          )}
                        </button>
                      </>
                    )}

                    {ratingNotice ? (
                      <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-midnight/40 px-4 py-3 text-sm text-slate-100">
                        {ratingNotice}
                      </div>
                    ) : null}
                  </form>
                </div>
              ) : (
                <form onSubmit={submitRequest} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-2 text-sm text-steel">
                      الاسم الكامل
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

                    <label className="grid gap-2 text-sm text-steel">
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

                    <label className="grid gap-2 text-sm text-steel">
                      المدينة
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                        <input
                          value={requestForm.city}
                          onChange={(event) => setRequestField("city", event.target.value)}
                          className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-3.5 pl-4 pr-11 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                          placeholder="الرياض"
                        />
                      </div>
                      {requestErrors.city ? <span className="text-xs text-danger">{requestErrors.city}</span> : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel">
                      اسم الجهة أو المنشأة
                      <div className="relative">
                        <Building2 className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                        <input
                          value={requestForm.organization}
                          onChange={(event) => setRequestField("organization", event.target.value)}
                          className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-3.5 pl-4 pr-11 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                          placeholder="اسم الشركة أو الجهة"
                        />
                      </div>
                      {requestErrors.organization ? (
                        <span className="text-xs text-danger">{requestErrors.organization}</span>
                      ) : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel">
                      صفتك داخل الجهة
                      <div className="relative">
                        <UserCheck className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                        <input
                          value={requestForm.role}
                          onChange={(event) => setRequestField("role", event.target.value)}
                          className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-3.5 pl-4 pr-11 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                          placeholder="مثل: مسؤول تقنية أو مالك نشاط"
                        />
                      </div>
                      {requestErrors.role ? <span className="text-xs text-danger">{requestErrors.role}</span> : null}
                    </label>

                    <label className="grid gap-2 text-sm text-steel md:col-span-2">
                      عنوان المشكلة
                      <div className="relative">
                        <MessageSquareText className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                        <input
                          value={requestForm.issueTitle}
                          onChange={(event) => setRequestField("issueTitle", event.target.value)}
                          className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-3.5 pl-4 pr-11 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                          placeholder="مثال: اشتباه في اختراق بريد العمل"
                        />
                      </div>
                      {requestErrors.issueTitle ? (
                        <span className="text-xs text-danger">{requestErrors.issueTitle}</span>
                      ) : null}
                    </label>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm font-semibold text-white">مستوى الاستعجال</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {urgencyOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setRequestField("urgency", option.value)}
                          className={cn(
                            "rounded-[1.35rem] border p-4 text-right transition",
                            requestForm.urgency === option.value
                              ? "border-cyanGlow/25 bg-cyanGlow/10 text-cyanGlow"
                              : "border-white/10 bg-midnight/40 text-steel hover:text-white",
                          )}
                        >
                          <p className="font-semibold">{option.label}</p>
                          <p className="mt-2 text-xs leading-6 opacity-80">{option.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="grid gap-2 text-sm text-steel">
                    وصف المشكلة
                    <textarea
                      value={requestForm.issueDetails}
                      onChange={(event) => setRequestField("issueDetails", event.target.value)}
                      rows={7}
                      className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                      placeholder="اشرح للمختص ما الذي حدث، متى بدأ، وما المؤشرات التي لاحظتها، وما الذي جرّبته حتى الآن."
                    />
                    {requestErrors.issueDetails ? (
                      <span className="text-xs text-danger">{requestErrors.issueDetails}</span>
                    ) : null}
                  </label>

                  <div className="rounded-[1.5rem] border border-cyanGlow/15 bg-cyanGlow/10 p-5 text-sm leading-7 text-steel">
                    بعد الإرسال سيتم التحقق الأولي من تنسيق البيانات وإنشاء مرجع محادثة فريد، ثم يظهر لك سجل
                    المحادثة مع المختص المختار مباشرة داخل الصفحة.
                  </div>

                  <button
                    type="submit"
                    disabled={requestSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {requestSubmitting ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        جار فتح المحادثة...
                      </>
                    ) : (
                      <>
                        افتح محادثة مع المختص
                        <Sparkles className="size-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
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

        {ratingsError ? (
          <div className="mt-4 rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100">
            {ratingsError}
          </div>
        ) : null}
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
            const summary = ratingSummaryBySpecialist[specialist.id] ?? { average: 0, total: 0 };

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

                <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <p className="text-xs tracking-[0.14em] text-steel">تقييم المختص</p>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="flex gap-1 text-amber-300">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star
                            key={index}
                            className={cn("size-4", index < Math.round(summary.average) && "fill-current")}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-white">{summary.average.toFixed(1)}</span>
                      <span className="text-sm text-steel">
                        {summary.total > 0 ? `${summary.total} تقييمات` : "بدون تقييمات بعد"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => chooseSpecialist(specialist.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white"
                  >
                    اختر المختص
                    <Sparkles className="size-4" />
                  </button>
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
                    onClick={() => chooseSpecialist(specialist.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
                  >
                    افتح المحادثة
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : specialist.id)}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-midnight/40 px-5 py-4 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
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
