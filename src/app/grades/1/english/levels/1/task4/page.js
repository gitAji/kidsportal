import React from 'react';
import Image from 'next/image';

const WordScramblePage = () => {
  const words = [
    { scrambled: 'TCA', unscrambled: 'CAT', image: '/images/cat.png' },
    { scrambled: 'GDO', unscrambled: 'DOG', image: '/images/dog.png' },
    { scrambled: 'UNS', unscrambled: 'SUN', image: '/images/sun.png' },
    { scrambled: 'LABL', unscrambled: 'BALL', image: '/images/ball.png' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 4: Word Scramble</h1>
      <p className="text-lg mb-4">Unscramble the letters to form a word.</p>
      <div className="grid grid-cols-2 gap-4">
        {words.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 flex flex-col items-center">
            <Image src={item.image} alt={item.unscrambled} width={128} height={128} className="object-contain mb-4" />
            <div className="text-4xl font-bold mb-4 tracking-widest">{item.scrambled}</div>
            <input type="text" className="border-2 border-gray-400 rounded-lg w-32 h-16 text-2xl text-center" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default WordScramblePage;