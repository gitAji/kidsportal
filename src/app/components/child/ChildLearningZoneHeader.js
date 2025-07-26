"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useChild } from '@/app/providers/ChildProvider';
import { useState, useEffect, useRef } from 'react';

export default function ChildLearningZoneHeader() {
  const { childUser } = useChild();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSignOut = () => {
    localStorage.removeItem('childUser');
    sessionStorage.removeItem('childUser');
    router.push('/child-login');
  };

  if (!childUser) {
    return null;
  }

  const avatarSrc = childUser.photoURL || '/images/cat.png'; // Fallback if photoURL is not available

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between relative">
      <div className="flex items-center">
        <Link href="/learning-zone">
          <Image src="/logo.png" alt="Logo" width={50} height={50} />
        </Link>
      </div>
      <div className="flex-grow text-center">
         <h1 className="text-2xl font-bold text-purple-600">Welcome, {childUser.name}!</h1>
         <p className='text-gray-500'>Grade: {childUser.grade}</p>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
          <Image src={avatarSrc} alt="Avatar" width={50} height={50} className="rounded-full" />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
            <Link href="/learning-zone/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
            <Link href="/learning-zone/rewards" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Achievements</Link>
            <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Sign Out</button>
          </div>
        )}
      </div>
    </header>
  );
}
