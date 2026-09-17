"use client";
import Link from "next/link";
import Image from "next/image";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
    FaChalkboardTeacher,
    FaTicketAlt,
    FaBars,
    FaTimes
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { auth } from "@/firebase/config";
import { signOut } from "firebase/auth";

const menuItems = [
    { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    { name: "Analytics", icon: <FaChartBar />, path: "/analytics" },
    { name: "Billing", icon: <FaCreditCard />, path: "/billing" },
    { name: "Support", icon: <FaTicketAlt />, path: "/support" },
    { name: "Settings", icon: <FaUserCog />, path: "/profile" },
];

export default function ParentSidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

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
        try {
            await signOut(auth);
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const sidebarContent = (
        <>
            {/* Logo Section */}
            <div className="p-4 md:p-6">
                <Link href="/dashboard" className="block outline-none group">
                    <div className={`transition-all duration-300 ${isCollapsed && !isMobileOpen ? 'flex justify-center' : ''}`}>
                        {(!isCollapsed || isMobileOpen) ? (
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
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-all overflow-hidden p-1">
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

            {/* Navigation */}
            <nav className="flex-grow px-3 md:px-4 mt-2 md:mt-4 space-y-1 md:space-y-2 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link key={item.path} href={item.path}>
                            <div
                                className={`flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl transition-all group relative ${isActive
                                    ? "bg-blue-50 text-blue-600 font-bold"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                                    }`}
                            >
                                <div className={`text-lg md:text-xl flex-shrink-0 ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-500"}`}>
                                    {item.icon}
                                </div>
                                {(!isCollapsed || isMobileOpen) && <span className="text-sm font-semibold whitespace-nowrap">{item.name}</span>}

                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute left-0 w-1 md:w-1.5 h-7 md:h-8 bg-blue-600 rounded-r-full"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Logout */}
            <div className="p-3 md:p-4 border-t border-slate-50 mt-auto space-y-1">
                <Link href="/" className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-slate-300 hover:bg-slate-50 hover:text-slate-500 transition-all group">
                    <div className="text-base flex-shrink-0">
                        <FaExternalLinkAlt />
                    </div>
                    {(!isCollapsed || isMobileOpen) && <span className="text-xs font-bold">Main Site</span>}
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 md:gap-4 px-3 md:px-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group"
                >
                    <div className="text-lg md:text-xl flex-shrink-0">
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
                animate={{ width: isCollapsed ? "72px" : "260px" }}
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
                            className="md:hidden fixed left-0 top-0 h-full w-[260px] bg-white z-[80] shadow-2xl flex flex-col"
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
        </>
    );
}
