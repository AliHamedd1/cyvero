import { FooterLinkGroup, NavigationLink } from "@/types/cyber";

export const siteConfig = {
  name: "Cyvero",
  tagline: "منصة عربية للأمن السيبراني والحماية الرقمية",
  description:
    "Cyvero منصة متخصصة في التوعية بالتهديدات السيبرانية، الوقاية، الاستجابة الأولية، وطلب المساعدة من مختصين بشكل قانوني وآمن.",
  url: "https://cyvero.local",
};

export const navigationLinks: NavigationLink[] = [
  { label: "الرئيسية", href: "/" },
  { label: "التصنيفات", href: "/categories" },
  { label: "التهديدات", href: "/threats" },
  { label: "الاشتراكات", href: "/subscriptions" },
  { label: "حلّل حالتي", href: "/analyze" },
  { label: "المختصون", href: "/specialists" },
  { label: "اطلب مختص", href: "/request-expert" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل معنا", href: "/contact" },
];

export const socialLinks = [
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
  { label: "GitHub", href: "#" },
  { label: "YouTube", href: "#" },
];

export const legalLinks: NavigationLink[] = [
  { label: "سياسة الخصوصية", href: "/privacy-policy" },
  { label: "الشروط والأحكام", href: "/terms" },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "المنصة",
    links: navigationLinks,
  },
  {
    title: "قانوني",
    links: legalLinks,
  },
];

export const featuredMetrics = [
  { label: "تصنيف أمني", value: "10+" },
  { label: "تهديد دفاعي", value: "90+" },
  { label: "مؤشر تحذيري", value: "260+" },
  { label: "سيناريو تحليل أولي", value: "120+" },
];
