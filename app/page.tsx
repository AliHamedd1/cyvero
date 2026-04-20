import { ShieldCheck, Sparkles, Waypoints } from "lucide-react";

import { CategoryCard } from "@/components/category-card";
import { CTASection } from "@/components/cta-section";
import { HeroSection } from "@/components/hero-section";
import { SectionHeading } from "@/components/section-heading";
import { StatsStrip } from "@/components/stats-strip";
import { ThreatCard } from "@/components/threat-card";
import { getAllCategories, getAllThreats, getFeaturedThreats, getHomeStats } from "@/lib/data";

const platformBenefits = [
  "محتوى عربي منظم ومهني يغطي التهديدات الأكثر أهمية.",
  "شرح دفاعي واضح يركز على الفهم والوقاية والاحتواء.",
  "خطوات استجابة أولية عملية وآمنة لكل تهديد أو حالة مشتبه بها.",
  "تحليل ذكي مبدئي قابل للتطوير وربطه لاحقًا بالذكاء الاصطناعي.",
  "مسار قانوني لطلب مساعدة من مختصين أمنيين عند الحاجة.",
];

export default function HomePage() {
  const categories = getAllCategories();
  const threats = getAllThreats();
  const featuredThreats = getFeaturedThreats();
  const stats = getHomeStats();

  return (
    <div className="space-y-20">
      <HeroSection />

      <section className="space-y-8">
        <SectionHeading
          eyebrow="التصنيفات الرئيسية"
          title="مكتبة عربية منظمة لخرائط التهديدات السيبرانية"
          description="تتوزع موسوعة Cyvero على عشرة تصنيفات تغطي الشبكات، الفدية، الحسابات، الويب، البيانات، البريد، والجوال، مع صفحات تفصيلية لكل تهديد وفلاتر قابلة للتوسعة."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              threatCount={threats.filter((threat) => threat.categorySlug === category.slug).length}
            />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="تهديدات شائعة"
          title="نقاط انطلاق سريعة لفهم المخاطر الأكثر تداولًا"
          description="هذه مجموعة بداية تعرض أشهر السيناريوهات الدفاعية التي يبحث عنها المستخدمون والفرق عند الاشتباه بوجود نشاط غير طبيعي."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredThreats.map((threat) => (
            <ThreatCard key={threat.slug} threat={threat} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="panel p-6 md:p-8">
          <SectionHeading
            eyebrow="لماذا Cyvero"
            title="هوية قوية لموقع دفاعي حديث"
            description="تم تصميم التجربة لتكون قراءة مريحة، تنقلًا واضحًا، وبطاقات تفاعلية تعطي المستخدم مسارًا عمليًا من الفهم إلى الوقاية ثم طلب المختص."
          />
          <div className="mt-6 grid gap-3">
            {platformBenefits.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-slate-100"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="panel-soft p-6">
            <div className="flex items-center gap-3 text-cyanGlow">
              <ShieldCheck className="size-5" />
              <span className="text-sm font-semibold">سياسة المحتوى</span>
            </div>
            <p className="mt-4 leading-8 text-steel">
              Cyvero لا يعرض أوامر هجومية أو أدوات استغلال أو خطوات اختراق. كل الصفحات مصممة
              لتقديم فهم دفاعي، احتواء آمن، واستجابة أولية مسؤولة.
            </p>
          </div>
          <div className="panel-soft p-6">
            <div className="flex items-center gap-3 text-cyanGlow">
              <Sparkles className="size-5" />
              <span className="text-sm font-semibold">جاهزية مستقبلية</span>
            </div>
            <p className="mt-4 leading-8 text-steel">
              البنية الحالية تفصل البيانات، الأنواع، المكونات، والأدوات المساعدة، ما يسهل إضافة
              لوحة تحكم، API للذكاء الاصطناعي، قاعدة بيانات، أو محتوى تحريري لاحقًا.
            </p>
          </div>
          <div className="panel-soft p-6">
            <div className="flex items-center gap-3 text-cyanGlow">
              <Waypoints className="size-5" />
              <span className="text-sm font-semibold">مسار استخدام واضح</span>
            </div>
            <p className="mt-4 leading-8 text-steel">
              ابدأ بالتصنيفات، اقرأ صفحة التهديد، استخدم تحليل الحالة الأولي عند الاشتباه، ثم صعّد
              لمختص عند ظهور مؤشرات خطورة أعلى أو أثر تشغيلي واضح.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-8">
        <SectionHeading
          eyebrow="إحصائيات شكلية"
          title="نواة موسوعة عربية للأمن السيبراني"
          description="تعكس هذه المؤشرات حجم النسخة الأولى من المشروع وطبيعة التغطية القابلة للتوسع لاحقًا."
        />
        <StatsStrip stats={stats} />
      </section>

      <CTASection
        title="ابدأ من التوعية، وانتقل إلى الاستجابة الآمنة بثقة"
        description="تصفح التصنيفات، حلّل حالتك بخطوات دفاعية أولية، أو اطلب مختصًا عندما تتطلب الحالة تصعيدًا قانونيًا وتقنيًا."
      />
    </div>
  );
}
