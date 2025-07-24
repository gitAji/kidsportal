import React from 'react';
import { FaStar } from 'react-icons/fa';
import Image from 'next/image';

const stickers = [
  { id: 1, name: 'Awesome Apple', image: '/images/apple.png' },
  { id: 2, name: 'Brave Banana', image: '/images/banana.png' },
  { id: 3, name: 'Cool Cat', image: '/images/cat.png' },
  { id: 4, name: 'Daring Dog', image: '/images/dog.png' },
  { id: 5, name: 'Rainbow', image: '/images/rainbow.png' },
  { id: 6, name: 'Super Star', image: '/images/star.png' },
  
];

const StickerBook = ({ collectedStickers }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-purple-600 flex items-center">
        <FaStar className="mr-2" /> Your Sticker Collection
      </h3>
      {(!collectedStickers || collectedStickers.length === 0) && (
        <div className="text-center text-gray-500">
          <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
          <p>You haven&apos;t collected any stickers yet. Complete tasks to earn them!</p>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stickers.map(sticker => {
          const isCollected = collectedStickers && collectedStickers.includes(sticker.id);
          return (
            <div
              key={sticker.id}
              className={`p-4 rounded-lg shadow-md text-center transition-transform transform hover:scale-105 ${
                isCollected ? 'bg-yellow-100' : 'bg-gray-100'
              }`}
            >
              <div className={`relative w-24 h-24 mx-auto mb-2 ${!isCollected && 'opacity-25'}`}>
                <Image
                  src={sticker.image}
                  alt={sticker.name}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <p className="font-semibold text-gray-800">{sticker.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StickerBook;
