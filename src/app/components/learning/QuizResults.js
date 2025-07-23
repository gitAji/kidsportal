"use client";

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faRedo } from '@fortawesome/free-solid-svg-icons';

const QuizResults = ({ score, total, onRetry }) => {
  const percentage = Math.round((score / total) * 100);

  return (
    <div className="text-center p-8">
      <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
      <div className="mb-4">
        <FontAwesomeIcon icon={faTrophy} className="text-yellow-400 text-7xl animate-bounce" />
      </div>
      <p className="text-xl mb-2">You scored</p>
      <p className="text-5xl font-bold text-blue-600 mb-4">{percentage}%</p>
      <p className="text-lg mb-6">({score} out of {total} correct)</p>
      <button
        onClick={onRetry}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
      >
        <FontAwesomeIcon icon={faRedo} className="mr-2" />
        Try Again
      </button>
    </div>
  );
};

export default QuizResults;
