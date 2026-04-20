import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "start" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "start",
}: SectionHeadingProps) {
  return (
    <div className={cn("space-y-3", align === "center" && "mx-auto max-w-3xl text-center")}>
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="font-heading text-3xl leading-tight text-white md:text-4xl lg:text-[2.7rem]">
        {title}
      </h2>
      {description ? (
        <p className="max-w-3xl text-base leading-8 text-steel md:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
