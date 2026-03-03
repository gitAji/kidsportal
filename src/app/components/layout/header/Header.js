"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "@/firebase/auth";
import { FaBell, FaUserCircle, FaCaretDown, FaQuestionCircle, FaInfoCircle, FaUsers, FaStar, FaHome, FaGraduationCap, FaEnvelope } from "react-icons/fa";
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
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const pathname = usePathname();

  // Use useEffect to manage authentication state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  // Fetch notifications for authenticated users
  useEffect(() => {
    if (user) {
      const notificationsCollectionRef = collection(db, "notifications");
      const q = query(
        notificationsCollectionRef,
        where("userId", "==", user.uid)
      );

      const unsubscribeNotifications = onSnapshot(
        q,
        (snapshot) => {
          const userNotifications = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotifications(userNotifications);
          setNotificationCount(userNotifications.filter((n) => !n.read).length); // Count unread notifications
        },
        (err) => {
          console.error("Error fetching notifications:", err);
        }
      );

      return () => unsubscribeNotifications();
    } else {
      setNotifications([]);
      setNotificationCount(0);
    }
  }, [user]);

  // Close dropdowns if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen((prevState) => !prevState);
    setIsNotificationDropdownOpen(false);
  }, []);

  const toggleNotificationDropdown = useCallback(() => {
    setIsNotificationDropdownOpen((prevState) => !prevState);
    setIsDropdownOpen(false);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    setIsLoggingOut(true);

    // Smooth transition delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    await logout();
    setIsLoggingOut(false);
  };

  const getLinkClassName = (path) => {
    return `text-lg font-medium transition-colors duration-200 ${pathname === path
      ? "text-[var(--primary-blue)]"
      : "text-[var(--foreground)] hover:text-[var(--primary-blue)]"
      }`;
  };

  const getMobileLinkClassName = (path) => {
    return `text-xl font-medium py-2 ${pathname === path
      ? "text-[var(--primary-blue)]"
      : "text-[var(--foreground)] hover:text-[var(--primary-blue)]"
      }`;
  };

  return (
    <>
      {/* Logout Transition Overlay */}
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-white/95 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-center"
            >
              <div className="relative mb-8 flex justify-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full animate-pulse absolute blur-2xl opacity-50" />
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={180}
                  height={55}
                  className="relative z-10 w-auto h-14"
                />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Logging you out securely...
              </h2>
              <p className="text-slate-500 font-semibold uppercase tracking-[3px] text-xs">
                We hope to see you again soon!
              </p>

              <div className="mt-12 flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                    className="w-3 h-3 bg-blue-600 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-xl border-b border-slate-100/50 shadow-[0_4px_30px_rgba(0,0,0,0.02)] transition-all duration-500">
        {/* Redesigned Premium Top Bar */}
        <div className="bg-slate-900 text-slate-400 text-[10px] font-black uppercase tracking-[2px] border-b border-slate-800">
          <div className="container mx-auto px-6 py-2.5 flex justify-between items-center">
            <div className="hidden sm:flex items-center gap-2">
              <FaStar className="text-amber-400 animate-pulse text-[8px]" />
              <span className="text-slate-500 font-bold uppercase tracking-widest leading-none">The #1 Learning Platform for Future Leaders</span>
            </div>
            <div className="flex space-x-3 sm:space-x-6 items-center ml-auto">
              <button
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-white transition-colors group"
                onClick={setIsHowItWorksOpen}
              >
                <div className="w-5 h-5 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 transition-all">
                  <FaQuestionCircle className="text-[10px] text-blue-400 group-hover:text-white" />
                </div>
                <span className="text-[9px] sm:text-[10px]">How It Works</span>
              </button>
              <button
                className="hidden md:flex items-center gap-2 cursor-pointer hover:text-white transition-colors group"
                onClick={setIsOurTeamOpen}
              >
                <div className="w-5 h-5 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500 transition-all">
                  <FaUsers className="text-[10px] text-purple-400 group-hover:text-white" />
                </div>
                <span className="text-[9px] sm:text-[10px]">Our Team</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Header Content */}
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center group">
            <Link href="/" passHref className="flex items-center gap-4">
              <div className="relative p-2 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={110}
                  height={36}
                  className="w-auto h-10 object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-10">
            <Link href="/" className={getLinkClassName("/")}>
              Home
            </Link>
            <Link href="/about" className={getLinkClassName("/about")}>
              About Us
            </Link>
            {!user && (
              <Link href="/learning" className={getLinkClassName("/learning")}>
                Learning
              </Link>
            )}
            <Link href="/help" className={getLinkClassName("/help")}>
              Help
            </Link>
          </nav>

          {/* User Info or Sign In/Sign Up */}
          <div className="flex items-center gap-6">
            {user ? (
              <div className="relative flex items-center space-x-6">
                <div className="relative" ref={notificationRef}>
                  <button
                    onClick={toggleNotificationDropdown}
                    className="w-11 h-11 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all relative group"
                  >
                    <FaBell className="text-xl transition-transform group-hover:scale-110" />
                    {notificationCount > 0 && (
                      <span className="absolute top-2 right-2 bg-rose-500 text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                        {notificationCount}
                      </span>
                    )}
                  </button>
                  {isNotificationDropdownOpen && (
                    <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 py-3 z-50 overflow-hidden">
                      <div className="px-6 py-4 border-b border-slate-50">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Notifications</h3>
                      </div>
                      <div className="max-h-[350px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-6 py-10 text-center">
                            <p className="text-xs font-bold text-slate-400">No new adventures to report!</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className="px-6 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0"
                            >
                              <p className="text-xs font-semibold text-slate-700 leading-relaxed mb-1">{notification.message}</p>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                {new Date(
                                  notification.timestamp?.toDate()
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-50 transition-all group lg:pr-4"
                  >
                    <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="User Avatar"
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                          <FaUserCircle className="text-2xl" />
                        </div>
                      )}
                    </div>
                    <div className="hidden lg:flex flex-col items-start mr-1">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-0.5">Parent</span>
                      <FaCaretDown className={`text-slate-400 text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      className="absolute right-0 mt-4 w-60 bg-white rounded-[2rem] shadow-2xl border border-slate-50 py-3 z-50 overflow-hidden"
                    >
                      <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 mb-2">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[2px] mb-1">Signed in as</p>
                        <p className="text-xs font-black text-slate-800 truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-4 px-6 py-3.5 text-xs font-black text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        onClick={toggleDropdown}
                      >
                        <FontAwesomeIcon icon={faChartBar} className="text-base" />
                        DASHBOARD
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-4 px-6 py-3.5 text-xs font-black text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                        onClick={toggleDropdown}
                      >
                        <FontAwesomeIcon icon={faUser} className="text-base" />
                        MY PROFILE
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-6 py-3.5 text-xs font-black text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all border-t border-slate-50 mt-2"
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-base" />
                        SIGN OUT
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  className="hidden sm:block text-slate-600 font-black uppercase tracking-[2px] text-[10px] px-6 py-3 rounded-2xl hover:bg-slate-50 transition-all"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsRegister(false);
                  }}
                >
                  Log In
                </button>
                <button
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3.5 px-8 rounded-2xl font-black uppercase tracking-[2px] text-[10px] shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all hover:shadow-cyan-500/40"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsRegister(true);
                  }}
                >
                  Join Adventure
                </button>
              </div>
            )}

            {/* Hamburger for Mobile */}
            <div className="lg:hidden">
              <button
                className="w-11 h-11 bg-slate-50 flex items-center justify-center rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8h16M4 16h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </header>

      {/* Full-page Mobile Menu - rendered outside header to avoid stacking context clip */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-[320px] bg-white z-[300] shadow-2xl flex flex-col overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-5 border-b border-slate-100">
                <Link href="/" passHref onClick={() => setIsMenuOpen(false)}>
                  <div className="p-1.5 bg-slate-50 rounded-xl">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={100}
                      height={35}
                      className="w-auto h-8 object-contain"
                    />
                  </div>
                </Link>
                <button
                  className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close mobile menu"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col p-4 space-y-1 flex-grow">
                {[
                  { href: "/", label: "Home", icon: <FaHome /> },
                  { href: "/about", label: "About Us", icon: <FaInfoCircle /> },
                  ...(!user ? [{ href: "/learning", label: "Learning", icon: <FaGraduationCap /> }] : []),
                  { href: "/help", label: "Help", icon: <FaQuestionCircle /> },
                  { href: "/contact", label: "Contact", icon: <FaEnvelope /> },
                ].map((item, idx) => (
                  item.isButton ? (
                    <button
                      key={idx}
                      onClick={item.action}
                      className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all text-left w-full"
                    >
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 text-sm flex-shrink-0">
                        {item.icon}
                      </div>
                      <span className="text-sm font-bold">{item.label}</span>
                    </button>
                  ) : (
                    <Link
                      key={idx}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${pathname === item.href
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${pathname === item.href ? "bg-blue-100 text-blue-600" : "bg-slate-50 text-slate-400"
                        }`}>
                        {item.icon}
                      </div>
                      <span className="text-sm font-bold">{item.label}</span>
                    </Link>
                  )
                ))}

                {/* Authenticated User Section */}
                {user && (
                  <>
                    <div className="pt-4 mt-2 border-t border-slate-100">
                      <div className="px-4 py-3 mb-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-xs font-bold text-slate-700 truncate">{user.displayName || user.email}</p>
                      </div>
                      <Link
                        href="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 text-sm flex-shrink-0">
                          <FontAwesomeIcon icon={faChartBar} />
                        </div>
                        <span className="text-sm font-bold">Dashboard</span>
                      </Link>
                      <Link
                        href="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                      >
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 text-sm flex-shrink-0">
                          <FontAwesomeIcon icon={faUser} />
                        </div>
                        <span className="text-sm font-bold">My Profile</span>
                      </Link>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <button
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                      >
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 text-sm flex-shrink-0">
                          <FontAwesomeIcon icon={faSignOutAlt} />
                        </div>
                        <span className="text-sm font-bold">Sign Out</span>
                      </button>
                    </div>
                  </>
                )}

                {/* Not Authenticated - Auth Buttons */}
                {!user && (
                  <div className="mt-auto pt-6 border-t border-slate-100 space-y-3 px-2">
                    <button
                      className="w-full py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
                      onClick={() => { setIsModalOpen(true); setIsRegister(false); setIsMenuOpen(false); }}
                    >
                      Log In
                    </button>
                    <button
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-200/40 hover:shadow-blue-300/50 transition-all"
                      onClick={() => { setIsModalOpen(true); setIsRegister(true); setIsMenuOpen(false); }}
                    >
                      Join Adventure
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
