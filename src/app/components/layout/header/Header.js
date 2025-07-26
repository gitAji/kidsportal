"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "../../../../firebase/auth";
import { FaBell, FaUserCircle, FaCaretDown } from "react-icons/fa";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

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
    await logout();
    setIsDropdownOpen(false);
  };

  const getLinkClassName = (path) => {
    return `text-lg font-medium transition-colors duration-200 ${
      pathname === path
        ? "text-[var(--primary-blue)]"
        : "text-[var(--foreground)] hover:text-[var(--primary-blue)]"
    }`;
  };

  const getMobileLinkClassName = (path) => {
    return `text-xl font-medium py-2 ${
      pathname === path
        ? "text-[var(--primary-blue)]"
        : "text-[var(--foreground)] hover:text-[var(--primary-blue)]"
    }`;
  };

  return (
    <header className="bg-white shadow-md relative">
      {/* Top Bar with Links */}
      <div className="bg-gray-100 text-gray-600 text-xs uppercase font-semibold">
        <div className="container mx-auto p-2 flex justify-end space-x-4 items-center">
          <a
            className="cursor-pointer hover:text-[var(--primary-blue)]"
            onClick={setIsHowItWorksOpen}
          >
            How It Works
          </a>
          <a
            className="cursor-pointer hover:text-[var(--primary-blue)]"
            onClick={setIsAboutUsOpen}
          >
            About Us
          </a>
          <a
            className="cursor-pointer hover:text-[var(--primary-blue)]"
            onClick={setIsOurTeamOpen}
          >
            Our Team
          </a>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="container mx-auto p-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" passHref>
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={50}
              className="mr-2"
            />
          </Link>
        </div>

        {/* Hamburger for Mobile */}
        <div className="md:hidden flex items-center">
          {user && (
            <div className="relative mr-4">
              <FaBell
                className="text-[var(--foreground)] text-xl cursor-pointer"
                onClick={toggleNotificationDropdown}
              />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-2 text-sm text-gray-700">
                      No new notifications
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-2 text-sm text-gray-700 border-b last:border-b-0"
                      >
                        <p>{notification.message}</p>
                        <span className="text-xs text-gray-600">
                          {new Date(
                            notification.timestamp?.toDate()
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
          <button
            className="text-[var(--foreground)] focus:outline-none p-3"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className={getLinkClassName("/")}>
            Home
          </Link>
          <Link href="/learning" className={getLinkClassName("/learning")}>
            Learning
          </Link>
          <Link href="/analytics" className={getLinkClassName("/analytics")}>
            Analytics
          </Link>
          <Link href="/pricing" className={getLinkClassName("/pricing")}>
            Pricing
          </Link>
          <Link href="/help" className={getLinkClassName("/help")}>
            Help
          </Link>
        </nav>

        {/* User Info or Sign In/Sign Up */}
        <div className="hidden md:flex space-x-4 items-center">
          {user ? (
            <div className="relative flex items-center space-x-4">
              <div className="relative" ref={notificationRef}>
                <FaBell
                  className="text-[var(--foreground)] text-xl cursor-pointer"
                  onClick={toggleNotificationDropdown}
                />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-gray-700">
                        No new notifications
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="px-4 py-2 text-sm text-gray-700 border-b last:border-b-0"
                        >
                          <p>{notification.message}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(
                              notification.timestamp?.toDate()
                            ).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-[var(--foreground)] focus:outline-none"
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <FaUserCircle className="text-[var(--foreground)] text-3xl" />
                  )}
                  <FaCaretDown className="ml-1 text-[var(--foreground)]" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleDropdown}
                    >
                      <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleDropdown}
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <button
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200"
                onClick={() => {
                  setIsModalOpen(false);
                  setIsRegister(false);
                }}
              >
                Login
              </button>
              <button
                className="bg-[var(--primary-blue)] text-white py-2 px-4 rounded hover:bg-[var(--primary-blue)]/80 transition-colors duration-200"
                onClick={() => {
                  setIsModalOpen(true);
                  setIsRegister(true);
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Full-page Mobile Menu */}
      {isMenuOpen && (
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
              <Link
                href="/learning"
                className={getMobileLinkClassName("/learning")}
                onClick={() => setIsMenuOpen(false)}
              >
                Learning
              </Link>
              <Link
                href="/analytics"
                className={getMobileLinkClassName("/analytics")}
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link
                href="/pricing"
                className={getMobileLinkClassName("/pricing")}
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
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
                <div className="flex flex-col space-y-4 w-full">
                  <button
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-200"
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsRegister(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="bg-[var(--primary-blue)] text-white py-2 px-4 rounded hover:bg-[var(--primary-blue)]/80 transition-colors duration-200"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsRegister(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    Register
                  </button>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
