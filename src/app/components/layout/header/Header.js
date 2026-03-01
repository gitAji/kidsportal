"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "@/firebase/auth";
import { FaBell, FaUserCircle, FaCaretDown, FaQuestionCircle, FaInfoCircle, FaUsers, FaStar } from "react-icons/fa";
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
                className="flex items-center gap-1.5 sm:gap-2 cursor-pointer hover:text-white transition-colors group"
                onClick={setIsAboutUsOpen}
              >
                <div className="w-5 h-5 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                  <FaInfoCircle className="text-[10px] text-emerald-400 group-hover:text-white" />
                </div>
                <span className="text-[9px] sm:text-[10px]">About Us</span>
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

        {/* Full-page Mobile Menu */}
        {
          isMenuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black opacity-50 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="fixed inset-0 bg-[var(--background)] z-50 transform translate-x-0 transition-transform duration-300 ease-in-out">
                <div className="flex justify-between items-center p-6">
                  <Link href="/" passHref>
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      width={80}
                      height={50}
                      className="mr-2"
                    />
                  </Link>
                  <button
                    className="text-[var(--foreground)] focus:outline-none p-3"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close mobile menu"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <nav className="flex flex-col items-center space-y-4 p-6 w-full">
                  <Link
                    href="/"
                    className={getMobileLinkClassName("/")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                  {!user && (
                    <Link
                      href="/learning"
                      className={getMobileLinkClassName("/learning")}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Learning
                    </Link>
                  )}
                  <Link
                    href="/help"
                    className={getMobileLinkClassName("/help")}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Help
                  </Link>

                  {/* User Info in mobile menu */}
                  {user && (
                    <div className="mt-4">
                      <span className="text-[var(--foreground)] text-xl block mb-2">
                        Hello, {user.displayName || user.email}!
                      </span>
                      <Link
                        href="/dashboard"
                        className="flex items-center justify-center text-[var(--foreground)] text-xl hover:text-[var(--primary-blue)] mb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center justify-center text-[var(--foreground)] text-xl hover:text-[var(--primary-blue)] mb-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 text-lg mt-4 mx-auto w-full"
                      >
                        <FontAwesomeIcon
                          icon={faSignOutAlt}
                          className="mr-2 text-xl"
                        />
                        Sign Out
                      </button>
                    </div>
                  )}
                  {!user && (
                    <div className="flex flex-col space-y-4 w-full pt-4 border-t border-slate-100">
                      <button
                        className="bg-slate-50 text-slate-700 border-2 border-slate-200 py-4 px-6 rounded-3xl font-bold text-lg hover:bg-slate-100 transition-all duration-200 w-full"
                        onClick={() => {
                          setIsModalOpen(true);
                          setIsRegister(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        Log In
                      </button>
                      <button
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-6 rounded-3xl font-bold text-lg shadow-lg w-full"
                        onClick={() => {
                          setIsModalOpen(true);
                          setIsRegister(true);
                          setIsMenuOpen(false);
                        }}
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </nav>
              </div>
            </>
          )
        }
      </header>
    </>
  );
}
