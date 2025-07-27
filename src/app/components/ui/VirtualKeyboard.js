"use client";

import React from 'react';

const keyboardLayout = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  [' ', 'Backspace'], // Space and Backspace
];

export default function VirtualKeyboard({ onKeyPress }) {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {row.map((key, keyIndex) => (
            <button
              key={keyIndex}
              onClick={() => onKeyPress(key)}
              className={`m-1 p-3 rounded-md font-semibold text-lg transition-colors duration-150
                ${key === 'Backspace' ? 'bg-red-400 hover:bg-red-500 text-white w-24' :
                  key === ' ' ? 'bg-blue-400 hover:bg-blue-500 text-white flex-grow' :
                  'bg-blue-200 hover:bg-blue-300 text-gray-800 w-10'}
              `}
              style={{ minWidth: key === ' ' ? '100px' : '40px' }} // Adjust width for spacebar
            >
              {key === ' ' ? 'Space' : key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
