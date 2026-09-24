"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function RedirectInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const reason = searchParams.get("reason");
    router.replace(reason ? `/login?role=student&reason=${reason}` : "/login?role=student");
  }, [router, searchParams]);
  return null;
}

export default function RedirectToUnifiedLogin() {
  return (
    <Suspense fallback={null}>
      <RedirectInner />
    </Suspense>
  );
}