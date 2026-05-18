"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { SplashScreen } from "@/components/splash-screen";
import { cn } from "@/lib/utils";

type AppChromeProps = {
  children: React.ReactNode;
};

const SPLASH_DURATION_MS = 5000;
const SPLASH_EXIT_OFFSET_MS = 700;

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const isGatewayPage = pathname === "/gateway";
  const isHomePage = pathname === "/";
  const hasCompletedHomeSplash = useRef(!isHomePage);
  const [isLoading, setIsLoading] = useState(isHomePage);
  const [isSplashExiting, setIsSplashExiting] = useState(false);
  const [shouldRenderShell, setShouldRenderShell] = useState(!isHomePage);
  const [isShellVisible, setIsShellVisible] = useState(!isHomePage);

  useEffect(() => {
    if (isGatewayPage || !isHomePage) {
      setIsLoading(false);
      setIsSplashExiting(false);
      setShouldRenderShell(true);
      setIsShellVisible(true);
      return;
    }

    if (hasCompletedHomeSplash.current) {
      setIsLoading(false);
      setIsSplashExiting(false);
      setShouldRenderShell(true);
      setIsShellVisible(true);
      return;
    }

    setIsLoading(true);
    setIsSplashExiting(false);
    setShouldRenderShell(false);
    setIsShellVisible(false);

    const exitTimer = window.setTimeout(() => {
      setIsSplashExiting(true);
    }, SPLASH_DURATION_MS - SPLASH_EXIT_OFFSET_MS);

    const revealTimer = window.setTimeout(() => {
      hasCompletedHomeSplash.current = true;
      setIsLoading(false);
      setIsSplashExiting(false);
      setShouldRenderShell(true);

      window.requestAnimationFrame(() => {
        setIsShellVisible(true);
      });
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(revealTimer);
    };
  }, [isGatewayPage, isHomePage]);

  return (
    <div className="relative min-h-screen">
      {isHomePage && isLoading ? <SplashScreen phase={isSplashExiting ? "exit" : "enter"} /> : null}

      {shouldRenderShell ? (
        <div
          className={cn(
            "flex min-h-screen flex-col transition-opacity duration-700 ease-out",
            isShellVisible ? "opacity-100" : "opacity-0",
          )}
        >
          {isGatewayPage ? null : <Navbar />}
          <main id="main-content" className="flex-1">
            {isGatewayPage ? children : <div className="container py-6 md:py-8 lg:py-10">{children}</div>}
          </main>
          {isGatewayPage ? null : <Footer />}
        </div>
      ) : null}
    </div>
  );
}
