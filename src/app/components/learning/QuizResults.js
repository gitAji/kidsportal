"use client";
import React from 'react';

const QuizResults = ({ score, total, onRetry }) => {
  return (
    <div>
      <h1>Quiz Results</h1>
      <p>You scored {score} out of {total}!</p>
      <button onClick={onRetry}>Retry</button>
    </div>
  );
};

export default QuizResults;
