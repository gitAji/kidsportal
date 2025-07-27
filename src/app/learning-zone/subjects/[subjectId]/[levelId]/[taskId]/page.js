"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dbData from '../../../../../data/db.json';
import KidFriendlyLoader from '../../../../../components/ui/KidFriendlyLoader';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaRedo, FaForward, FaVolumeUp, FaPaintBrush, FaKeyboard, FaHome } from 'react-icons/fa';
import { useChild } from '../../../../../providers/ChildProvider';
import AudioPlayer from '../../../../../components/ui/AudioPlayer';
import DrawingCanvas from '../../../../../components/ui/DrawingCanvas';
import VirtualKeyboard from '../../../../../components/ui/VirtualKeyboard';

export default function TaskContentPage() {
  const { childUser } = useChild();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { subjectId, levelId, taskId } = params;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [showReviewOption, setShowReviewOption] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0); // New state for time taken
  const [showDrawingTool, setShowDrawingTool] = useState(false); // State for drawing tool
  const [showKeyboard, setShowKeyboard] = useState(false); // State for virtual keyboard

  // Audio elements
  const correctSound = useMemo(() => typeof Audio !== 'undefined' ? new Audio('/sounds/correct.mp3') : null, []);
  const incorrectSound = useMemo(() => typeof Audio !== 'undefined' ? new Audio('/sounds/incorrect.mp3') : null, []);
  const completionSound = useMemo(() => typeof Audio !== 'undefined' ? new Audio('/sounds/completed.mp3') : null, []);

  useEffect(() => {
    if (childUser && childUser.gradeId) {
      const gradeData = dbData.grades.find(g => g.gradeId === childUser.gradeId);
      if (gradeData) {
        const foundSubject = gradeData.subjects.find(s => s.subjectId === subjectId);
        if (foundSubject) {
          const foundLevel = foundSubject.levels.find(l => l.levelId === levelId);
          if (foundLevel) {
            const foundTask = foundLevel.tasks.find(t => t.taskId === taskId);
            setTaskData(foundTask);
            // Initialize timer if it's a quiz or exam with a time limit
            if ((foundTask.type === 'quiz' || foundTask.type === 'exam') && foundTask.timeLimit) {
              setTimeLeft(foundTask.timeLimit);
              setTimerActive(true);
            }
          } else {
            console.warn(`Level data not found for levelId: ${levelId}`);
          }
        } else {
          console.warn(`Subject data not found for subjectId: ${subjectId}`);
        }
      }
    } else if (!childUser) {
      router.push("/child-login");
    }
    setLoading(false);
  }, [childUser, subjectId, levelId, taskId, router]);

  // Timer useEffect
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
      setTimeTaken(prevTime => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  // Handle timer expiry
  useEffect(() => {
    if (timeLeft <= 0 && timerActive) {
      setTimerActive(false);
      setQuizCompleted(true);
      setFeedbackMessage({ type: 'wrong', message: 'Time\'s up!' });
      completionSound?.play(); // Play completion sound on time up
    }
  }, [timeLeft, timerActive, completionSound]);

  const currentQuestion = taskData?.questions?.[currentQuestionIndex];

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;

    const isCorrect = userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();

    if (isCorrect) {
      setFeedbackMessage({ type: 'correct', message: 'Well Done! You earned 10 points!' });
      setScore(prevScore => prevScore + 10);
      setCorrectAnswersCount(prevCount => prevCount + 1);
      setShowReviewOption(false);
      correctSound?.play(); // Play correct sound
    } else {
      setFeedbackMessage({ type: 'wrong', message: 'Oops! That\'s not quite right.' });
      setWrongAnswersCount(prevCount => prevCount + 1);
      if (taskData.type === 'quiz') {
        setShowReviewOption(true);
      }
      incorrectSound?.play(); // Play incorrect sound
    }
    setTimerActive(false); // Pause timer on answer submission
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setFeedbackMessage(null);
    setShowReviewOption(false);
    if (currentQuestionIndex < taskData.questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setTimerActive(true);
    } else {
      setQuizCompleted(true);
      setTimerActive(false);
      completionSound?.play(); // Play completion sound
    }
  };

  const handleSkip = () => {
    setWrongAnswersCount(prevCount => prevCount + 1);
    handleNextQuestion();
  };

  const handleReview = () => {
    setFeedbackMessage(null);
    setShowReviewOption(false);
    setTimerActive(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (key) => {
    if (key === 'Backspace') {
      setUserAnswer(prevAnswer => prevAnswer.slice(0, -1));
    } else if (key === ' ') {
      setUserAnswer(prevAnswer => prevAnswer + ' ');
    } else {
      setUserAnswer(prevAnswer => prevAnswer + key);
    }
  };

  if (loading) return <KidFriendlyLoader />;
  if (!childUser) return null;
  if (!taskData) return <div className="text-center p-10">Task not found.</div>;
  if (!taskData.questions || taskData.questions.length === 0) return <div className="text-center p-10">No questions found for this task.</div>;

  if (quizCompleted) {
    const totalQuestions = taskData.questions.length;
    const percentageCorrect = (correctAnswersCount / totalQuestions) * 100;
    let medal = '';
    let medalColor = 'text-gray-500';

    if (percentageCorrect === 100) {
      medal = '🏆 Gold Medal!';
      medalColor = 'text-yellow-500';
    } else if (percentageCorrect >= 75) {
      medal = '🥈 Silver Medal!';
      medalColor = 'text-gray-400';
    } else if (percentageCorrect >= 50) {
      medal = '🥉 Bronze Medal!';
      medalColor = 'text-orange-500';
    }

    return (
      <div className="p-4 text-center bg-white rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">Task Completed!</h1>
        <p className="text-2xl text-gray-800 mb-2">Your Score: <span className="font-bold text-green-600">{score} points</span></p>
        <p className="text-xl text-gray-700 mb-2">Correct Answers: <span className="font-bold text-green-500">{correctAnswersCount}</span> / {totalQuestions}</p>
        <p className="text-xl text-gray-700 mb-4">Wrong Answers: <span className="font-bold text-red-500">{wrongAnswersCount}</span> / {totalQuestions}</p>
        {taskData.type !== 'lesson' && (
          <p className="text-xl text-gray-700 mb-4">Time Taken: <span className="font-bold">{formatTime(timeTaken)}</span></p>
        )}
        {medal && <p className={`text-3xl font-bold mb-6 ${medalColor}`}>{medal}</p>}
        <button onClick={() => router.back()} className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors duration-200">
          Back to Levels
        </button>
      </div>
    );
  }

  const totalQuestions = taskData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.back()} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
          <FaArrowLeft className="text-xl" />
        </button>
        <button onClick={() => router.push('/learning-zone')} className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700">
          <FaHome className="text-xl" />
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{taskData.taskName}</h1>

      {(taskData.type === 'quiz' || taskData.type === 'exam') && (
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold text-gray-700">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          {taskData.timeLimit && (
            <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
              Time Left: {formatTime(timeLeft)}
            </div>
          )}
        </div>
      )}

      {(taskData.type === 'quiz' || taskData.type === 'exam') && (
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-green-500 h-4 rounded-full text-xs flex items-center justify-center text-white"
            style={{ width: `${progress}%` }}
          >
            {score} Points
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <p className="text-xl font-medium mb-4 flex items-center">
          {currentQuestionIndex + 1}. {currentQuestion.questionText}
          <AudioPlayer text={currentQuestion.questionText} />
        </p>

        {currentQuestion.options && (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => setUserAnswer(option)}
                className={`w-full text-left p-3 rounded-lg border-2 ${userAnswer === option ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'} transition-colors duration-200 flex items-center`}
                disabled={feedbackMessage !== null}
              >
                {option}
                <AudioPlayer text={option} />
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'identification' && (
          <>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-3 mt-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Type your answer here..."
              disabled={feedbackMessage !== null}
            />
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowKeyboard(!showKeyboard)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center mx-auto"
              >
                <FaKeyboard className="text-2xl" />
              </button>
            </div>
            {showKeyboard && (
              <VirtualKeyboard onKeyPress={handleKeyPress} />
            )}
          </>
        )}

        {/* Drawing Tool Toggle */}
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowDrawingTool(!showDrawingTool)}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg text-lg hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center mx-auto"
          >
            <FaPaintBrush className="text-2xl" />
          </button>
        </div>

        {showDrawingTool && (
          <div className="mt-4">
            <DrawingCanvas width={600} height={400} />
            <p className="text-sm text-gray-500 mt-2">Use this space to practice writing. Your drawing will not be submitted as an answer.</p>
          </div>
        )}

        {feedbackMessage && (
          <div className={`mt-4 p-3 rounded-lg text-center font-bold ${feedbackMessage.type === 'correct' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedbackMessage.type === 'correct' ? <FaCheckCircle className="inline-block mr-2" /> : <FaTimesCircle className="inline-block mr-2" />}
            {feedbackMessage.message}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {!feedbackMessage ? (
            <button
              onClick={handleSubmitAnswer}
              className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition-colors duration-200"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors duration-200"
            >
              {currentQuestionIndex < taskData.questions.length - 1 ? 'Next Question' : 'View Results'}
            </button>
          )}

          {!feedbackMessage && taskData.type === 'quiz' && (
            <button
              onClick={handleSkip}
              className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg text-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Skip
            </button>
          )}

          {showReviewOption && taskData.type === 'quiz' && (
            <button
              onClick={handleReview}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-yellow-600 transition-colors duration-200"
            >
              <FaRedo className="inline-block mr-2" /> Review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}