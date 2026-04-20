import { Metadata } from "next";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeading } from "@/components/section-heading";
import { siteConfig } from "@/data/site";

const aboutBlocks = [
  {
    title: "هدف المنصة",
    description:
      "إنشاء مرجع عربي احترافي يشرح التهديدات السيبرانية بلغة دفاعية واضحة، ويمنح المستخدمين والفرق نقطة بداية عملية للفهم والوقاية والاستجابة الأولية.",
  },
  {
    title: "الرؤية",
    description:
      "أن تصبح Cyvero نواة موسوعة عربية للأمن السيبراني توازن بين العمق المهني، سهولة القراءة، والتنظيم القابل للتوسع تقنيًا ومحتوًى.",
  },
  {
    title: "الرسالة",
    description:
      "تقديم محتوى عربي يركز على مؤشرات الخطر، الحماية، الاحتواء، والتصعيد المسؤول نحو المختصين، من دون أي توجيهات هجومية أو استخدامات غير قانونية.",
  },
  {
    title: "لماذا أُنشئت",
    description:
      "لأن كثيرًا من المحتوى العربي إما مبعثر أو غير منظم أو يخلط بين التوعية والاستغلال. Cyvero صُممت لتقدم مسارًا دفاعيًا ناضجًا وواضحًا من أول زيارة.",
  },
];

export const metadata: Metadata = {
  title: `من نحن | ${siteConfig.name}`,
  description: "تعرف على هدف Cyvero ورؤيتها ورسالتها وتركيزها الدفاعي في الأمن السيبراني.",
};

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <Breadcrumbs items={[{ label: "الرئيسية", href: "/" }, { label: "من نحن" }]} />
      <SectionHeading
        eyebrow="من نحن"
        title="Cyvero مشروع عربي دفاعي متخصص في الأمن السيبراني"
        description="تم بناء Cyvero لتكون منصة معرفية منظمة تشرح التهديدات والمخاطر والوقاية والاستجابة الأولية، مع التزام واضح بعدم تقديم أي خدمات هجومية أو غير قانونية."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {aboutBlocks.map((block) => (
          <div key={block.title} className="panel cyber-card p-6 md:p-8">
            <h2 className="font-heading text-3xl text-white">{block.title}</h2>
            <p className="mt-4 leading-8 text-steel">{block.description}</p>
          </div>
        ))}
      </div>

      <div className="panel-soft cyber-card p-6 md:p-8">
        <h2 className="font-heading text-3xl text-white">الالتزام المهني</h2>
        <p className="mt-4 leading-8 text-steel">
          يركز Cyvero على الأمن السيبراني الدفاعي فقط: الوعي، الوقاية، المؤشرات التحذيرية،
          الاحتواء، الاستجابة الأولية، والتوجيه إلى مختصين عند الحاجة. المنصة لا تعرض أوامر هجومية،
          أدوات استغلال، أو خطوات يمكن استخدامها بشكل غير قانوني أو ضار.
        </p>
      </div>
    </div>
  );
}
