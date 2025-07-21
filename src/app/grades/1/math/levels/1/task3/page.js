import React from 'react';
import Image from 'next/image';

const SubtractionPage = () => {
  const problems = [
    { num1: 5, num2: 2, answer: 3 },
    { num1: 4, num2: 1, answer: 3 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task 3: Simple Subtraction</h1>
      <p className="text-lg mb-4">Solve the subtraction problems.</p>
      <div className="space-y-8">
        {problems.map((problem, index) => (
          <div key={index} className="border rounded-lg p-4 flex items-center justify-center">
            <div className="flex">
              {[...Array(problem.num1)].map((_, i) => <Image key={i} src="/images/apple.png" alt="" width={48} height={48} />)}
            </div>
            <div className="text-4xl font-bold mx-4">-</div>
            <div className="flex">
              {[...Array(problem.num2)].map((_, i) => <Image key={i} src="/images/apple.png" alt="" width={48} height={48} />)}
            </div>
            <div className="text-4xl font-bold mx-4">=</div>
            <input type="text" maxLength="2" className="border-2 border-gray-400 rounded-lg w-24 h-24 text-4xl text-center" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubtractionPage;