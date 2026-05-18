import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpLeft, Search } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SearchBar } from "@/components/search-bar";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";
import { getSearchResults } from "@/lib/site-search";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function SearchGroup({
  title,
  items,
}: {
  title: string;
  items: ReturnType<typeof getSearchResults>["threats"];
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-cyanGlow/20 bg-cyanGlow/10 p-3 text-cyanGlow">
          <Search className="size-4" />
        </div>
        <h2 className="font-heading text-2xl text-white">{title}</h2>
      </div>
      {items.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Link
              key={`${item.kind}-${item.id}`}
              href={item.href}
              className="panel-soft cyber-card overflow-hidden p-5 transition hover:-translate-y-1 hover:border-cyanGlow/25"
            >
              <p className="text-sm text-cyanGlow">{item.subtitle}</p>
              <h3 className="mt-3 font-heading text-2xl text-white">{item.title}</h3>
              <p className="mt-3 leading-7 text-steel">{item.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-cyanGlow">
                فتح المسار
                <ArrowUpLeft className="size-4" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 px-5 py-6 text-sm text-steel">
          لا توجد نتائج في هذا القسم.
        </div>
      )}
    </section>
  );
}

export const metadata: Metadata = {
  title: `البحث | ${siteConfig.name}`,
  description: "صفحة بحث موحدة في Cyvero تشمل التهديدات والتصنيفات والمختصين والاشتراكات وحلول الشركات.",
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const results = getSearchResults(query);

  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "البحث" }]} />

      <section className="panel overflow-hidden p-6 md:p-8">
        <div className="space-y-5">
          <SectionHeading
            eyebrow="البحث الذكي"
            title="ابحث عبر التهديدات والتصنيفات والمختصين والاشتراكات من صفحة موحدة"
            description="تم تطوير البحث في Cyvero 2.0 ليعرض نتائج مباشرة ومرتبة ويساعد الزائر على الانتقال إلى المسار الأنسب دون تشتيت."
          />
          <SearchBar action="/search" defaultValue={query} placeholder="ابحث عن تهديد أو مختص أو اشتراك أو حل شركة" />
        </div>
      </section>

      {query ? (
        <>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 px-5 py-4 text-sm text-steel">
            عدد النتائج الحالية: <span className="text-white">{results.total}</span> للبحث عن{" "}
            <span className="text-cyanGlow">{query}</span>
          </div>

          <SearchGroup title="التهديدات" items={results.threats} />
          <SearchGroup title="التصنيفات" items={results.categories} />
          <SearchGroup title="المختصون" items={results.specialists} />
          <SearchGroup title="الاشتراكات" items={results.subscriptions} />
          <SearchGroup title="حلول الشركات" items={results.business} />
        </>
      ) : (
        <div className="panel p-8 text-center">
          <p className="font-heading text-3xl text-white">ابدأ بكتابة ما تبحث عنه</p>
          <p className="mt-3 leading-8 text-steel">
            يمكنك البحث عن تهديد رقمي، تصنيف، مختص، باقة اشتراك، أو مسار مبيعات للشركات.
          </p>
        </div>
      )}
    </div>
  );
}
