import React from 'react';
import Image from 'next/image';

const LivingThingsQuiz = () => {
  const question = "Which of these is a living thing?";
  const options = [
    { name: "Cat", image: "/images/cat.png", isCorrect: true },
    { name: "Car", image: "/images/hotwheels.png", isCorrect: false },
    { name: "Cloud", image: "/images/cloud.png", isCorrect: false },
    { name: "Ball", image: "/images/ball.png", isCorrect: false },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 1: Living and Non-Living Things</h1>
      <p className="text-lg mb-4">{question}</p>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <div key={index} className="border rounded-lg p-4 flex flex-col items-center cursor-pointer hover:bg-blue-100">
            <Image src={option.image} alt={option.name} width={128} height={128} className="object-contain mb-2" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">{option.name}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivingThingsQuiz;