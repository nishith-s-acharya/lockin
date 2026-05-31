"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

const INTERVIEWER_ONLY = ["/dashboard"];
const INTERVIEWEE_ONLY = ["/appointments"];

export default function RoleRedirect({ role }) {
  const pathname = usePathname();
  const router = useRouter();

  // Compute redirect target synchronously so we can block rendering immediately
  const redirectTarget = useMemo(() => {
    if (role === "UNASSIGNED" && pathname !== "/onboarding")
      return "/onboarding";
    if (role === "INTERVIEWER" && pathname.startsWith("/onboarding"))
      return "/dashboard";
    if (role === "INTERVIEWEE" && pathname.startsWith("/onboarding"))
      return "/explore";
    if (
      role === "INTERVIEWEE" &&
      INTERVIEWER_ONLY.some((p) => pathname.startsWith(p))
    )
      return "/appointments";
    if (
      role === "INTERVIEWER" &&
      INTERVIEWEE_ONLY.some((p) => pathname.startsWith(p))
    )
      return "/dashboard";
    return null;
  }, [role, pathname]);

  useEffect(() => {
    if (redirectTarget) {
      router.replace(redirectTarget);
    }
  }, [redirectTarget, router]);

  // Show a full-screen loading overlay while redirecting to prevent page flicker
  if (redirectTarget) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
          <p className="text-sm text-stone-500 animate-pulse">Redirecting…</p>
        </div>
      </div>
    );
  }

  return null;
}