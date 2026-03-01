"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    FaHome,
    FaBook,
    FaUsers,
    FaChartLine,
    FaCog,
    FaSignOutAlt,
    FaChevronLeft,
    FaChevronRight,
    FaGraduationCap,
    FaExternalLinkAlt
} from "react-icons/fa";
import { useState } from "react";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";

const menuItems = [
    { name: "Curriculum", icon: <FaBook />, path: "/teacher-admin" },
    { name: "Students", icon: <FaUsers />, path: "/teacher-admin/students" },
    { name: "Reports", icon: <FaChartLine />, path: "/teacher-admin/reports" },
    { name: "Settings", icon: <FaCog />, path: "/teacher-admin/settings" },
];

export default function TeacherSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/teacher-admin/login";
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
            <div className="p-6 flex items-center justify-between">
                <Link href="/teacher-admin" className="block outline-none">
                    {!isCollapsed ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <FaGraduationCap className="text-xl" />
                            </div>
                            <span className="font-black text-xl text-slate-800 tracking-tight">Teachers</span>
                        </motion.div>
                    ) : (
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200 mx-auto">
                            <FaGraduationCap className="text-xl" />
                        </div>
                    )}
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
                                        layoutId="activeNavTeacher"
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

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
            `}</style>
        </motion.div>
    );
}
