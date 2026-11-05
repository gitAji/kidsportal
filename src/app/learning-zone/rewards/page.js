"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SkeletonLoader from "../../components/ui/SkeletonLoader";

// Rewards is now a tab on the consolidated Dashboard — this route stays as
// a redirect so existing links/buttons pointing at /learning-zone/rewards
// (e.g. the quiz completion screen's "View My Rewards" button) keep working.
export default function RewardsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/learning-zone/dashboard?tab=rewards");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <SkeletonLoader variant="page" message="Loading your rewards..." />
    </div>
  );
}
