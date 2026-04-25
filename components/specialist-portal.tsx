"use client";

import {
  LoaderCircle,
  LogOut,
  MessageSquareText,
  Search,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { SPECIALIST_SESSION_KEY, formatArabicDateTime } from "@/lib/prototype";
import { cn, normalizeArabicText } from "@/lib/utils";
import {
  SpecialistConversation,
  SpecialistConversationStatus,
  SpecialistRating,
  SpecialistSession,
} from "@/types/cyber";

const statusMap: Record<
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

async function parseApiResponse<T extends { error?: string }>(response: Response) {
  const payload = (await response.json()) as T;

  if (!response.ok) {
    throw new Error(payload.error || "تعذر تنفيذ العملية حاليًا.");
  }

  return payload;
}

function buildRatingSummary(ratings: SpecialistRating[]) {
  const total = ratings.length;
  const average = total > 0 ? ratings.reduce((sum, item) => sum + item.rating, 0) / total : 0;

  return {
    total,
    average,
  };
}

export function SpecialistPortal() {
  const router = useRouter();
  const [session, setSession] = useState<SpecialistSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | SpecialistConversationStatus>("all");
  const [conversations, setConversations] = useState<SpecialistConversation[]>([]);
  const [ratings, setRatings] = useState<SpecialistRating[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const stored = window.sessionStorage.getItem(SPECIALIST_SESSION_KEY);

    if (!stored) {
      router.replace("/specialists/login");
      return;
    }

    try {
      setSession(JSON.parse(stored) as SpecialistSession);
    } catch {
      window.sessionStorage.removeItem(SPECIALIST_SESSION_KEY);
      router.replace("/specialists/login");
      return;
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (!session) {
      return;
    }

    let active = true;
    const currentSession = session;

    async function loadPortalData() {
      setLoading(true);

      try {
        const [conversationsResponse, ratingsResponse] = await Promise.all([
          fetch(`/api/specialist-conversations?specialistId=${encodeURIComponent(currentSession.specialistId)}`, {
            cache: "no-store",
          }),
          fetch(`/api/specialist-ratings?specialistId=${encodeURIComponent(currentSession.specialistId)}`, {
            cache: "no-store",
          }),
        ]);

        const conversationsPayload = await parseApiResponse<{
          conversations: SpecialistConversation[];
          error?: string;
        }>(conversationsResponse);
        const ratingsPayload = await parseApiResponse<{
          ratings: SpecialistRating[];
          error?: string;
        }>(ratingsResponse);

        if (active) {
          setConversations(conversationsPayload.conversations ?? []);
          setRatings(ratingsPayload.ratings ?? []);
          setError("");
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "تعذر تحميل بيانات البوابة.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPortalData();

    return () => {
      active = false;
    };
  }, [session]);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = normalizeArabicText(search);

    return conversations.filter((conversation) => {
      const matchesStatus = statusFilter === "all" || conversation.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchableText = normalizeArabicText(
        [
          conversation.reference,
          conversation.client.name,
          conversation.client.organization,
          conversation.issueTitle,
          conversation.issueDetails,
        ].join(" "),
      );

      return searchableText.includes(normalizedSearch);
    });
  }, [conversations, search, statusFilter]);

  useEffect(() => {
    if (!filteredConversations.length) {
      setSelectedConversationId(null);
      return;
    }

    if (!selectedConversationId || !filteredConversations.some((item) => item.id === selectedConversationId)) {
      setSelectedConversationId(filteredConversations[0].id);
    }
  }, [filteredConversations, selectedConversationId]);

  const selectedConversation =
    filteredConversations.find((conversation) => conversation.id === selectedConversationId) ?? null;

  const ratingSummary = buildRatingSummary(ratings);
  const pendingCount = conversations.filter((conversation) => conversation.status === "pending").length;
  const activeCount = conversations.filter((conversation) => conversation.status === "active").length;
  const closedCount = conversations.filter((conversation) => conversation.status === "closed").length;

  async function refreshSelectedConversation(conversationId: string) {
    const response = await fetch(`/api/specialist-conversations/${conversationId}`, { cache: "no-store" });
    const payload = await parseApiResponse<{ conversation: SpecialistConversation; error?: string }>(response);
    setConversations((current) =>
      current.map((item) => (item.id === payload.conversation.id ? payload.conversation : item)),
    );
  }

  async function sendReply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedConversation || replyDraft.trim().length < 3) {
      setError("يرجى كتابة رد واضح قبل الإرسال.");
      return;
    }

    setReplySubmitting(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/specialist-conversations/${selectedConversation.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "specialist",
          senderName: session?.specialistName,
          body: replyDraft,
        }),
      });
      const payload = await parseApiResponse<{ conversation: SpecialistConversation; error?: string }>(response);

      setConversations((current) =>
        current.map((item) => (item.id === payload.conversation.id ? payload.conversation : item)),
      );
      setReplyDraft("");
      setNotice("تم إرسال رد المختص إلى قناة العميل بنجاح.");
    } catch (replyError) {
      setError(replyError instanceof Error ? replyError.message : "تعذر إرسال الرد.");
    } finally {
      setReplySubmitting(false);
    }
  }

  async function updateStatus(status: SpecialistConversationStatus) {
    if (!selectedConversation) {
      return;
    }

    setStatusSubmitting(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/specialist-conversations/${selectedConversation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const payload = await parseApiResponse<{ conversation: SpecialistConversation; error?: string }>(response);

      setConversations((current) =>
        current.map((item) => (item.id === payload.conversation.id ? payload.conversation : item)),
      );
      setNotice("تم تحديث حالة المحادثة.");
      await refreshSelectedConversation(payload.conversation.id);
    } catch (statusError) {
      setError(statusError instanceof Error ? statusError.message : "تعذر تحديث الحالة.");
    } finally {
      setStatusSubmitting(false);
    }
  }

  function handleLogout() {
    window.sessionStorage.removeItem(SPECIALIST_SESSION_KEY);
    router.push("/specialists/login");
  }

  if (loading && !session) {
    return (
      <div className="flex min-h-[360px] items-center justify-center rounded-[1.8rem] border border-white/10 bg-white/5">
        <span className="inline-flex items-center gap-2 text-steel">
          <LoaderCircle className="size-4 animate-spin" />
          جار تجهيز بوابة المختص...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="panel cyber-card overflow-hidden p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
                <ShieldCheck className="size-4" />
                بوابة المختص
              </div>
              <h3 className="font-heading text-4xl text-white">{session?.specialistName}</h3>
              <p className="text-sm text-steel" dir="ltr">
                {session?.username}
              </p>
              <p className="leading-8 text-steel">
                من هذه البوابة يمكن للمختص مراجعة الطلبات الواردة إليه، إدارة حالة المحادثات، والرد على
                العملاء داخل النسخة التجريبية الحالية.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10"
            >
              <LogOut className="size-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="panel-soft cyber-card p-5">
            <p className="text-sm text-steel">كل المحادثات</p>
            <p className="mt-3 font-heading text-4xl text-white">{conversations.length}</p>
          </div>
          <div className="panel-soft cyber-card p-5">
            <p className="text-sm text-steel">بانتظار المختص</p>
            <p className="mt-3 font-heading text-4xl text-white">{pendingCount}</p>
          </div>
          <div className="panel-soft cyber-card p-5">
            <p className="text-sm text-steel">المحادثات النشطة</p>
            <p className="mt-3 font-heading text-4xl text-white">{activeCount}</p>
          </div>
          <div className="panel-soft cyber-card p-5">
            <p className="text-sm text-steel">متوسط التقييم</p>
            <p className="mt-3 font-heading text-4xl text-white">{ratingSummary.average.toFixed(1)}</p>
            <p className="mt-2 text-xs text-steel">
              {ratingSummary.total} تقييمات مرتبطة بالمراجع · {closedCount} حالات مغلقة
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-5">
          <div className="panel cyber-card overflow-hidden p-6">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <label className="grid gap-2 text-sm text-steel">
                البحث داخل الطلبات
                <div className="relative">
                  <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="ابحث بالمرجع أو اسم العميل أو المشكلة"
                    className="w-full rounded-[1.35rem] border border-white/10 bg-white/5 py-3.5 pl-4 pr-11 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                  />
                </div>
              </label>

              <label className="grid gap-2 text-sm text-steel">
                تصفية بالحالة
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as "all" | SpecialistConversationStatus)}
                  className="rounded-[1.35rem] border border-white/10 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                >
                  <option value="all" className="bg-slatecore text-white">
                    كل الحالات
                  </option>
                  {Object.entries(statusMap).map(([value, item]) => (
                    <option key={value} value={value} className="bg-slatecore text-white">
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="panel cyber-card overflow-hidden p-4">
            <div className="space-y-3">
              {loading ? (
                <div className="flex min-h-[180px] items-center justify-center text-steel">
                  <span className="inline-flex items-center gap-2">
                    <LoaderCircle className="size-4 animate-spin" />
                    جار تحميل المحادثات...
                  </span>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-cyanGlow/20 bg-cyanGlow/10 p-6 text-center">
                  <p className="font-heading text-2xl text-white">لا توجد محادثات مطابقة</p>
                  <p className="mt-3 leading-8 text-steel">جرّب توسيع البحث أو تغيير فلتر الحالة.</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedConversationId(conversation.id)}
                    className={cn(
                      "w-full rounded-[1.45rem] border p-4 text-right transition",
                      selectedConversationId === conversation.id
                        ? "border-cyanGlow/25 bg-cyanGlow/10"
                        : "border-white/10 bg-white/5 hover:border-cyanGlow/20 hover:bg-cyanGlow/5",
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{conversation.reference}</p>
                        <p className="mt-1 text-sm text-steel">{conversation.client.name}</p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full border px-3 py-1 text-xs",
                          statusMap[conversation.status].className,
                        )}
                      >
                        {statusMap[conversation.status].label}
                      </span>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-cyanGlow">{conversation.issueTitle}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-steel">
                      {conversation.issueDetails}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-steel">
                      <span>{conversation.client.organization}</span>
                      <span>{formatArabicDateTime(conversation.updatedAt)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {error ? (
            <div className="rounded-[1.35rem] border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-rose-100">
              {error}
            </div>
          ) : null}

          {notice ? (
            <div className="rounded-[1.35rem] border border-success/30 bg-success/10 px-4 py-3 text-sm text-emerald-100">
              {notice}
            </div>
          ) : null}

          {selectedConversation ? (
            <>
              <section className="panel cyber-card overflow-hidden p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-[0.14em] text-steel">مرجع الطلب</p>
                    <h3 className="mt-2 font-heading text-3xl text-white">{selectedConversation.reference}</h3>
                    <p className="mt-3 text-sm font-semibold text-cyanGlow">{selectedConversation.issueTitle}</p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs",
                      statusMap[selectedConversation.status].className,
                    )}
                  >
                    {statusMap[selectedConversation.status].label}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-steel">العميل</p>
                    <p className="mt-2 text-white">{selectedConversation.client.name}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-steel">الجهة</p>
                    <p className="mt-2 text-white">{selectedConversation.client.organization}</p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-steel">البريد الإلكتروني</p>
                    <p className="mt-2 text-white" dir="ltr">
                      {selectedConversation.client.email}
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-steel">الجوال</p>
                    <p className="mt-2 text-white" dir="ltr">
                      {selectedConversation.client.phone}
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-[1.35rem] border border-cyanGlow/15 bg-cyanGlow/10 p-4 text-sm leading-7 text-steel">
                  {selectedConversation.verificationNote}
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => void updateStatus("pending")}
                    disabled={statusSubmitting}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    تحويل إلى بانتظار المختص
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateStatus("active")}
                    disabled={statusSubmitting}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    جعل المحادثة نشطة
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateStatus("awaiting-client")}
                    disabled={statusSubmitting}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-cyanGlow/20 hover:bg-cyanGlow/10 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    بانتظار العميل
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateStatus("closed")}
                    disabled={statusSubmitting}
                    className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    إغلاق الحالة
                  </button>
                </div>
              </section>

              <section className="panel cyber-card overflow-hidden p-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-cyanGlow">
                    <MessageSquareText className="size-4" />
                    <span className="text-sm font-semibold">سجل المحادثة</span>
                  </div>
                  <div className="space-y-3">
                    {selectedConversation.messages.map((message) => (
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
                </div>
              </section>

              <form onSubmit={sendReply} className="panel cyber-card overflow-hidden p-6">
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-white">رد المختص</p>
                    <p className="mt-2 text-sm leading-7 text-steel">
                      أرسل تحديثك أو طلبك لمعلومات إضافية، وسيظهر مباشرة في قناة العميل.
                    </p>
                  </div>

                  <label className="grid gap-2 text-sm text-steel">
                    نص الرد
                    <textarea
                      value={replyDraft}
                      onChange={(event) => setReplyDraft(event.target.value)}
                      rows={6}
                      className="w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-cyanGlow/35 focus:bg-white/8"
                      placeholder="مثل: راجعنا المؤشرات الأولية ونحتاج إلى لقطات من السجلات أو وقت حدوث المشكلة بشكل أدق."
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={replySubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyanGlow px-5 py-4 text-sm font-bold text-slate-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {replySubmitting ? (
                      <>
                        <LoaderCircle className="size-4 animate-spin" />
                        جار إرسال الرد...
                      </>
                    ) : (
                      "إرسال رد المختص"
                    )}
                  </button>
                </div>
              </form>

              <section className="panel-soft cyber-card p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
                    <Star className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">تقييمات هذا المختص</p>
                    <p className="mt-1 text-sm text-steel">
                      متوسط {ratingSummary.average.toFixed(1)} من {ratingSummary.total} تقييمات
                    </p>
                  </div>
                </div>

                {ratings.length === 0 ? (
                  <p className="mt-4 text-sm leading-7 text-steel">
                    لا توجد تقييمات لهذا المختص بعد. ستظهر التقييمات هنا عندما يرسل العملاء مراجعات مرتبطة
                    بمراجع المحادثات.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {ratings.slice(0, 3).map((rating) => (
                      <article key={rating.id} className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-white">{rating.clientName}</p>
                            <p className="mt-1 text-xs text-steel">{rating.reference}</p>
                          </div>
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
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : (
            <div className="panel flex min-h-[320px] items-center justify-center p-8 text-center">
              <div className="space-y-3">
                <div className="inline-flex rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
                  <UserRound className="size-5" />
                </div>
                <p className="font-heading text-2xl text-white">اختر محادثة من القائمة</p>
                <p className="text-steel">سيظهر هنا ملف العميل، رسائل المحادثة، وأدوات الرد وإدارة الحالة.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 text-sm leading-7 text-steel">
        هذه البوابة تجريبية داخل الواجهة فقط، لكنها تعطي مسارًا كاملًا للمختص: دخول، استلام محادثات، ردود،
        حالات، وتقييمات مرتبطة بطلبات حقيقية داخل النسخة الحالية.
      </section>
    </div>
  );
}
