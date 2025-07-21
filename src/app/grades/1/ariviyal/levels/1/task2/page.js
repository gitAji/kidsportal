import React from 'react';
import Image from 'next/image';

const AnimalSoundsPage = () => {
  const animals = [
    { name: 'Cat', sound: 'Meow', image: '/images/cat.png' },
    { name: 'Dog', sound: 'Woof', image: '/images/dog.png' },
    { name: 'Bird', sound: 'Tweet', image: '/images/bird.png' },
    { name: 'Cow', sound: 'Moo', image: '/images/cow.png' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 2: Animal Sounds</h1>
      <p className="text-lg mb-4">Match the animal to its sound!</p>
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col space-y-4">
          {animals.map((animal, index) => (
            <div key={index} className="bg-blue-200 p-4 rounded-lg flex items-center">
              <Image src={animal.image} alt={animal.name} width={64} height={64} className="mr-4"/>
              <span className="text-2xl font-bold">{animal.name}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-4">
          {animals.sort(() => Math.random() - 0.5).map((animal, index) => (
            <div key={index} className="bg-green-200 p-4 rounded-lg text-2xl font-bold text-center cursor-pointer">
              {animal.sound}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalSoundsPage;