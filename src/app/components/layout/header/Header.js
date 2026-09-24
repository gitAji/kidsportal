"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "@/firebase/auth";
import { FaBell, FaUserCircle, FaCaretDown, FaQuestionCircle, FaUsers, FaHome, FaGraduationCap, FaEnvelope, FaInfoCircle, FaShieldAlt, FaStar } from "react-icons/fa";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { motion, AnimatePresence } from "framer-motion";
import { faChartBar, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header({
  setIsModalOpen,
  setIsRegister,
  setIsHowItWorksOpen,
  setIsAboutUsOpen,
  setIsOurTeamOpen,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      const q = query(collection(db, "notifications"), where("userId", "==", user.uid));
      const unsub = onSnapshot(q, (snap) => {
        const notifs = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setNotifications(notifs);
        setNotificationCount(notifs.filter((n) => !n.read).length);
      }, (err) => console.error(err));
      return () => unsub();
    } else {
      setNotifications([]);
      setNotificationCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsDropdownOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setIsNotificationDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((p) => !p);
    setIsNotificationDropdownOpen(false);
  }, []);

  const toggleNotificationDropdown = useCallback(() => {
    setIsNotificationDropdownOpen((p) => !p);
    setIsDropdownOpen(false);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsLoggingOut(true);
    await new Promise((r) => setTimeout(r, 800));
    await logout();
    setIsLoggingOut(false);
  };

  const navLink = (href) =>
    `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
      pathname === href
        ? "bg-sky-50 text-sky-600"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
    }`;

  return (
    <>
      {/* Logout overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white/95 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-center"
            >
              <div className="relative mb-8 flex justify-center">
                <div className="w-24 h-24 bg-sky-100 rounded-full animate-pulse absolute blur-2xl opacity-50" />
                <Image src="/logo.png" alt="Logo" width={180} height={55} className="relative z-10 w-auto h-14" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Logging you out securely…</h2>
              <p className="text-slate-500 font-semibold uppercase tracking-[3px] text-xs">See you soon! 👋</p>
              <div className="mt-12 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-3 h-3 bg-sky-500 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER ── */}
      <header className={`sticky top-0 z-[100] w-full bg-white transition-all duration-300 ${scrolled ? "shadow-md border-b border-slate-100" : "border-b border-slate-100/80"}`}>

        {/* Trust strip */}
        <div className="bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 text-white text-[11px] font-semibold">
          <div className="container mx-auto px-4 py-2 flex flex-wrap justify-between items-center gap-x-4">
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="flex items-center gap-1.5"><FaShieldAlt className="text-[10px]" /> Safe &amp; Ad-Free</span>
              <span className="hidden sm:flex items-center gap-1.5"><span>🏅</span> Trusted by 10,000+ Families</span>
              <span className="hidden md:flex items-center gap-1.5"><FaStar className="text-yellow-300 text-[10px]" /> 4.9 / 5 Rating</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={setIsHowItWorksOpen} className="flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                <FaQuestionCircle className="text-[10px]" /> How It Works
              </button>
              <button onClick={setIsOurTeamOpen} className="hidden md:flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                <FaUsers className="text-[10px]" /> Our Team
              </button>
            </div>
          </div>
        </div>

        {/* Main nav bar */}
        <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="KidsPortal" width={120} height={40} className="w-auto h-10 object-contain" />
          </Link>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link href="/" className={navLink("/")}>Home</Link>
            <Link href="/about" className={navLink("/about")}>About</Link>
            {!user && <Link href="/learning" className={navLink("/learning")}>Curriculum</Link>}
            <Link href="/pricing" className={navLink("/pricing")}>Pricing</Link>
            <Link href="/help" className={navLink("/help")}>Help</Link>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2">
                {/* Bell */}
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={toggleNotificationDropdown}
                    className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-all relative"
                  >
                    <FaBell className="text-lg" />
                    {notificationCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 bg-rose-500 text-white text-[8px] font-bold rounded-full h-3.5 w-3.5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  {isNotificationDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-5 py-3 border-b border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.length === 0
                          ? <p className="px-5 py-6 text-center text-xs text-slate-400">You&apos;re all caught up! 🎉</p>
                          : notifications.map((n) => (
                            <div key={n.id} className="px-5 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                              <p className="text-xs font-medium text-slate-700 mb-0.5">{n.message}</p>
                              <span className="text-[10px] text-slate-400">{new Date(n.timestamp?.toDate()).toLocaleDateString()}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  )}
                </div>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-2xl hover:bg-slate-50 border border-slate-100 transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-sky-100">
                      {user.photoURL
                        ? <Image src={user.photoURL} alt="Avatar" width={36} height={36} className="w-full h-full object-cover" />
                        : <div className="w-full h-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white"><FaUserCircle className="text-xl" /></div>
                      }
                    </div>
                    <span className="hidden lg:block text-xs font-bold text-slate-700 max-w-[80px] truncate">
                      {user.displayName || "Parent"}
                    </span>
                    <FaCaretDown className={`text-slate-400 text-[10px] transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-50 mb-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Signed in as</p>
                        <p className="text-xs font-bold text-slate-800 truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard" onClick={toggleDropdown} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all">
                        <FontAwesomeIcon icon={faChartBar} className="w-4" /> Dashboard
                      </Link>
                      <Link href="/profile" onClick={toggleDropdown} className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                        <FontAwesomeIcon icon={faUser} className="w-4" /> My Profile
                      </Link>
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-semibold text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border-t border-slate-50 mt-1">
                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login?role=student" className="hidden sm:flex items-center gap-1.5 text-teal-600 font-bold text-xs px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-100 transition-all">
                  <FaGraduationCap /> Student Login
                </Link>
                <button
                  className="hidden sm:block text-slate-600 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-all"
                  onClick={() => { setIsModalOpen(true); setIsRegister(false); }}
                >
                  Log In
                </button>
                <button
                  className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white py-2.5 px-5 sm:px-7 rounded-xl font-bold text-sm shadow-md shadow-sky-200/60 hover:-translate-y-0.5 hover:shadow-sky-300/60 active:translate-y-0 transition-all"
                  onClick={() => { setIsModalOpen(true); setIsRegister(true); }}
                >
                  Start Free →
                </button>
              </div>
            )}

            {/* Hamburger */}
            <button
              className="lg:hidden w-10 h-10 bg-slate-100 flex items-center justify-center rounded-xl text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all ml-1"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-[320px] bg-white z-[300] shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-100">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <Image src="/logo.png" alt="Logo" width={100} height={35} className="w-auto h-8 object-contain" />
                </Link>
                <button
                  className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav items */}
              <nav className="flex flex-col p-3 gap-1 flex-grow">
                {[
                  { href: "/", label: "Home", icon: <FaHome /> },
                  { href: "/about", label: "About Us", icon: <FaInfoCircle /> },
                  ...(!user ? [{ href: "/learning", label: "Curriculum", icon: <FaGraduationCap /> }] : []),
                  { href: "/pricing", label: "Pricing", icon: <FaStar /> },
                  { href: "/help", label: "Help", icon: <FaQuestionCircle /> },
                  { href: "/contact", label: "Contact", icon: <FaEnvelope /> },
                ].map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all text-sm font-semibold ${
                      pathname === href ? "bg-sky-50 text-sky-600" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${pathname === href ? "bg-sky-100 text-sky-500" : "bg-slate-100 text-slate-400"}`}>
                      {icon}
                    </span>
                    {label}
                  </Link>
                ))}

                {/* Auth user links */}
                {user && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                    <div className="px-4 py-2 mb-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Signed in as</p>
                      <p className="text-xs font-bold text-slate-700 truncate">{user.displayName || user.email}</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-sky-50 hover:text-sky-600 transition-all">
                      <span className="w-9 h-9 rounded-xl bg-sky-100 text-sky-500 flex items-center justify-center text-sm"><FontAwesomeIcon icon={faChartBar} /></span> Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                      <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-500 flex items-center justify-center text-sm"><FontAwesomeIcon icon={faUser} /></span> My Profile
                    </Link>
                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3.5 w-full px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all">
                      <span className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center text-sm"><FontAwesomeIcon icon={faSignOutAlt} /></span> Sign Out
                    </button>
                  </div>
                )}

                {/* Guest buttons */}
                {!user && (
                  <div className="mt-auto pt-4 border-t border-slate-100 space-y-3 px-2">
                    <Link href="/login?role=student" onClick={() => setIsMenuOpen(false)} className="w-full py-3.5 bg-teal-50 text-teal-700 border border-teal-200 rounded-xl font-bold text-sm hover:bg-teal-100 transition-all flex items-center justify-center gap-2">
                      <FaGraduationCap /> Student Login
                    </Link>
                    <button onClick={() => { setIsModalOpen(true); setIsRegister(false); setIsMenuOpen(false); }} className="w-full py-3.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                      Parent Log In
                    </button>
                    <button onClick={() => { setIsModalOpen(true); setIsRegister(true); setIsMenuOpen(false); }} className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 text-white rounded-xl font-bold text-sm shadow-md shadow-sky-200/50 transition-all">
                      Start Free →
                    </button>
                  </div>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
