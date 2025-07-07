"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "../../../../firebase/auth";

export default function Header({ setIsModalOpen, setIsRegister }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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
            onClick={() => setIsMenuOpen(true)} // Open menu on click
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
            <div className="flex items-center space-x-4">
              {user.photoURL && (
                <Image
                  src={user.photoURL}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              <span className="text-gray-600 font-medium">
                {user.displayName || user.email}
              </span>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600">
                Profile
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                className="text-gray-600 hover:text-blue-600"
                onClick={() => {
                  setIsModalOpen(true); // Open the modal
                  setIsRegister(false); // Set to login mode
                }}
              >
                Sign In
              </button>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={() => {
                  setIsModalOpen(true); // Open the modal
                  setIsRegister(true); // Set to signup mode
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
            onClick={() => setIsMenuOpen(false)} // Close menu when clicking outside
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
                onClick={() => setIsMenuOpen(false)} // Close the menu
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
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                Home
              </Link>
              <Link
                href="/learning"
                className="text-gray-600 text-xl hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                Learning
              </Link>
              <Link
                href="/analytics"
                className="text-gray-600 text-xl hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                Analytics
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 text-xl hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                Pricing
              </Link>
              <Link
                href="/help"
                className="text-gray-600 text-xl hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                Help
              </Link>

              {/* Sign In & Sign Up / User Info in mobile menu */}
              {user ? (
                <>
                  <span className="text-gray-600 text-xl">Hello, {user.displayName || user.email}!</span>
                  <Link href="/dashboard" className="text-gray-600 text-xl hover:text-blue-600">
                    Dashboard
                  </Link>
                  <Link href="/profile" className="text-gray-600 text-xl hover:text-blue-600">
                    Profile
                  </Link>
                  <button
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 text-xl mt-4 mx-auto w-32"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false); // Close the mobile menu
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="text-gray-600 text-xl hover:text-blue-600"
                    onClick={() => {
                      setIsModalOpen(true); // Open the modal
                      setIsRegister(false); // Set to login mode
                      setIsMenuOpen(false); // Close the mobile menu
                    }}
                  >
                    Sign In
                  </button>
                  <button
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-xl mt-4 mx-auto w-32"
                    onClick={() => {
                      setIsModalOpen(true); // Open the modal
                      setIsRegister(true); // Set to signup mode
                      setIsMenuOpen(false); // Close the mobile menu
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
