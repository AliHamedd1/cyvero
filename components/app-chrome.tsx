"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

type AppChromeProps = {
  children: React.ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isDeviceEntryPage = pathname === "/";

  return (
    <div className="relative flex min-h-screen flex-col">
      {isDeviceEntryPage ? null : <Navbar />}
      <main id="main-content" className="flex-1">
        {isDeviceEntryPage ? children : <div className="container py-8 md:py-10">{children}</div>}
      </main>
      {isDeviceEntryPage ? null : <Footer />}
    </div>
  );
}
