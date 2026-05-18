"use client";

import {
  ActivitySquare,
  CheckCircle2,
  FolderKanban,
  LogOut,
  Search,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { adminIncidents, incidentStatusMap } from "@/data/admin";
import { ADMIN_SESSION_KEY } from "@/lib/prototype";
import { cn, normalizeArabicText, severityMap } from "@/lib/utils";
import { IncidentStatus, Severity } from "@/types/cyber";

const incidentTypes = Array.from(new Set(adminIncidents.map((incident) => incident.type)));

const severityFilters: Array<{ value: Severity | "all"; label: string }> = [
  { value: "all", label: "كل المستويات" },
  { value: "low", label: "منخفض" },
  { value: "medium", label: "متوسط" },
  { value: "high", label: "مرتفع" },
  { value: "critical", label: "حرج" },
];

const statusFilters: Array<{ value: IncidentStatus | "all"; label: string }> = [
  { value: "all", label: "كل الحالات" },
  { value: "open", label: "مفتوح" },
  { value: "investigating", label: "قيد التحقيق" },
  { value: "contained", label: "تم الاحتواء" },
  { value: "closed", label: "مغلق" },
];

const statCards = [
  {
    key: "total",
    title: "عدد البلاغات",
    icon: FolderKanban,
    value: adminIncidents.length,
    tone: "border-white/10 bg-white/[0.04] text-white",
  },
  {
    key: "critical",
    title: "الحالات الحرجة",
    icon: ShieldAlert,
    value: adminIncidents.filter((incident) => incident.severity === "critical").length,
    tone: "border-danger/25 bg-danger/10 text-rose-100",
  },
  {
    key: "open",
    title: "الحالات المفتوحة",
    icon: ActivitySquare,
    value: adminIncidents.filter((incident) => incident.status !== "closed").length,
    tone: "border-cyanGlow/20 bg-cyanGlow/10 text-cyanGlow",
  },
  {
    key: "closed",
    title: "الحالات المغلقة",
    icon: CheckCircle2,
    value: adminIncidents.filter((incident) => incident.status === "closed").length,
    tone: "border-success/25 bg-success/10 text-success",
  },
];

export function AdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const isAuthenticated = window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "authenticated";

    if (!isAuthenticated) {
      router.replace("/admin-login");
      return;
    }

    setAuthorized(true);
  }, [router]);

  function resetFilters() {
    setSearch("");
    setSeverityFilter("all");
    setStatusFilter("all");
    setTypeFilter("all");
  }

  function logout() {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    router.push("/admin-login");
  }

  if (authorized === null) {
    return (
      <div className="panel flex min-h-[320px] items-center justify-center p-8 text-center">
        <div className="space-y-3">
          <p className="font-heading text-3xl text-white">جارٍ تجهيز لوحة الأدمن</p>
          <p className="text-steel">يتم التحقق من جلسة الدخول التجريبية قبل عرض البيانات.</p>
        </div>
      </div>
    );
  }

  const normalizedSearch = normalizeArabicText(search);

  const filteredIncidents = adminIncidents.filter((incident) => {
    if (severityFilter !== "all" && incident.severity !== severityFilter) {
      return false;
    }

    if (statusFilter !== "all" && incident.status !== statusFilter) {
      return false;
    }

    if (typeFilter !== "all" && incident.type !== typeFilter) {
      return false;
    }

    if (!normalizedSearch) {
      return true;
    }

    const searchableText = normalizeArabicText(
      [
        incident.id,
        incident.type,
        incident.category,
        incident.organization,
        incident.affectedSystem,
        incident.summary,
      ].join(" "),
    );

    return searchableText.includes(normalizedSearch);
  });

  return (
    <section className="grid gap-6 xl:grid-cols-[290px_1fr]">
      <aside className="panel-soft cyber-card h-fit p-6 xl:sticky xl:top-24">
        <div className="space-y-6">
          <div>
            <div className="eyebrow inline-flex items-center gap-2">
              <ShieldAlert className="size-4" />
              Security Operations
            </div>
            <h3 className="mt-4 font-heading text-3xl text-white">لوحة إدارة الطلبات والبلاغات</h3>
            <p className="mt-3 text-sm leading-7 text-steel">
              هذه الصفحة تعرض نموذج Dashboard تجريبي بطابع مؤسسي واضح، مع بحث وفلاتر وإحصاءات قابلة للعرض في
              العروض الأكاديمية والاستثمارية.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <SlidersHorizontal className="size-4 text-cyanGlow" />
              الفلاتر والبحث
            </div>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-2 text-xs font-semibold text-steel">
                البحث عن البلاغات أو الطلبات
                <div className="relative">
                  <Search className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-cyanGlow" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="ابحث برقم البلاغ أو الجهة أو النظام"
                    className="control-field py-3 pl-4 pr-11"
                  />
                </div>
              </label>

              <label className="grid gap-2 text-xs font-semibold text-steel">
                الخطورة
                <select
                  value={severityFilter}
                  onChange={(event) => setSeverityFilter(event.target.value as Severity | "all")}
                  className="control-field py-3"
                >
                  {severityFilters.map((item) => (
                    <option key={item.value} value={item.value} className="bg-slatecore text-white">
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-xs font-semibold text-steel">
                الحالة
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as IncidentStatus | "all")}
                  className="control-field py-3"
                >
                  {statusFilters.map((item) => (
                    <option key={item.value} value={item.value} className="bg-slatecore text-white">
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-xs font-semibold text-steel">
                النوع
                <select
                  value={typeFilter}
                  onChange={(event) => setTypeFilter(event.target.value)}
                  className="control-field py-3"
                >
                  <option value="all" className="bg-slatecore text-white">
                    كل الأنواع
                  </option>
                  {incidentTypes.map((type) => (
                    <option key={type} value={type} className="bg-slatecore text-white">
                      {type}
                    </option>
                  ))}
                </select>
              </label>

              <button type="button" onClick={resetFilters} className="btn-secondary justify-center px-4 py-3">
                إعادة ضبط الفلاتر
              </button>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 text-sm leading-7 text-steel">
            يعرض الجدول حاليًا <span className="text-white">{filteredIncidents.length}</span> من أصل
            <span className="text-white"> {adminIncidents.length} </span>
            بلاغًا/طلبًا تجريبيًا.
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-danger/25 bg-danger/10 px-5 py-4 text-sm font-semibold text-rose-100 transition hover:bg-danger/20"
          >
            <LogOut className="size-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.key} className={cn("rounded-[1.45rem] border p-5 shadow-panel", item.tone)}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="mt-3 font-heading text-4xl">{item.value}</p>
                  </div>
                  <div className="rounded-[1.1rem] border border-current/20 bg-black/10 p-3">
                    <Icon className="size-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="panel cyber-card overflow-hidden p-6">
          <div className="flex flex-col gap-3 border-b border-white/8 pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-heading text-3xl text-white">الطلبات والبلاغات التجريبية</h3>
              <p className="mt-2 text-sm leading-7 text-steel">
                البحث والتصفية يعملان مباشرة داخل الواجهة لفرز الطلبات والبلاغات حسب الخطورة والحالة والنوع.
              </p>
            </div>
            <div className="rounded-full border border-cyanGlow/20 bg-cyanGlow/10 px-4 py-2 text-sm text-cyanGlow">
              {filteredIncidents.length} نتيجة معروضة
            </div>
          </div>

          {filteredIncidents.length === 0 ? (
            <div className="flex min-h-[240px] items-center justify-center p-8 text-center">
              <div className="space-y-3">
                <p className="font-heading text-2xl text-white">لا توجد نتائج مطابقة</p>
                <p className="text-steel">جرّب توسيع البحث أو إعادة ضبط الفلاتر لعرض البلاغات مجددًا.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="hidden overflow-hidden xl:block">
                <div className="mt-5 overflow-x-auto rounded-[1.4rem] border border-white/10">
                  <table className="w-full min-w-[980px] text-right text-sm">
                    <thead className="bg-white/[0.04] text-steel">
                      <tr>
                        <th className="px-4 py-4 font-semibold">رقم الطلب/البلاغ</th>
                        <th className="px-4 py-4 font-semibold">النوع</th>
                        <th className="px-4 py-4 font-semibold">التصنيف</th>
                        <th className="px-4 py-4 font-semibold">الخطورة</th>
                        <th className="px-4 py-4 font-semibold">الجهة</th>
                        <th className="px-4 py-4 font-semibold">النظام المتأثر</th>
                        <th className="px-4 py-4 font-semibold">الحالة</th>
                        <th className="px-4 py-4 font-semibold">تاريخ البلاغ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIncidents.map((incident) => {
                        const severity = severityMap[incident.severity];
                        const status = incidentStatusMap[incident.status];

                        return (
                          <tr
                            key={incident.id}
                            className="border-t border-white/8 transition hover:bg-white/[0.04]"
                            title={incident.summary}
                          >
                            <td className="px-4 py-4 font-semibold text-white">{incident.id}</td>
                            <td className="px-4 py-4 text-slate-100">{incident.type}</td>
                            <td className="px-4 py-4 text-steel">{incident.category}</td>
                            <td className="px-4 py-4">
                              <span className={cn("rounded-full border px-3 py-1 text-xs", severity.className)}>
                                {severity.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-slate-100">{incident.organization}</td>
                            <td className="px-4 py-4 text-steel">{incident.affectedSystem}</td>
                            <td className="px-4 py-4">
                              <span className={cn("rounded-full border px-3 py-1 text-xs", status.className)}>
                                {status.label}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-steel">{incident.reportedAt}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-5 grid gap-4 xl:hidden">
                {filteredIncidents.map((incident) => {
                  const severity = severityMap[incident.severity];
                  const status = incidentStatusMap[incident.status];

                  return (
                    <article key={incident.id} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs tracking-[0.16em] text-steel">{incident.id}</p>
                          <h4 className="mt-2 font-heading text-2xl text-white">{incident.type}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className={cn("rounded-full border px-3 py-1 text-xs", severity.className)}>
                            {severity.label}
                          </span>
                          <span className={cn("rounded-full border px-3 py-1 text-xs", status.className)}>
                            {status.label}
                          </span>
                        </div>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-steel">{incident.summary}</p>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[1.2rem] border border-white/10 bg-midnight/50 p-3">
                          <p className="text-xs text-steel">التصنيف</p>
                          <p className="mt-1 text-sm text-white">{incident.category}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 bg-midnight/50 p-3">
                          <p className="text-xs text-steel">الجهة</p>
                          <p className="mt-1 text-sm text-white">{incident.organization}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 bg-midnight/50 p-3">
                          <p className="text-xs text-steel">النظام المتأثر</p>
                          <p className="mt-1 text-sm text-white">{incident.affectedSystem}</p>
                        </div>
                        <div className="rounded-[1.2rem] border border-white/10 bg-midnight/50 p-3">
                          <p className="text-xs text-steel">تاريخ البلاغ</p>
                          <p className="mt-1 text-sm text-white">{incident.reportedAt}</p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
