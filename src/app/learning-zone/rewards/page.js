"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaStar, FaTrophy } from 'react-icons/fa';
import Image from 'next/image';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

export default function RewardsPage() {
  const [childUser, setChildUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stickers, setStickers] = useState([]);
  const [trophies, setTrophies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedChildUser = sessionStorage.getItem("childUser");
    if (storedChildUser) {
      const parsedUser = JSON.parse(storedChildUser);
      setChildUser(parsedUser);

      // For now, use sample data if no real data is available
      // In a real app, you'd fetch parsedUser.stickers and parsedUser.trophies from Firestore
      setStickers(parsedUser.stickers || [
        { id: 'sample-sticker-1', name: 'First Star', image: '/images/star.png' },
        { id: 'sample-sticker-2', name: 'Happy Learner', image: '/images/smile.png' },
      ]);
      setTrophies(parsedUser.trophies || [
        { id: 'sample-trophy-1', name: 'Bronze Medal', description: 'Completed 5 tasks' },
        { id: 'sample-trophy-2', name: 'Silver Cup', description: 'Scored 90% on a quiz' },
      ]);

    } else {
      router.push("/child-login");
    }
    setLoading(false);
  }, [router]);

  if (loading) return <SkeletonLoader />;
  if (!childUser) return null; // Redirecting

  return (
    <div className="p-4">
      <button onClick={() => router.back()} className="flex items-center text-lg font-semibold text-gray-700 hover:text-blue-600 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Dashboard
      </button>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Your Achievements</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center"><FaStar className="mr-2 text-yellow-500" /> Your Stickers</h2>
        {stickers.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {stickers.map(sticker => (
              <div key={sticker.id} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                {sticker.image && <Image src={sticker.image} alt={sticker.name} width={64} height={64} className="w-16 h-16 object-contain mb-2" />}
                <p className="text-sm font-medium text-gray-700 text-center">{sticker.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No stickers collected yet. Keep learning!</p>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4 flex items-center"><FaTrophy className="mr-2 text-orange-500" /> Your Trophies</h2>
        {trophies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {trophies.map(trophy => (
              <div key={trophy.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800">{trophy.name}</h3>
                <p className="text-gray-600 text-sm">{trophy.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">No trophies earned yet. Keep up the great work!</p>
        )}
      </div>
    </div>
  );
}
