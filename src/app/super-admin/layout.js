"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
    FaUsers, FaChalkboardTeacher, FaUserShield, FaCreditCard,
    FaSignOutAlt, FaHome, FaChartBar, FaBars, FaTimes,
    FaTicketAlt, FaCog, FaUsersCog, FaGift
} from "react-icons/fa";
import SuperAdminGuard from "./SuperAdminGuard";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { name: 'Dashboard', path: '/super-admin', icon: <FaChartBar /> },
    { name: 'Teachers', path: '/super-admin/teachers', icon: <FaChalkboardTeacher /> },
    { name: 'Parents', path: '/super-admin/parents', icon: <FaUsers /> },
    { name: 'Subscriptions', path: '/super-admin/subscriptions', icon: <FaCreditCard /> },
    { name: 'Promo Codes', path: '/super-admin/promo-codes', icon: <FaGift /> },
    { name: 'Tickets', path: '/super-admin/tickets', icon: <FaTicketAlt /> },
    { name: 'Learning Config', path: '/super-admin/learning-config', icon: <FaCog /> },
    { name: 'Team & Roles', path: '/super-admin/team', icon: <FaUsersCog /> },
];

export default function SuperAdminLayout({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed for mobile responsiveness

    // If we're on the login page, skip all guard and sidebar chrome
    if (pathname === '/super-admin/login') {
        return <>{children}</>;
    }

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = '/super-admin/login';
    };

    return (
        <SuperAdminGuard>
            <div className="flex min-h-screen bg-slate-900 text-slate-100 overflow-x-hidden">
                {/* ── Mobile Overlay ── */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[55] lg:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* ── Sidebar ── */}
                <aside
                    className={`fixed inset-y-0 left-0 bg-slate-950 border-r border-slate-800 transition-all duration-300 z-[60] 
                        ${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'}`}
                >
                    <div className="flex flex-col h-full">
                        {/* Logo Area */}
                        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
                            <Link href="/super-admin" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 flex-shrink-0">
                                    <FaUserShield className="text-white text-xl" />
                                </div>
                                <span className={`font-black tracking-tighter text-xl transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                                    KIDS<span className="text-blue-500">PORTAL</span>
                                </span>
                            </Link>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-slate-500 hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Admin Badge */}
                        <div className={`px-6 py-3 border-b border-slate-800/30 transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                            <span className="text-[9px] font-black uppercase tracking-[3px] text-blue-500 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 whitespace-nowrap">
                                Super Admin
                            </span>
                        </div>

                        {/* Nav Items */}
                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all group ${isActive
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                            : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                                            }`}
                                    >
                                        <span className={`text-xl flex-shrink-0 ${isActive ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}`}>
                                            {item.icon}
                                        </span>
                                        <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>
                                            {item.name}
                                        </span>
                                        {isActive && sidebarOpen && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer Info */}
                        <div className="p-4 border-t border-slate-800/50 space-y-2">
                            <Link href="/" className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-300 transition-colors font-bold group">
                                <FaHome className="text-xl flex-shrink-0 group-hover:text-white transition-colors" />
                                <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>Main Site</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold group"
                            >
                                <FaSignOutAlt className="text-xl flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span className={`transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden'}`}>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ── Main Content Area ── */}
                <div className={`flex-grow flex flex-col min-w-0 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
                    {/* Top Bar */}
                    <header className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-[50]">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="bg-slate-800 p-2.5 rounded-xl hover:bg-slate-700 transition-colors text-slate-400"
                            >
                                {sidebarOpen ? <FaTimes /> : <FaBars />}
                            </button>
                            <div className="lg:hidden flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <FaUserShield className="text-white text-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4">
                            <span className="hidden sm:inline-block bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-500/20">
                                Super Admin Mode
                            </span>
                            <div className="flex items-center gap-3 bg-slate-950/40 border border-slate-800 pl-3 pr-1.5 py-1.5 rounded-2xl">
                                <div className="hidden md:block text-right leading-none">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Authorized User</p>
                                    <p className="text-xs font-bold text-white truncate max-w-[120px]">{auth.currentUser?.email?.split('@')[0] || 'Admin'}</p>
                                </div>
                                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 border border-slate-700/50 flex items-center justify-center font-black text-white text-sm overflow-hidden flex-shrink-0">
                                    {auth.currentUser?.email?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="p-4 sm:p-8 pb-16 min-h-[calc(100vh-5rem)]">
                        <Suspense fallback={<DashboardSkeleton />}>
                            {children}
                        </Suspense>
                    </main>
                </div>
            </div>
        </SuperAdminGuard>
    );
}
