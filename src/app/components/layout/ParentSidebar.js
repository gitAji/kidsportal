"use client";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    FaHome,
    FaChartBar,
    FaBookOpen,
    FaUserCog,
    FaCreditCard,
    FaSignOutAlt,
    FaChevronLeft,
    FaChevronRight,
    FaChessPawn,
    FaExternalLinkAlt,
    FaChalkboardTeacher
} from "react-icons/fa";
import { useState } from "react";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";

const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
    { name: "Billing", icon: <FaCreditCard />, path: "/billing" },
    { name: "Settings", icon: <FaUserCog />, path: "/profile" },
];

export default function ParentSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <motion.div
            initial={false}
            animate={{ width: isCollapsed ? "80px" : "280px" }}
            className="relative h-screen bg-white border-r border-slate-100 flex flex-col transition-all duration-300 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        >

            {/* Logo Section */}
            <div className="p-6">
                <Link href="/dashboard" className="block outline-none group">
                    <div className={`transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
                        {!isCollapsed ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-3"
                            >
                                <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                                    <Image
                                        src="/logo.png"
                                        alt="KidsPortal"
                                        width={120}
                                        height={40}
                                        className="w-auto h-10 object-contain"
                                        priority
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-all overflow-hidden p-1.5">
                                <Image
                                    src="/logo.png"
                                    alt="K"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-contain scale-150"
                                />
                            </div>
                        )}
                    </div>
                </Link>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-12 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:text-blue-600 hover:shadow-md transition-all z-10"
            >
                {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>

            {/* Navigation - Scrollable area */}
            <nav className="flex-grow px-4 mt-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link key={item.path} href={item.path}>
                            <div
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${isActive
                                    ? "bg-blue-50 text-blue-600 font-bold"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <div className={`text-xl ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"}`}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && <span className="text-sm font-semibold whitespace-nowrap">{item.name}</span>}

                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1.5 h-8 bg-blue-600 rounded-r-full"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout - Fixed at bottom */}
            <div className="p-4 border-t border-slate-50 mt-auto space-y-1">
                {/* Back to main site */}
                <Link href="/" className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-all group">
                    <div className="text-base">
                        <FaExternalLinkAlt />
                    </div>
                    {!isCollapsed && <span className="text-xs font-bold">Main Site</span>}
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group"
                >
                    <div className="text-xl">
                        <FaSignOutAlt />
                    </div>
                    {!isCollapsed && <span className="text-sm font-bold">Sign Out</span>}
                </button>
            </div>
        </motion.div>
    );
}
