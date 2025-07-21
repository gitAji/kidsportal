import React from 'react';
import Image from 'next/image';

const FruitIdentificationPage = () => {
  const fruits = [
    { name: 'Apple', image: '/images/apple.png' },
    { name: 'Banana', image: '/images/banana.png' },
    { name: 'Orange', image: '/images/orange.png' },
    { name: 'Grapes', image: '/images/grapes.png' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 3: Identify the Fruits</h1>
      <p className="text-lg mb-4">Click on the pictures of the fruits.</p>
      <div className="grid grid-cols-4 gap-4">
        {fruits.map((fruit, index) => (
          <div key={index} className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-green-100">
            <Image src={fruit.image} alt={fruit.name} width={128} height={128} className="object-contain mb-2" />
            <span className="text-xl">{fruit.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FruitIdentificationPage;