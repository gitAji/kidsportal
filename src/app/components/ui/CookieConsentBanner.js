"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCookieBite } from "react-icons/fa";
import { initAnalytics } from "@/firebase/config";

const STORAGE_KEY = "cookie-consent";

// Analytics only ever starts from one of these two places: a returning
// visitor's stored "accepted" choice (effect below) or this banner's Accept
// click — never from firebase/config.js on its own, so there is no path
// that tracks a visitor before they've chosen.
export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let choice;
    try {
      choice = localStorage.getItem(STORAGE_KEY);
    } catch {
      choice = null;
    }

    if (choice === "accepted") {
      initAnalytics();
    } else if (choice !== "rejected") {
      setVisible(true);
    }
  }, []);

  function choose(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch { }
    if (value === "accepted") {
      initAnalytics();
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[200] p-4 sm:p-5">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl">
          <FaCookieBite />
        </div>
        <p className="text-slate-600 text-sm leading-relaxed flex-grow">
          We use a small amount of analytics to understand how KidsPortal is used and keep improving it. We only turn this
          on with your consent &mdash; see our{" "}
          <Link href="/privacy" className="text-sky-600 font-bold hover:underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => choose("rejected")}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 border-2 border-slate-100 hover:border-slate-200 transition-colors"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:shadow-lg hover:shadow-sky-200/60 transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
