'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ExamTaker from '@/app/components/learning/ExamTaker';

// Mock questions for the exam
const examQuestions = {
  '1-5': [
    { id: 1, question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4' },
    { id: 2, question: 'What is 5 - 3?', options: ['1', '2', '3', '4'], correctAnswer: '2' },
    { id: 3, question: 'What is 10 + 5?', options: ['12', '15', '18', '20'], correctAnswer: '15' },
  ],
};

const ExamPage = () => {
  const { gradeId, subjectId, levelId } = useParams();
  const router = useRouter();
  const [examCompleted, setExamCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);

  const handleExamComplete = (finalScore, time) => {
    setScore(finalScore);
    setTimeTaken(time);
    setExamCompleted(true);

    if (finalScore >= 80) {
      // Unlock the next level
      const nextLevel = parseInt(levelId) + 1;
      // In a real app, you would save the unlocked level to the database
      router.push(`/grades/${gradeId}/${subjectId}/levels/${nextLevel}`);
    } 
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} minutes and ${secs} seconds`;
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {!examCompleted ? (
          <ExamTaker 
            questions={examQuestions['1-5']} 
            timeLimit={300} // 5 minutes
            onComplete={handleExamComplete} 
          />
        ) : (
          <div className="bg-[var(--background-alt)] p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-3xl font-bold mb-4">Exam Completed!</h2>
            <p className="text-xl mb-4">Your score: {score.toFixed(2)}%</p>
            <p className="text-xl mb-4">Time taken: {formatTime(timeTaken)}</p>
            {score >= 80 ? (
              <p className="text-[var(--success-green)] font-bold">Congratulations! You have unlocked the next level.</p>
            ) : (
              <p className="text-[var(--error-red)] font-bold">You did not pass the exam. Please review the material and try again.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamPage;
