"use client";
import { useState, useEffect, useCallback } from "react";
import { FaEnvelope, FaSync, FaTimes } from "react-icons/fa";
import { resendVerificationEmail } from "@/firebase/auth";

// Shown across the dashboard (parent or teacher) until the signed-in
// account's email address has been verified. Google sign-ins already come
// back with emailVerified: true, so this never shows for them.
export default function EmailVerificationBanner({ user }) {
  const [verified, setVerified] = useState(user?.emailVerified || false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [cooldown, setCooldown] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setVerified(user?.emailVerified || false);
  }, [user]);

  const checkVerified = useCallback(async () => {
    if (!user) return;
    try {
      await user.reload();
      setVerified(!!user.emailVerified);
    } catch {
      // ignore — offline or transient, banner just stays as-is
    }
  }, [user]);

  // A user who clicked the verification link in another tab won't see this
  // tab update on its own, so re-check whenever they come back to it.
  useEffect(() => {
    window.addEventListener("focus", checkVerified);
    const interval = setInterval(checkVerified, 30000);
    return () => {
      window.removeEventListener("focus", checkVerified);
      clearInterval(interval);
    };
  }, [checkVerified]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  if (!user || verified || dismissed) return null;

  const handleResend = async () => {
    if (cooldown > 0 || status === "sending") return;
    setStatus("sending");
    try {
      await resendVerificationEmail();
      setStatus("sent");
      setCooldown(60);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <FaEnvelope className="text-amber-500 flex-shrink-0" />
        <p className="text-sm font-bold text-amber-800 truncate">
          Please verify your email ({user.email}) to secure your account.
          {status === "sent" && <span className="text-emerald-600 font-black ml-2">Verification email sent!</span>}
          {status === "error" && <span className="text-rose-600 font-black ml-2">Couldn&apos;t send email — try again.</span>}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={checkVerified}
          title="I've already verified — refresh status"
          className="text-amber-500 hover:text-amber-700 transition-colors p-2"
        >
          <FaSync size={12} />
        </button>
        <button
          onClick={handleResend}
          disabled={status === "sending" || cooldown > 0}
          className="text-xs font-black uppercase text-amber-700 bg-white border border-amber-300 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === "sending" ? "Sending..." : cooldown > 0 ? `Resend (${cooldown}s)` : "Resend Email"}
        </button>
        <button
          onClick={() => setDismissed(true)}
          title="Dismiss for now"
          className="text-amber-400 hover:text-amber-600 transition-colors p-2"
        >
          <FaTimes size={12} />
        </button>
      </div>
    </div>
  );
}
