import React from 'react';

const MultipleChoicePage = () => {
  const question = "What is 5 x 3?";
  const options = ["10", "15", "20", "25"];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 1: Multiple Choice</h1>
      <p className="text-lg mb-4">{question}</p>
      <div className="flex flex-col space-y-2">
        {options.map((option, index) => (
          <button key={index} className="bg-blue-200 p-4 rounded-lg text-left">{option}</button>
        ))}
      </div>
    </div>
  );
};

export default MultipleChoicePage;
