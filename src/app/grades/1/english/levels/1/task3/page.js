import React from 'react';
import Image from 'next/image';

const MissingLettersPage = () => {
  const words = [
    { word: 'C_T', answer: 'A', image: '/images/cat.png' },
    { word: 'D_G', answer: 'O', image: '/images/dog.png' },
    { word: 'S_N', answer: 'U', image: '/images/sun.png' },
    { word: 'B_G', answer: 'I', image: '/images/bag.png' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 3: Missing Letters</h1>
      <p className="text-lg mb-4">Fill in the missing letter to complete the word.</p>
      <div className="grid grid-cols-2 gap-4">
        {words.map((item, index) => (
          <div key={index} className="border rounded-lg p-4 flex flex-col items-center">
            <Image src={item.image} alt={item.word} width={128} height={128} className="object-contain mb-4" />
            <div className="text-4xl font-bold mb-4 tracking-widest">{item.word}</div>
            <input type="text" maxLength="1" className="border-2 border-gray-400 rounded-lg w-16 h-16 text-4xl text-center" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MissingLettersPage;