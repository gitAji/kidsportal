"use client";

import Link from 'next/link';
import { FaChalkboardTeacher, FaRegCopyright } from 'react-icons/fa';
import { useLanguage } from '@/app/providers/LanguageProvider';

export default function ChildLearningZoneFooter() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="w-full px-6 py-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 backdrop-blur-lg border border-white/60 rounded-[2.5rem] px-8 py-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">

        {/* Left: Dynamic Copyright */}
        <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
          <FaRegCopyright className="text-slate-300" />
          <span>{currentYear} KidsPortal World</span>
          <span className="hidden sm:inline opacity-30">•</span>
          <span className="hidden sm:inline">{t('crafted')}</span>
        </div>

        {/* Center: Brand Tagline (Optional, keep it clean) */}
        <div className="hidden lg:block">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[4px]">
            {t('inspiring')}
          </p>
        </div>

        {/* Right: Teacher Access (Discreet & Premium) */}
        <Link
          href="/teacher-admin/login"
          className="group w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center transition-all hover:bg-indigo-600 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
          title="Teacher Login"
        >
          <div className="text-indigo-500 group-hover:text-white transition-colors text-lg">
            <FaChalkboardTeacher />
          </div>
        </Link>
      </div>

      {/* Bottom Minimal Info */}
      <div className="text-center mt-4">
        <p className="text-[9px] font-medium text-slate-300 uppercase tracking-[2px]">
          {t('safety')}
        </p>
      </div>
    </footer>
  );
}