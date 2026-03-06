"use client";

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { FaHome, FaArrowLeft, FaLanguage } from 'react-icons/fa';
import { useLanguage } from '@/app/providers/LanguageProvider';

export default function LearningZonePageNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { language, toggleLanguage, languageLoaded } = useLanguage();

    const isHome = pathname === '/learning-zone';
    const isTamilSubject = pathname.toLowerCase().includes('tamil');

    return (
        <div className="max-w-7xl mx-auto mb-6 px-4">
            <div className="flex items-center gap-3 w-full">
                {!isHome && (
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white text-slate-800 font-extrabold text-sm shadow-md hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-[0.98] border-b-4 border-slate-200 group shrink-0"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" size={14} />
                        <span className="hidden sm:inline">Go Back</span>
                    </button>
                )}

                <Link
                    href="/learning-zone"
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-extrabold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] border-b-4 shrink-0 ${isHome
                        ? 'bg-blue-600 text-white border-blue-800 shadow-blue-200'
                        : 'bg-white text-blue-600 border-blue-100 hover:bg-blue-50'
                        }`}
                >
                    <FaHome size={16} />
                    <span className="hidden sm:inline">Home</span>
                </Link>

                <div className="flex-grow h-11 px-4 sm:px-6 rounded-[1.25rem] bg-white/40 backdrop-blur-md border border-white/40 flex items-center gap-3 overflow-hidden">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] truncate">
                        {isHome ? 'Learning Dashboard' : pathname.split('/').map(p => p.replace(/-/g, ' ')).filter(p => !['learning-zone', 'subjects', 'levels', ''].includes(p.toLowerCase())).join(' • ')}
                    </span>
                </div>
            </div>
        </div>
    );
}
