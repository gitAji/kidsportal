import React from 'react';

const AlphabetQuiz = () => {
  const question = "What letter comes after 'B'?";
  const options = ["A", "C", "D", "E"];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 1: Alphabet Fun</h1>
      <p className="text-lg mb-4">{question}</p>
      <div className="flex space-x-4">
        {options.map((option, index) => (
          <button key={index} className="bg-blue-500 text-white px-6 py-4 rounded-lg text-4xl font-bold">{option}</button>
        ))}
      </div>
    </div>
  );
};

export default AlphabetQuiz;