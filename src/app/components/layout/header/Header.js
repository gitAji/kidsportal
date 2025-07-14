"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "../../../../firebase/auth";
import { FaBell, FaUserCircle, FaCaretDown } from 'react-icons/fa'; // Import icons
import { collection, query, where, onSnapshot } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../../../firebase/config'; // Import db
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

export default function Header({ setIsModalOpen, setIsRegister }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false); 
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [notificationCount, setNotificationCount] = useState(0); 

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null); 

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      const notificationsCollectionRef = collection(db, 'notifications');
      const q = query(notificationsCollectionRef, where("userId", "==", user.uid));

      const unsubscribeNotifications = onSnapshot(q, (snapshot) => {
        const userNotifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(userNotifications);
        setNotificationCount(userNotifications.filter(n => !n.read).length); // Count unread notifications
      }, (err) => {
        console.error("Error fetching notifications:", err);
      });

      return () => unsubscribeNotifications();
    } else {
      setNotifications([]);
      setNotificationCount(0);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsNotificationDropdownOpen(false); 
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsDropdownOpen(false); 
  };

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false); 
  };

  return (
    <header className="bg-white shadow">
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

        {/* Hamburger icon for mobile */}
        <div className="md:hidden">
          <button
            className="text-gray-600 focus:outline-none"
            onClick={() => setIsMenuOpen(true)} 
          >
            <svg
              className="w-6 h-6"
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
          <Link href="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link href="/learning" className="text-gray-600 hover:text-blue-600">
            Learning
          </Link>
          <Link href="/analytics" className="text-gray-600 hover:text-blue-600">
            Analytics
          </Link>
          <Link href="/pricing" className="text-gray-600 hover:text-blue-600">
            Pricing
          </Link>
          <Link href="/help" className="text-gray-600 hover:text-blue-600">
            Help
          </Link>
        </nav>

        {/* User Info or Sign In/Sign Up Buttons */}
        <div className="hidden md:flex space-x-4 items-center">
          {user ? (
            <div className="relative flex items-center space-x-4">
              {/* Notification Icon */}
              <div className="relative" ref={notificationRef}>
                <FaBell className="text-gray-600 text-xl cursor-pointer" onClick={toggleNotificationDropdown} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
                {isNotificationDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-gray-700">No new notifications</p>
                    ) : (
                      notifications.map(notification => (
                        <div key={notification.id} className="px-4 py-2 text-sm text-gray-700 border-b last:border-b-0">
                          <p>{notification.message}</p>
                          <span className="text-xs text-gray-500">{new Date(notification.timestamp?.toDate()).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* User Icon with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-gray-600 focus:outline-none"
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
                    <FaUserCircle className="text-gray-600 text-3xl" />
                  )}
                  <FaCaretDown className="ml-1 text-gray-600" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={toggleDropdown}>
                      <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                      Dashboard
                    </Link>
                    <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={toggleDropdown}>
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
                className="text-gray-600 hover:text-blue-600"
                onClick={() => {
                  setIsModalOpen(true); 
                  setIsRegister(false); 
                }}
              >
                Sign In
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={() => {
                  setIsModalOpen(true); 
                  setIsRegister(true); 
                }}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>

      {/* Full-page Slide-in Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)} 
          />

          {/* Full-page Slide-in Menu */}
          <div className="fixed inset-0 bg-white z-50 transform translate-x-0 transition-transform duration-300 ease-in-out">
            <div className="flex justify-between items-center p-6">
              {/* Logo inside the slide menu */}
              <Link href="/" passHref>
                <Image
                  src="/logo.png"
                  alt="Logo"
                  width={80}
                  height={50}
                  className="mr-2"
                />
              </Link>

              {/* Close button */}
              <button
                className="text-gray-600 focus:outline-none"
                onClick={() => setIsMenuOpen(false)} 
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

            {/* Menu Links */}
            <nav className="flex flex-col space-y-6 text-center mt-10">
              <Link
                href="/"
                className="text-gray-600 text-xl hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)} 
              >
                Home
              </Link>
              <Link
                href="/learning"
                className="text-gray-600 text-xl hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)} 
              >
                Learning
              </Link>
              <Link
                href="/analytics" 
                className="text-gray-600 text-xl hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)} 
              >
                Analytics
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 text-xl hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)} 
              >
                Pricing
              </Link>
              <Link
                href="/help"
                className="text-gray-600 text-xl hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)} 
              >
                Help
              </Link>

              {/* User Info in mobile menu */}
              {user && (
                <div className="mt-4">
                  <span className="text-gray-600 text-xl block mb-2">Hello, {user.displayName || user.email}!</span>
                  <Link href="/dashboard" className="flex items-center justify-center text-gray-600 text-xl hover:text-blue-600 mb-2" onClick={() => setIsMenuOpen(false)}>
                    <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                    Dashboard
                  </Link>
                  <Link href="/profile" className="flex items-center justify-center text-gray-600 text-xl hover:text-blue-600 mb-2" onClick={() => setIsMenuOpen(false)}>
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Profile
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 text-xl mt-4 mx-auto w-32"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
              {!user && (
                <>
                  <button
                    className="text-gray-600 text-xl hover:text-blue-600"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsRegister(false);
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-xl mt-4 mx-auto w-32"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsRegister(true);
                      setIsMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
