"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StickerBook from '../components/dashboard/StickerBook'; // Re-using the same component
import SkeletonLoader from '../components/ui/SkeletonLoader';
import { FaArrowLeft } from 'react-icons/fa';

export default function StickerBookPage() {
  const [childUser, setChildUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedChildUser = sessionStorage.getItem("childUser");
    if (storedChildUser) {
      setChildUser(JSON.parse(storedChildUser));
    } else {
      router.push("/child-login");
    }
    setLoading(false);
  }, [router]);

  if (loading) return <SkeletonLoader />;
  if (!childUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-200 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => router.push('/learning-zone/dashboard')} className="flex items-center text-lg font-semibold text-gray-700 hover:text-orange-600 mb-6">
          <FaArrowLeft className="mr-2" /> Back to Dashboard
        </button>
        <StickerBook collectedStickerIds={childUser.stickers} />
      </div>
    </div>
  );
}
