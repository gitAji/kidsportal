"use client";
import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

// This would typically come from a database or a more robust config file
const ALL_STICKERS = [
  { id: 1, name: 'Super Star', image: '/images/sticker-star.png' },
  { id: 2, name: 'Awesome Apple', image: '/images/sticker-apple.png' },
  { id: 3, name: 'Brave Balloon', image: '/images/sticker-balloon.png' },
  { id: 4, name: 'Clever Cat', image: '/images/sticker-cat.png' },
  { id: 5, name: 'Daring Dinosaur', image: '/images/sticker-dino.png' },
  { id: 6, name: 'Friendly Frog', image: '/images/sticker-frog.png' },
];

const StickerBook = ({ collectedStickerIds }) => {
  const collected = collectedStickerIds || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <FaStar className="mr-3 text-yellow-400" /> My Sticker Collection
      </h3>
      
      {collected.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-600">Your sticker book is empty. Complete tasks to earn new stickers!</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {ALL_STICKERS.map(sticker => {
            const isCollected = collected.includes(sticker.id);
            return (
              <div
                key={sticker.id}
                className={`p-4 rounded-lg text-center transition-all duration-300 ${
                  isCollected ? 'bg-yellow-100 shadow-lg' : 'bg-gray-200 opacity-50'
                }`}
                title={isCollected ? sticker.name : 'Sticker Locked'}
              >
                <div className="relative w-full h-24">
                  <Image
                    src={sticker.image}
                    alt={sticker.name}
                    layout="fill"
                    objectFit="contain"
                    className={isCollected ? '' : 'grayscale'}
                  />
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-700 truncate">
                  {isCollected ? sticker.name : '???'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StickerBook;