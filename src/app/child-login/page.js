"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToUnifiedLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/login?role=student");
  }, [router]);
  return null;
}