"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SplashScreen } from "@/components/splash-screen";

type AppChromeProps = {
  children: React.ReactNode;
};

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isGatewayPage = pathname === "/gateway";

  return (
    <div className="relative flex min-h-screen flex-col">
      <SplashScreen enabled={pathname === "/"} />
      {isGatewayPage ? null : <Navbar />}
      <main id="main-content" className="flex-1">
        {isGatewayPage ? children : <div className="container py-6 md:py-8 lg:py-10">{children}</div>}
      </main>
      {isGatewayPage ? null : <Footer />}
    </div>
  );
}
