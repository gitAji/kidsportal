'use client';

import React, { useState } from 'react';

const QuizTaker = ({ quizData }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === quizData.questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 text-center">
        <h2 className="text-3xl font-bold text-[var(--deep-ocean)] mb-4">Quiz Results</h2>
        <p className="text-xl text-gray-700 mb-4">You scored {score} out of {quizData.questions.length}!</p>
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setSelectedAnswer('');
            setScore(0);
            setShowResults(false);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Retake Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-3xl font-bold text-[var(--deep-ocean)] mb-4">{quizData.title}</h2>
      <p className="text-xl text-gray-800 mb-4">Question {currentQuestionIndex + 1} of {quizData.questions.length}</p>
      <p className="text-lg text-gray-700 mb-6">{currentQuestion.questionText}</p>
      <div className="space-y-4">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(option)}
            className={`w-full text-left px-4 py-3 rounded-md border transition-colors duration-200
              ${selectedAnswer === option ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200'}`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmitAnswer}
        disabled={!selectedAnswer}
        className="mt-6 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Submit Answer
      </button>
    </div>
  );
};

export default QuizTaker;
