"use client";

import { usePathname } from "next/navigation";

/* Hides the public site chrome (nav/footer) on organiser admin routes. */
export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <>{children}</>;
}
