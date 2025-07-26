"use client";
import React, { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import Firebase Functions
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import useSound from 'use-sound';

const InteractiveQuiz = ({ task, childUser, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [playCorrect] = useSound('/sounds/correct.mp3');
  const [playIncorrect] = useSound('/sounds/incorrect.mp3');

  const currentQuestion = task.questions[currentQuestionIndex];

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
  }, [task]);

  const handleAnswerSelect = (option) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === currentQuestion.correctAnswer) {
      setScore(score + 1);
      playCorrect();
    } else {
      playIncorrect();
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < task.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setLoading(true);
      setError(null);
      try {
        const functions = getFunctions();
        const updateTaskProgress = httpsCallable(functions, 'updateTaskProgress');

        const result = await updateTaskProgress({
          childId: childUser.id,
          parentUid: childUser.parentUid,
          taskId: task.taskId,
          score: score,
        });
        
        if (result.data.success) {
          if (onQuizComplete) {
            onQuizComplete({
              taskId: task.taskId,
              pointsEarned: result.data.pointsEarned,
              stickerAwarded: result.data.stickerAwarded,
            });
          }
        } else {
          setError("Failed to save your progress. Please try again.");
        }
      } catch (err) {
        setError("An error occurred while saving your progress.");
        console.error("Error updating progress:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // UI remains the same
  return (
    <div>
      {/* Quiz UI */}
    </div>
  );
};

export default InteractiveQuiz;