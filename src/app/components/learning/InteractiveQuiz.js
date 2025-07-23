"use client";
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const InteractiveQuiz = ({ quizData, onCorrectAnswer, onWrongAnswer, currentQuestionNumber, totalQuestions }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const { questionText, options, correctAnswer, image } = quizData;

  const correctSound = useRef(null);
  const incorrectSound = useRef(null);

  useEffect(() => {
    correctSound.current = new Audio('/sounds/correct.mp3');
    incorrectSound.current = new Audio('/sounds/incorrect.mp3');
    
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [quizData]);

  const handleAnswerClick = (option) => {
    if (isCorrect !== null) return;

    setSelectedAnswer(option);
    const isAnswerCorrect = option === correctAnswer;
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      correctSound.current?.play();
    } else {
      incorrectSound.current?.play();
    }
  };

  const getButtonClass = (option) => {
    if (selectedAnswer === option) {
      return isCorrect ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600';
    }
    if (selectedAnswer && option === correctAnswer) {
        return 'bg-green-500 hover:bg-green-600';
    }
    return 'bg-blue-500 hover:bg-blue-600';
  };

  const handleNext = () => {
    if (isCorrect) {
      onCorrectAnswer();
    } else {
      onWrongAnswer();
    }
  };

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{quizData.title || 'Complete the Task'}</h1>
      <p className="text-2xl text-gray-700 mb-2">Question {currentQuestionNumber} of {totalQuestions}</p>
      <p className="text-xl md:text-2xl text-gray-600 mb-8">{questionText}</p>
      
      {image && (
        <div className="flex justify-center mb-8">
            <div className="mx-2 animate-bounce">
              <Image src={image.src} alt={image.alt} width={100} height={100} />
            </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {options && options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswerClick(option)}
            className={`text-white px-8 py-4 rounded-lg text-4xl font-bold shadow-lg transform transition-transform duration-200 hover:scale-105 ${getButtonClass(option)}`}
            disabled={isCorrect !== null}
          >
            {option}
          </button>
        ))}
      </div>

      {selectedAnswer !== null && (
        <div className={`flex items-center text-2xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
          <FontAwesomeIcon icon={isCorrect ? faCheckCircle : faTimesCircle} className="mr-2" />
          {isCorrect ? "Correct! Great job!" : "Not quite, try again!"}
        </div>
      )}

      {isCorrect !== null && (
        <button
          onClick={handleNext}
          className="mt-8 bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-purple-700 transform hover:scale-105 transition-transform duration-300 flex items-center gap-2 text-xl"
        >
          Next <FontAwesomeIcon icon={faArrowRight} />
        </button>
      )}
    </div>
  );
};

export default InteractiveQuiz;
