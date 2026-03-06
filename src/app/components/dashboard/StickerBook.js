"use client";
import React from 'react';
import Image from 'next/image';
import { FaStar, FaLock, FaBookOpen } from 'react-icons/fa';

const ALL_STICKERS = [
  { id: 1, name: 'Super Star', image: '/images/sticker-star.png', color: 'bg-yellow-100 border-yellow-300' },
  { id: 2, name: 'Awesome Apple', image: '/images/apple.png', color: 'bg-red-100 border-red-300' },
  { id: 3, name: 'Rainbow Magic', image: '/images/rainbow.png', color: 'bg-indigo-100 border-indigo-300' },
  { id: 4, name: 'Clever Cat', image: '/images/cat.png', color: 'bg-emerald-100 border-emerald-300' },
  { id: 5, name: 'Dashing Dog', image: '/images/dog.png', color: 'bg-amber-100 border-amber-300' },
  { id: 6, name: 'Brave Bird', image: '/images/bird.png', color: 'bg-cyan-100 border-cyan-300' },
  { id: 7, name: 'Speedy Wheels', image: '/images/hotwheels.png', color: 'bg-rose-100 border-rose-300' },
  { id: 8, name: 'Banana Power', image: '/images/banana.png', color: 'bg-yellow-50 border-yellow-200' },
];

const StickerBook = ({ collectedStickerIds }) => {
  const collected = collectedStickerIds || [];

  // Create a placeholder block if we still lack real images for fallback
  const handleImageError = (e) => {
    e.target.src = '/images/apple.png'; // Fallback
  };

  return (
    <div>
      <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
        <FaBookOpen className="text-violet-500" /> Virtual Sticker Album
      </h3>

      <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 p-8 rounded-3xl shadow-sm border border-violet-100">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600 font-medium">Stickers collected across all your adventures!</p>
          <div className="bg-white px-4 py-2 rounded-full font-black text-violet-600 shadow-sm border border-violet-200 text-sm">
            {collected.length} / {ALL_STICKERS.length} Collected
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {ALL_STICKERS.map(sticker => {
            const isCollected = collected.includes(sticker.id) || collected.length > 0; // if parents want to test, let's just make it visually striking if any
            const actualCollected = collected.includes(sticker.id);

            return (
              <div
                key={sticker.id}
                title={actualCollected ? sticker.name : 'Complete more activities to unlock!'}
                className={`relative group h-40 flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 border-2 ${actualCollected
                    ? `${sticker.color} shadow-sm hover:shadow-lg hover:-translate-y-1 hover:rotate-2 cursor-pointer`
                    : 'bg-slate-100/50 border-slate-200 border-dashed opacity-60' // not collected
                  }`}
              >
                {!actualCollected && (
                  <div className="absolute inset-0 bg-slate-200/20 backdrop-blur-[2px] rounded-3xl z-10 flex items-center justify-center">
                    <div className="bg-white p-3 rounded-full shadow-md text-slate-400">
                      <FaLock size={20} />
                    </div>
                  </div>
                )}

                <div className="relative w-20 h-20 mb-3 transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={sticker.image}
                    alt={sticker.name}
                    layout="fill"
                    objectFit="contain"
                    className={`drop-shadow-md ${actualCollected ? '' : 'filter grayscale opacity-30 contrast-200'}`}
                    onError={handleImageError}
                  />
                </div>

                <div className="w-full text-center">
                  <p className={`text-xs font-black uppercase tracking-wider truncate ${actualCollected ? 'text-slate-800' : 'text-slate-400'}`}>
                    {actualCollected ? sticker.name : 'Unknown Sticker'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StickerBook;