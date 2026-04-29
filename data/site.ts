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
  { label: "التهديدات", href: "/threats" },
  { label: "حلّل حالتي", href: "/analyze" },
  { label: "الاشتراكات", href: "/subscriptions" },
  { label: "المختصون", href: "/specialists", matchMode: "exact" },
  { label: "حلول الشركات", href: "/subscriptions/business", matchMode: "exact" },
  { label: "الأدمن", href: "/admin-login", matchMode: "exact" },
  { label: "تواصل معنا", href: "/contact", matchMode: "exact" },
  { label: "من نحن", href: "/why-cyvero", matchMode: "exact" },
];

export const footerPlatformLinks: NavigationLink[] = [
  { label: "الرئيسية", href: "/" },
  { label: "التهديدات", href: "/threats" },
  { label: "حلّل حالتي", href: "/analyze" },
  { label: "الاشتراكات", href: "/subscriptions" },
  { label: "المختصون", href: "/specialists" },
  { label: "حلول الشركات", href: "/subscriptions/business" },
];

export const companyLinks: NavigationLink[] = [
  { label: "من نحن", href: "/why-cyvero" },
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
    links: footerPlatformLinks,
  },
  {
    title: "Cyvero",
    links: companyLinks,
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
