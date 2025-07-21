import React from 'react';

const BiggerNumberPage = () => {
  const pairs = [
    { num1: 5, num2: 8 },
    { num1: 9, num2: 3 },
    { num1: 2, num2: 7 },
    { num1: 6, num2: 4 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 4: Which Number is Bigger?</h1>
      <p className="text-lg mb-4">Click on the bigger number in each pair.</p>
      <div className="grid grid-cols-2 gap-8">
        {pairs.map((pair, index) => (
          <div key={index} className="border rounded-lg p-4 flex items-center justify-around">
            <button className="bg-blue-500 text-white px-8 py-6 rounded-lg text-6xl font-bold">{pair.num1}</button>
            <button className="bg-green-500 text-white px-8 py-6 rounded-lg text-6xl font-bold">{pair.num2}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiggerNumberPage;