import React from 'react';
import Image from 'next/image';

const CountingQuiz = () => {
  const question = "How many apples do you see?";
  const options = ["2", "3", "4", "5"];
  const imageCount = 3;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 1: Counting Apples</h1>
      <p className="text-lg mb-4">{question}</p>
      <div className="flex mb-4">
        {[...Array(imageCount)].map((_, i) => (
          <Image key={i} src="/images/apple.png" alt="apple" width={96} height={96} />
        ))}
      </div>
      <div className="flex space-x-4">
        {options.map((option, index) => (
          <button key={index} className="bg-blue-500 text-white px-6 py-4 rounded-lg text-4xl font-bold">{option}</button>
        ))}
      </div>
    </div>
  );
};

export default CountingQuiz;