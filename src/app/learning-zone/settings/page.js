"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SkeletonLoader from "../../components/ui/SkeletonLoader";

// Settings is now a tab on the consolidated Dashboard — this route stays as
// a redirect so any existing link to /learning-zone/settings keeps working.
export default function SettingsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/learning-zone/dashboard?tab=settings");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <SkeletonLoader variant="page" message="Loading your settings..." />
    </div>
  );
}
