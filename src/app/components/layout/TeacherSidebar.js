"use client";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    FaExternalLinkAlt,
    FaBars,
    FaTimes
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";
import { useTeacher } from "@/context/TeacherContext";
import { useUnsavedChanges } from "@/context/UnsavedChangesContext";

const menuItems = [
    { name: "Curriculum", icon: <FaBook />, path: "/teacher-admin" },
    { name: "Reports", icon: <FaChartLine />, path: "/teacher-admin/reports" },
    { name: "Settings", icon: <FaCog />, path: "/teacher-admin/settings" },
];

export default function TeacherSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { teacherProfile } = useTeacher();
    const { guardNavigation } = useUnsavedChanges();

    // Auto-collapse on small screens
    useEffect(() => {
        const checkWidth = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
                setIsMobileOpen(false);
            }
        };
        checkWidth();
        window.addEventListener('resize', checkWidth);
        return () => window.removeEventListener('resize', checkWidth);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        if (!guardNavigation()) return;
        try {
            await signOut(auth);
            window.location.href = "/teacher-admin/login";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const handleNav = (e, path) => {
        e.preventDefault();
        if (path === pathname) { setIsMobileOpen(false); return; }
        if (!guardNavigation()) return;
        setIsMobileOpen(false);
        router.push(path);
    };

    const sidebarContent = (
        <>
            {/* Logo Section */}
            <div className="p-6 flex items-center justify-between">
                <a href="/teacher-admin" onClick={(e) => handleNav(e, "/teacher-admin")} className="block outline-none">
                    {(!isCollapsed || isMobileOpen) ? (
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
                </a>
            </div>

            {/* Navigation - Scrollable area */}
            <nav className="flex-grow px-4 mt-4 space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <a key={item.path} href={item.path} onClick={(e) => handleNav(e, item.path)}>
                            <div
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${isActive
                                    ? "bg-blue-50 text-blue-600 font-bold"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <div className={`text-xl flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"}`}>
                                    {item.icon}
                                </div>
                                {(!isCollapsed || isMobileOpen) && <span className="text-sm font-semibold whitespace-nowrap">{item.name}</span>}

                                {isActive && (
                                    <motion.div
                                        layoutId="activeNavTeacher"
                                        className="absolute left-0 w-1.5 h-8 bg-blue-600 rounded-r-full"
                                    />
                                )}
                            </div>
                        </a>
                    );
                })}
            </nav>

            {/* Footer / User Profile & Logout - Fixed at bottom */}
            <div className="p-4 border-t border-slate-50 mt-auto space-y-2">
                {/* User Profile Info */}
                <div className={`flex items-center ${isCollapsed && !isMobileOpen ? 'justify-center' : 'gap-4'} px-4 py-3 bg-slate-50/50 rounded-2xl mb-2`}>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-sm flex-shrink-0">
                        {teacherProfile?.image ? (
                            <img src={teacherProfile.image} alt="" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            teacherProfile?.name?.charAt(0) || teacherProfile?.email?.charAt(0).toUpperCase() || 'T'
                        )}
                    </div>
                    {(!isCollapsed || isMobileOpen) && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Teacher</span>
                            <span className="text-xs font-bold text-slate-700 truncate">{teacherProfile?.name || teacherProfile?.email}</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group"
                >
                    <div className="text-xl flex-shrink-0">
                        <FaSignOutAlt />
                    </div>
                    {(!isCollapsed || isMobileOpen) && <span className="text-sm font-bold">Sign Out</span>}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden fixed top-4 left-4 z-[60] w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors"
                aria-label="Open menu"
            >
                <FaBars />
            </button>

            {/* Desktop sidebar */}
            <motion.div
                initial={false}
                animate={{ width: isCollapsed ? "80px" : "280px" }}
                className="hidden md:flex relative h-screen bg-white border-r border-slate-100 flex-col transition-all duration-300 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0"
            >
                {/* Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-3 top-12 w-6 h-6 bg-white border border-slate-100 rounded-full flex items-center justify-center text-[10px] text-slate-400 hover:text-blue-600 hover:shadow-md transition-all z-10"
                >
                    {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>

                {sidebarContent}
            </motion.div>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[70]"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="md:hidden fixed left-0 top-0 h-full w-[280px] bg-white z-[80] shadow-2xl flex flex-col"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setIsMobileOpen(false)}
                                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 z-10"
                            >
                                <FaTimes />
                            </button>
                            {sidebarContent}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

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
        </>
    );
}
