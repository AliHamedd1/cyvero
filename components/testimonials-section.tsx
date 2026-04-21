import { Quote, Star } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";

const testimonials = [
  {
    name: "مستخدم تجريبي",
    role: "مهتم بالتوعية الرقمية",
    quote: "منصة مرتبة وسهلة وتوضح التهديدات بشكل ممتاز",
  },
  {
    name: "متدرب مبتدئ",
    role: "بداية في الأمن السيبراني",
    quote: "التقسيم واضح جدًا والمحتوى مفيد للمبتدئين",
  },
  {
    name: "صاحب مشروع صغير",
    role: "يبحث عن حماية عملية",
    quote: "فكرة قوية جدًا خصوصًا في جانب التوعية والحماية",
  },
  {
    name: "زائر تقني",
    role: "تجربة استخدام",
    quote: "واجهة احترافية وسهلة الاستخدام",
  },
];

export function TestimonialsSection() {
  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="آراء المستخدمين"
        title="تقييمات أولية تعكس وضوح التجربة داخل Cyvero"
        description="هذه آراء تجريبية مبدئية تبرز قيمة الترتيب والوضوح والطابع الدفاعي في المنصة، مع تصميم متناسق مع هوية Cyvero الحديثة."
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {testimonials.map((item) => (
          <article
            key={`${item.name}-${item.role}`}
            className="panel cyber-card flex h-full flex-col justify-between overflow-hidden p-6 transition duration-300 hover:-translate-y-1.5 hover:border-cyanGlow/25 hover:shadow-glow"
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="size-4 fill-current" />
                  ))}
                </div>
                <div className="rounded-2xl border border-cyanGlow/15 bg-cyanGlow/10 p-3 text-cyanGlow">
                  <Quote className="size-4" />
                </div>
              </div>
              <p className="text-base leading-8 text-slate-100">&ldquo;{item.quote}&rdquo;</p>
            </div>
            <div className="mt-6 border-t border-white/8 pt-4">
              <p className="font-semibold text-white">{item.name}</p>
              <p className="mt-1 text-sm text-steel">{item.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
