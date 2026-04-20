import Link from "next/link";

import { BrandMark } from "@/components/brand-mark";
import { footerLinkGroups, siteConfig, socialLinks } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-slatecore/70">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.15fr_0.9fr_0.8fr]">
        <div className="space-y-4">
          <BrandMark showSubtitle />
          <p className="max-w-md leading-8 text-steel">{siteConfig.description}</p>
          <p className="text-sm leading-7 text-steel">
            Cyvero منصة دفاعية وتوعوية فقط، وهدفها بناء مرجع عربي احترافي للأمن السيبراني يركز على
            الفهم، الوقاية، الاحتواء، والاستجابة القانونية والآمنة.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {footerLinkGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              <h3 className="font-heading text-xl text-white">{group.title}</h3>
              <div className="grid gap-2 text-sm">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className="cyber-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-heading text-xl text-white">روابط شكلية</h3>
          <div className="grid gap-2 text-sm">
            {socialLinks.map((link) => (
              <Link key={link.label} href={link.href} className="cyber-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/8 py-4 text-center text-sm text-steel">
        جميع الحقوق محفوظة © {new Date().getFullYear()} Cyvero
      </div>
    </footer>
  );
}
