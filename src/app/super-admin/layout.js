"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    FaUsers, FaChalkboardTeacher, FaUserShield, FaCreditCard,
    FaSignOutAlt, FaHome, FaChartBar, FaBars, FaTimes
} from "react-icons/fa";
import SuperAdminGuard from "./SuperAdminGuard";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";

const navItems = [
    { name: 'Dashboard', path: '/super-admin', icon: <FaChartBar /> },
    { name: 'Teachers', path: '/super-admin/teachers', icon: <FaChalkboardTeacher /> },
    { name: 'Parents', path: '/super-admin/parents', icon: <FaUsers /> },
    { name: 'Subscriptions', path: '/super-admin/subscriptions', icon: <FaCreditCard /> },
];

export default function SuperAdminLayout({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => signOut(auth);

    return (
        <SuperAdminGuard>
            <div className="flex min-h-screen bg-slate-900 text-slate-100">
                {/* ── Sidebar ── */}
                <aside className={`fixed inset-y-0 left-0 bg-slate-950 border-r border-slate-800 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                    <div className="flex flex-col h-full">
                        {/* Logo Area */}
                        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between">
                            <Link href="/super-admin" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40">
                                    <FaUserShield className="text-white text-xl" />
                                </div>
                                {sidebarOpen && <span className="font-black tracking-tighter text-xl">PORTAL<span className="text-blue-500">PRO</span></span>}
                            </Link>
                        </div>

                        {/* Nav Items */}
                        <nav className="flex-1 p-4 space-y-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all group ${isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                                : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'
                                            }`}
                                    >
                                        <span className={`text-xl ${isActive ? 'text-white' : 'group-hover:text-blue-400 transition-colors'}`}>
                                            {item.icon}
                                        </span>
                                        {sidebarOpen && <span>{item.name}</span>}
                                        {isActive && sidebarOpen && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Footer Info */}
                        <div className="p-4 border-t border-slate-800/50 space-y-2">
                            <Link href="/" className="flex items-center gap-4 px-4 py-3 text-slate-500 hover:text-slate-300 transition-colors font-bold">
                                <FaHome className="text-xl" />
                                {sidebarOpen && <span>Main Site</span>}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all font-bold"
                            >
                                <FaSignOutAlt className="text-xl" />
                                {sidebarOpen && <span>Sign Out</span>}
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ── Main Content Area ── */}
                <div className={`flex-grow flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                    {/* Top Bar */}
                    <header className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="bg-slate-800 p-2.5 rounded-xl hover:bg-slate-700 transition-colors text-slate-400"
                        >
                            {sidebarOpen ? <FaTimes /> : <FaBars />}
                        </button>

                        <div className="flex items-center gap-4">
                            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-500/20">
                                Super Admin Mode
                            </span>
                            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-black text-blue-500 overflow-hidden">
                                {auth.currentUser?.email?.charAt(0).toUpperCase() || 'A'}
                            </div>
                        </div>
                    </header>

                    <main className="p-8 pb-16">
                        <Suspense fallback={<DashboardSkeleton />}>
                            {children}
                        </Suspense>
                    </main>
                </div>
            </div>
        </SuperAdminGuard>
    );
}
