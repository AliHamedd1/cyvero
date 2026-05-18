import { FooterLinkGroup, NavigationLink } from "@/types/cyber";

export const siteConfig = {
  name: "Cyvero",
  tagline: "منصة عربية للأمن السيبراني والحماية الرقمية",
  description:
    "Cyvero منصة سيبرانية عربية تجمع التوعية، التحليل الأولي، المختصين، الاشتراكات، وحلول الشركات ضمن تجربة دفاعية احترافية قابلة للتوسع.",
  url: "https://cyvero.local",
};

export const navigationLinks: NavigationLink[] = [
  { label: "الرئيسية", href: "/" },
  { label: "التهديدات", href: "/threats" },
  { label: "تحليل حالتي", href: "/analyze" },
  { label: "الاشتراكات", href: "/subscriptions" },
  { label: "المختصون", href: "/specialists", matchMode: "exact" },
  { label: "حلول الشركات", href: "/subscriptions/business", matchMode: "exact" },
  { label: "تواصل معنا", href: "/contact", matchMode: "exact" },
  { label: "من نحن", href: "/why-cyvero", matchMode: "exact" },
  { label: "الأدمن", href: "/admin-login", matchMode: "exact" },
];

export const footerPlatformLinks: NavigationLink[] = [
  { label: "الرئيسية", href: "/" },
  { label: "التهديدات", href: "/threats" },
  { label: "تحليل حالتي", href: "/analyze" },
  { label: "الاشتراكات", href: "/subscriptions" },
  { label: "المختصون", href: "/specialists" },
  { label: "حلول الشركات", href: "/subscriptions/business" },
];

export const companyLinks: NavigationLink[] = [
  { label: "من نحن", href: "/why-cyvero" },
  { label: "تواصل معنا", href: "/contact" },
  { label: "لوحة الأدمن", href: "/admin-login" },
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
  { label: "مسارات تشغيل دفاعية", value: "8" },
  { label: "تهديدات وتوعية منظمة", value: "90+" },
  { label: "مختصون واستشارات", value: "11" },
  { label: "فرص نمو ومنتجات", value: "4" },
];
