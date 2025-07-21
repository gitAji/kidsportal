import React from 'react';
import Image from 'next/image';

const PictureWordMatch = () => {
  const items = [
    { name: 'Apple', image: '/images/apple.png' },
    { name: 'Ball', image: '/images/ball.png' },
    { name: 'Cat', image: '/images/cat.png' },
    { name: 'Dog', image: '/images/dog.png' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 2: Picture Word Match</h1>
      <p className="text-lg mb-4">Match the picture to the correct word.</p>
      <div className="grid grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-4">
          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100">
              <Image src={item.image} alt={item.name} width={96} height={96} className="object-contain" />
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-4 justify-around">
          {items.sort(() => Math.random() - 0.5).map((item, index) => (
            <div key={index} className="bg-green-200 p-4 rounded-lg text-2xl font-bold text-center cursor-pointer">
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PictureWordMatch;