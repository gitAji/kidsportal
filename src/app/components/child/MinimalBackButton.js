"use client";

import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

// A small, unobtrusive floating back affordance for pages that no longer
// have the global learning-zone nav bar. Kept icon-only so it stays out of
// the way of the content, which is the main focus on a kid's screen.
export default function MinimalBackButton({ className = '' }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      aria-label="Go back"
      className={`fixed top-4 left-4 z-[300] w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/85 backdrop-blur-md text-slate-600 shadow-lg border border-white/60 flex items-center justify-center hover:bg-white hover:scale-105 active:scale-95 transition-all ${className}`}
    >
      <FaArrowLeft size={16} />
    </button>
  );
}
