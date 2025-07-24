"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CorrectAnswerAnimation, IncorrectAnswerAnimation, LevelCompleteAnimation } from '../../components/ui/FeedbackAnimations';
import ProgressBar from '../../components/ui/ProgressBar';
import db from '../../../../public/db.json';

const TaskPage = () => {
  const { subjectId, levelId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showIncorrectAnimation, setShowIncorrectAnimation] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const storedProgress = localStorage.getItem(taskId);
    if (storedProgress) {
      const { currentQuestionIndex: storedIndex, score: storedScore } = JSON.parse(storedProgress);
      setCurrentQuestionIndex(storedIndex);
      setScore(storedScore);
    }

    const grade = db.grades.find(g => g.subjects.some(s => s.subjectId === subjectId));
    if (grade) {
      const subject = grade.subjects.find(s => s.subjectId === subjectId);
      if (subject) {
        const level = subject.levels.find(l => l.levelId === levelId);
        if (level) {
          const foundTask = level.tasks.find(t => t.taskId === taskId);
          setTask(foundTask);
        }
      }
    }
  }, [subjectId, levelId, taskId]);

  useEffect(() => {
    if (task) {
      const newProgress = (currentQuestionIndex / task.questions.length) * 100;
      setProgress(newProgress);
      localStorage.setItem(taskId, JSON.stringify({ currentQuestionIndex, score }));
    }
  }, [currentQuestionIndex, score, task, taskId]);

  const handleAnswer = (selectedOption) => {
    const currentQuestion = task.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
      setShowCorrectAnimation(true);
    } else {
      setShowIncorrectAnimation(true);
    }
  };

  const handleAnimationComplete = () => {
    setShowCorrectAnimation(false);
    setShowIncorrectAnimation(false);
    if (currentQuestionIndex < task.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowLevelComplete(true);
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  const currentQuestion = task.questions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{task.taskName}</h1>
      <ProgressBar progress={progress} />
      {currentQuestion ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">{currentQuestion.questionText}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No questions in this task.</h2>
        </div>
      )}
      {showCorrectAnimation && <CorrectAnswerAnimation onComplete={handleAnimationComplete} />}
      {showIncorrectAnimation && <IncorrectAnswerAnimation onComplete={handleAnimationComplete} />}
      {showLevelComplete && <LevelCompleteAnimation onComplete={() => router.push(`/learning/${subjectId}/${levelId}`)} />}
    </div>
  );
};

export default TaskPage;