"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// AudioPlayer.js already cancels its own speech on unmount, but that alone
// isn't enough: some browsers (iOS Safari in particular has a known bug)
// don't reliably stop an already-speaking utterance from a component-level
// cancel() once a navigation is already underway, and a kid tapping "back"
// mid-sentence is exactly that race. This is the app-wide safety net —
// cancel speech on every route change, and when the tab is hidden/closed,
// regardless of which component (if any) is still around to clean up
// after itself.
export default function SpeechGuard() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const stop = () => window.speechSynthesis.cancel();
    const onVisibilityChange = () => {
      if (document.hidden) stop();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", stop);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", stop);
    };
  }, []);

  return null;
}
