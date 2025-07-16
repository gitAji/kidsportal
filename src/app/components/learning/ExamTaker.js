'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ExamTaker = ({ questions, timeLimit, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const router = useRouter();

  const submitExam = useCallback(() => {
    // In a real app, you would send the answers to the server for grading.
    // For now, we'll just calculate the score on the client.
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] && answers[i].answer === questions[i].correctAnswer) {
        score++;
      }
    }
    const percentage = (score / questions.length) * 100;
    onComplete(percentage, timeLimit - timeLeft);
  }, [questions, answers, timeLimit, timeLeft, onComplete]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [submitExam]);

  const handleAnswer = (answer) => {
    setAnswers([...answers, { question: questions[currentQuestionIndex].id, answer }]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitExam();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-[var(--background-alt)] p-8 rounded-lg shadow-lg text-[var(--foreground)]">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Exam</h2>
        <div className="text-2xl font-bold">{formatTime(timeLeft)}</div>
      </div>
      <div>
        <h3 className="text-xl mb-4">{questions[currentQuestionIndex].question}</h3>
        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestionIndex].options.map(option => (
            <button 
              key={option}
              onClick={() => handleAnswer(option)}
              className="bg-[var(--primary-blue)] hover:bg-[var(--deep-ocean)] text-white font-bold py-4 px-8 rounded-lg transition duration-300"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamTaker;