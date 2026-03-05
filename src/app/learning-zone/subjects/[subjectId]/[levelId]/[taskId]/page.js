"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SkeletonLoader from '../../../../../components/ui/SkeletonLoader';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaRedo, FaForward, FaPaintBrush, FaKeyboard, FaHome, FaStar, FaTrophy, FaMedal, FaGift } from 'react-icons/fa';
import { useChild } from '../../../../../providers/ChildProvider';
import AudioPlayer from '../../../../../components/ui/AudioPlayer';
import DrawingCanvas from '../../../../../components/ui/DrawingCanvas';
import VirtualKeyboard from '../../../../../components/ui/VirtualKeyboard';
import InteractiveLesson from '../../../../../components/ui/InteractiveLesson';
import { motion, AnimatePresence } from "framer-motion";
import confetti from 'canvas-confetti';
import { recordTaskCompletion, checkAchievements } from '../../../../../utils/achievements';
import { saveChildStats, recordAchievement } from '../../../../../utils/firestoreService';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

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
  const [timeTaken, setTimeTaken] = useState(0);
  const [showDrawingTool, setShowDrawingTool] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [retriedThisTask, setRetriedThisTask] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);

  const correctSound = useMemo(() => typeof Audio !== 'undefined' ? new Audio('/sounds/correct.mp3') : null, []);
  const incorrectSound = useMemo(() => typeof Audio !== 'undefined' ? new Audio('/sounds/incorrect.mp3') : null, []);
  const completionSound = useMemo(() => typeof Audio !== 'undefined' ? new Audio('/sounds/completed.mp3') : null, []);

  useEffect(() => {
    if (!childUser) { router.push("/child-login"); return; }
    const fetchTask = async () => {
      setLoading(true);
      try {
        // Try Firestore first
        const docRef = doc(db, 'levels', `${childUser.gradeId}_${subjectId}_${levelId}`);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const levelData = snap.data();
          const found = levelData.tasks?.find(t => t.taskId === taskId);
          if (found) {
            setTaskData(found);
            if ((found.type === 'quiz' || found.type === 'exam') && found.timeLimit) {
              setTimeLeft(found.timeLimit);
              setTimerActive(true);
            }
            setLoading(false);
            return;
          }
        }
      } catch (e) { /* fall through to local */ }

      // Fallback: local db.json
      const dbData = (await import('../../../../../data/db.json')).default;
      const gradeData = dbData.grades.find(g => g.gradeId === childUser.gradeId);
      const subject = gradeData?.subjects?.find(s => s.subjectId === subjectId);
      const level = subject?.levels?.find(l => l.levelId === levelId);
      const task = level?.tasks?.find(t => t.taskId === taskId);
      setTaskData(task || null);
      if (task && (task.type === 'quiz' || task.type === 'exam') && task.timeLimit) {
        setTimeLeft(task.timeLimit);
        setTimerActive(true);
      }
      setLoading(false);
    };
    fetchTask();
  }, [childUser, subjectId, levelId, taskId, router]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(p => p - 1);
      setTimeTaken(p => p + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (timeLeft <= 0 && timerActive) {
      setTimerActive(false);
      setQuizCompleted(true);
      completionSound?.play();
      triggerConfetti(false);
    }
  }, [timeLeft, timerActive, completionSound]);

  const currentQuestion = taskData?.questions?.[currentQuestionIndex];

  const handleSubmitAnswer = () => {
    if (!currentQuestion) return;
    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    if (isCorrect) {
      setFeedbackMessage({ type: 'correct', message: 'Awesome! 🌟 +10 pts' });
      setScore(s => s + 10);
      setCorrectAnswersCount(c => c + 1);
      setShowReviewOption(false);
      correctSound?.play();
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    } else {
      setFeedbackMessage({ type: 'wrong', message: "Oops! Try again 💪" });
      setWrongAnswersCount(c => c + 1);
      if (taskData.type === 'quiz') setShowReviewOption(true);
      incorrectSound?.play();
    }
    const historyItem = {
      question: currentQuestion.questionText,
      userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      index: currentQuestionIndex + 1,
      type: currentQuestion.type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSessionHistory(prev => [historyItem, ...prev]);
    setTimerActive(false);
  };

  const triggerConfetti = (success) => {
    const end = Date.now() + 2000;
    const colors = success ? ['#FFD700', '#FFA500', '#00FF00'] : ['#a8a8a8', '#808080'];
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  };

  const handleNextQuestion = () => {
    setUserAnswer('');
    setFeedbackMessage(null);
    setShowReviewOption(false);
    if (currentQuestionIndex < taskData.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setTimerActive(true);
    } else {
      const finalCorrect = correctAnswersCount + (feedbackMessage?.type === 'correct' ? 1 : 0);
      const total = taskData.questions.length;
      setQuizCompleted(true);
      setTimerActive(false);
      const isSuccess = (finalCorrect / total) >= 0.5;
      if (isSuccess) completionSound?.play();
      triggerConfetti(isSuccess);
      if (childUser?.uid) {
        const updatedStats = recordTaskCompletion(childUser.uid, {
          type: taskData.type, score, totalQuestions: total,
          correct: finalCorrect, timeTaken, levelId, subjectId, retried: retriedThisTask,
          taskId: taskData.taskId
        });

        // Sync to Firestore
        saveChildStats(childUser.uid, updatedStats).catch(console.error);

        const unlocked = checkAchievements(childUser.uid, updatedStats);
        if (unlocked.length > 0) {
          setNewAchievements(unlocked);
          // Sync achievements to Firestore
          unlocked.forEach(ach => {
            recordAchievement(childUser.uid, ach).catch(console.error);
          });
        }
      }
    }
  };

  const handleSkip = () => { setWrongAnswersCount(c => c + 1); handleNextQuestion(); };
  const handleReview = () => { setFeedbackMessage(null); setShowReviewOption(false); setRetriedThisTask(true); setTimerActive(true); };
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const handleLessonComplete = async () => {
    completionSound?.play();
    triggerConfetti(true);
    if (!childUser?.uid) {
      router.back();
      return;
    }

    // 10 pts for completing a lesson
    const updatedStats = recordTaskCompletion(childUser.uid, {
      type: taskData.type, score: 10, totalQuestions: 1,
      correct: 1, timeTaken: 0, levelId, subjectId, retried: false,
      taskId: taskData.taskId
    });

    await saveChildStats(childUser.uid, updatedStats).catch(console.error);
    const unlocked = checkAchievements(childUser.uid, updatedStats);

    if (unlocked.length > 0) {
      unlocked.forEach(ach => recordAchievement(childUser.uid, ach).catch(console.error));
      setNewAchievements(unlocked);
      setScore(10);
      setQuizCompleted(true); // Re-use the summary screen
    } else {
      router.back();
    }
  };
  const handleKeyPress = (key) => {
    if (key === 'Backspace') setUserAnswer(a => a.slice(0, -1));
    else setUserAnswer(a => a + key);
  };

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <SkeletonLoader variant="page" message="Loading your adventure..." />
    </div>
  );
  if (!childUser) return null;
  if (!taskData) return <div className="text-center p-10">Task not found.</div>;

  if (!taskData.questions || taskData.questions.length === 0) {
    if (quizCompleted) {
      // Re-using the success screen for lesson completions with achievements
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-4 flex flex-col items-center justify-center gap-6">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}
            className="p-10 text-center bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl max-w-lg w-full border-4 border-white">
            <FaStar size={100} className="text-yellow-400 mb-6 mx-auto drop-shadow-md" />
            <h1 className="text-4xl font-extrabold mb-4 text-green-600">Lesson Complete!</h1>
            <p className="text-xl text-gray-600 mb-8">+10 Points Added</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => router.back()} className="flex-1 bg-blue-500 text-white font-bold px-6 py-4 rounded-full text-xl hover:bg-blue-600 hover:scale-105 transition-all shadow-lg">Back to Map 🗺️</button>
              <button onClick={() => router.push('/learning-zone/rewards')} className="flex-1 bg-cyan-500 text-white font-bold px-6 py-4 rounded-full text-xl hover:bg-cyan-600 hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"><FaGift /> My Rewards</button>
            </div>
          </motion.div>

          {newAchievements.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, type: "spring" }} className="w-full max-w-lg">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border-4 border-cyan-300">
                <h2 className="text-2xl font-extrabold text-cyan-700 mb-4">🎉 New Achievements!</h2>
                <div className="grid grid-cols-2 gap-3">
                  {newAchievements.map(ach => (
                    <motion.div key={ach.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }}
                      className={`bg-gradient-to-br ${ach.color} rounded-2xl p-4 text-center border-2 ${ach.border} shadow-md`}>
                      <div className="text-4xl mb-2">{ach.emoji}</div>
                      <p className="font-extrabold text-white text-sm leading-tight drop-shadow">{ach.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      );
    }

    return (
      <InteractiveLesson
        taskData={taskData}
        childUser={childUser}
        onComplete={handleLessonComplete}
      />
    );
  }

  const totalQuestions = taskData.questions.length;

  if (quizCompleted) {
    const pct = (correctAnswersCount / totalQuestions) * 100;
    let medal = 'Keep Practicing! 💪', medalColor = 'text-gray-500', bgGradient = 'from-red-50 to-teal-100';
    let icon = <FaStar size={80} className="text-gray-400 mb-4 mx-auto" />;
    if (pct === 100) { medal = 'Perfect! Gold Medal 🏆'; medalColor = 'text-yellow-600'; bgGradient = 'from-yellow-100 to-amber-200'; icon = <FaTrophy size={100} className="text-yellow-500 mb-6 mx-auto drop-shadow-md" />; }
    else if (pct >= 75) { medal = 'Great! Silver Medal 🥈'; medalColor = 'text-slate-600'; bgGradient = 'from-gray-100 to-slate-200'; icon = <FaMedal size={90} className="text-gray-400 mb-4 mx-auto drop-shadow-md" />; }
    else if (pct >= 50) { medal = 'Good Effort! Bronze 🥉'; medalColor = 'text-orange-700'; bgGradient = 'from-orange-50 to-orange-100'; icon = <FaMedal size={90} className="text-orange-500 mb-4 mx-auto drop-shadow-md" />; }

    return (
      <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-4 flex flex-col items-center justify-center gap-6`}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}
          className="p-10 text-center bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl max-w-lg w-full border-4 border-white">
          {icon}
          <h1 className={`text-4xl font-extrabold mb-4 ${medalColor}`}>{medal}</h1>
          <div className="bg-white rounded-3xl p-6 shadow-inner mb-8">
            <p className="text-3xl font-black text-gray-800 mb-1">Score: <span className="text-green-500">{score}</span></p>
            <p className="text-xl text-gray-600 mb-1">✅ <span className="font-bold text-green-500">{correctAnswersCount}</span> / {totalQuestions}</p>
            <p className="text-xl text-gray-600 mb-3">❌ <span className="font-bold text-red-500">{wrongAnswersCount}</span></p>
            {taskData.type !== 'lesson' && <p className="text-lg text-gray-400 bg-gray-100 rounded-full py-1 px-4 inline-block">⏳ {formatTime(timeTaken)}</p>}
          </div>

          <div className="mt-8 text-left">
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> Full Detailed Recap
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {sessionHistory.slice().reverse().map((item, i) => (
                <div key={i} className={`p-4 rounded-2xl border-2 ${item.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {item.index}</span>
                    <span className={item.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {item.isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-2">{item.question}</p>
                  <div className="flex gap-4 text-xs">
                    <div>
                      <p className="text-slate-400 font-bold uppercase text-[9px]">Your Answer</p>
                      <p className={`font-bold ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{item.userAnswer || 'Skipped'}</p>
                    </div>
                    {!item.isCorrect && (
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[9px]">Correct Answer</p>
                        <p className="font-bold text-green-600">{item.correctAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button onClick={() => router.back()} className="flex-1 bg-blue-500 text-white font-bold px-6 py-4 rounded-full text-xl hover:bg-blue-600 hover:scale-105 transition-all shadow-lg">Back to Map 🗺️</button>
            <button onClick={() => router.push('/learning-zone/rewards')} className="flex-1 bg-cyan-500 text-white font-bold px-6 py-4 rounded-full text-xl hover:bg-cyan-600 hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2"><FaGift /> My Rewards</button>
          </div>
        </motion.div>

        {newAchievements.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, type: "spring" }} className="w-full max-w-lg">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border-4 border-cyan-300">
              <h2 className="text-2xl font-extrabold text-cyan-700 mb-4">🎉 New Achievements!</h2>
              <div className="grid grid-cols-2 gap-3">
                {newAchievements.map(ach => (
                  <motion.div key={ach.id} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }}
                    className={`bg-gradient-to-br ${ach.color} rounded-2xl p-4 text-center border-2 ${ach.border} shadow-md`}>
                    <div className="text-4xl mb-2">{ach.emoji}</div>
                    <p className="font-extrabold text-white text-sm leading-tight drop-shadow">{ach.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center">
      <AnimatePresence>
        {feedbackMessage?.type === 'correct' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-green-100 -z-10" />}
        {feedbackMessage?.type === 'wrong' && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-50 -z-10" />}
      </AnimatePresence>

      <div className="w-full max-w-4xl p-4 sm:p-6 md:p-8 flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-4 w-full max-w-4xl">
          <button onClick={() => router.back()} className="p-4 rounded-3xl bg-white shadow-md hover:bg-slate-50 text-slate-600 transition-all hover:scale-105 active:scale-95 border-b-4 border-slate-200">
            <FaArrowLeft className="text-xl" />
          </button>

          <div className="flex gap-3 h-14">
            <div className="bg-white shadow-md rounded-2xl px-6 py-2 flex items-center gap-3 border-b-4 border-yellow-200">
              <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
                <FaStar className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Score</p>
                <p className="font-black text-slate-800 text-xl leading-none">{score}</p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-2xl px-6 py-2 flex items-center gap-3 border-b-4 border-green-200">
              <div className="bg-green-100 p-2 rounded-xl text-green-600">
                <FaCheckCircle className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Correct</p>
                <p className="font-black text-slate-800 text-xl leading-none">{correctAnswersCount}</p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-2xl px-6 py-2 flex items-center gap-3 border-b-4 border-red-200">
              <div className="bg-red-100 p-2 rounded-xl text-red-600">
                <FaTimesCircle className="text-xl" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Wrong</p>
                <p className="font-black text-slate-800 text-xl leading-none">{wrongAnswersCount}</p>
              </div>
            </div>
          </div>

          <button onClick={() => router.push('/learning-zone')} className="p-4 rounded-3xl bg-white shadow-md hover:bg-slate-50 text-cyan-600 transition-all hover:scale-105 active:scale-95 border-b-4 border-cyan-200">
            <FaHome className="text-xl" />
          </button>
        </div>

        <div className="w-full max-w-4xl flex items-center gap-6 mb-8">
          <div className="flex-grow flex flex-col gap-2">
            <div className="flex justify-between items-end px-1">
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                {taskData.type} Progress
              </p>
              <p className="text-sm font-black text-slate-600">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </p>
            </div>
            <div className="h-4 w-full bg-slate-200/50 rounded-full p-1 overflow-hidden backdrop-blur-sm border border-white/50 shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex) / totalQuestions) * 100}%` }}
                transition={{ type: "spring", stiffness: 50 }}
              />
            </div>
          </div>

          {(taskData.type === 'quiz' || taskData.type === 'exam') && taskData.timeLimit && (
            <div className="flex-shrink-0">
              <div className={`px-6 py-3 rounded-2xl flex flex-col items-center justify-center border-b-4 transition-colors ${timeLeft <= 10 ? 'bg-red-500 text-white border-red-700 animate-pulse' : 'bg-white text-slate-600 border-slate-200 shadow-md'}`}>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 leading-none mb-1">Time Left</p>
                <p className="text-2xl font-black font-mono leading-none tracking-tighter">{formatTime(timeLeft)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl p-8 mb-6 border border-slate-100 relative max-w-3xl w-full mx-auto">
          {feedbackMessage && (
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className={`absolute -top-6 left-1/2 -translate-x-1/2 px-8 py-2 rounded-full font-bold shadow-lg text-lg flex items-center gap-2 z-20 ${feedbackMessage.type === 'correct' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
              {feedbackMessage.type === 'correct' ? <FaCheckCircle /> : <FaTimesCircle />}
              {feedbackMessage.message}
            </motion.div>
          )}

          <div className="text-2xl font-bold mb-8 flex flex-col items-center text-center text-gray-800 mt-4">
            {/* Question Image */}
            {currentQuestion.imageUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 w-full flex justify-center"
              >
                <img
                  src={currentQuestion.imageUrl}
                  alt="Question visual"
                  className="max-h-64 max-w-full rounded-3xl border-4 border-white shadow-xl object-contain bg-slate-50"
                />
              </motion.div>
            )}
            {currentQuestion.questionText}
            <div className="mt-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-colors">
              <AudioPlayer text={currentQuestion.questionText} />
            </div>
          </div>

          {currentQuestion.options && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => {
                const isSelected = userAnswer === option;
                let style = "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50";
                if (feedbackMessage) {
                  if (option === currentQuestion.correctAnswer) style = "bg-green-100 border-2 border-green-500 text-green-800 scale-105 shadow-md";
                  else if (isSelected && feedbackMessage.type === 'wrong') style = "bg-red-100 border-2 border-red-500 text-red-800 line-through opacity-80";
                  else style = "bg-gray-100 border-2 border-gray-200 text-gray-400 opacity-40";
                } else if (isSelected) style = "bg-blue-100 border-2 border-blue-500 text-blue-800 scale-[1.02] shadow-sm";
                return (
                  <button key={index} onClick={() => !feedbackMessage && setUserAnswer(option)} disabled={!!feedbackMessage}
                    className={`p-6 rounded-2xl transition-all duration-300 font-bold text-xl ${style}`}>{option}</button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === 'identification' && (
            <div className="max-w-md mx-auto">
              <input type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} disabled={!!feedbackMessage}
                className={`w-full p-4 text-center text-2xl font-bold border-4 rounded-full focus:outline-none transition-colors ${feedbackMessage?.type === 'correct' ? 'border-green-400 bg-green-50' : feedbackMessage?.type === 'wrong' ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`}
                placeholder="Type your answer..." />
              <div className="mt-5 flex justify-center gap-3">
                <button onClick={() => setShowKeyboard(!showKeyboard)} className="bg-slate-100 text-slate-600 p-4 rounded-xl text-xl hover:bg-slate-200 transition-colors"><FaKeyboard /></button>
                <button onClick={() => setShowDrawingTool(!showDrawingTool)} className="bg-cyan-100 text-cyan-600 p-4 rounded-xl text-xl hover:bg-cyan-200 transition-colors"><FaPaintBrush /></button>
              </div>
              {showKeyboard && <div className="mt-4"><VirtualKeyboard onKeyPress={handleKeyPress} /></div>}
            </div>
          )}

          {showDrawingTool && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-2xl p-6 relative w-full max-w-3xl flex flex-col items-center border-4 border-cyan-200">
                <button onClick={() => setShowDrawingTool(false)} className="absolute -top-4 -right-4 p-3 rounded-full bg-red-500 text-white hover:bg-red-600 z-10 shadow-lg"><FaTimesCircle size={22} /></button>
                <h3 className="font-bold text-xl mb-4 text-cyan-600 flex items-center gap-2"><FaPaintBrush /> Scratchpad</h3>
                <div className="border-4 border-dashed border-gray-200 rounded-2xl overflow-hidden w-full bg-gray-50">
                  <DrawingCanvas width={window.innerWidth > 800 ? 700 : window.innerWidth * 0.8} height={400} />
                </div>
                <p className="text-sm font-semibold text-gray-400 mt-3 bg-gray-100 px-4 py-1 rounded-full">Drawing won&apos;t be submitted.</p>
              </motion.div>
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {!feedbackMessage ? (
              <button onClick={handleSubmitAnswer} disabled={!userAnswer}
                className={`px-10 py-4 text-xl font-bold rounded-full transition-all flex items-center justify-center shadow-lg ${userAnswer ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                Check Answer <FaCheckCircle className="ml-2" />
              </button>
            ) : (
              <button onClick={handleNextQuestion} className="bg-blue-500 text-white px-10 py-4 font-bold rounded-full text-xl hover:bg-blue-600 hover:scale-105 transition-all flex items-center justify-center shadow-lg">
                {currentQuestionIndex < totalQuestions - 1 ? 'Next ➡️' : 'Finish! 🎉'}
              </button>
            )}
            {!feedbackMessage && taskData.type === 'quiz' && (
              <button onClick={handleSkip} className="bg-white border-2 border-gray-300 text-gray-500 font-bold px-8 py-4 rounded-full text-lg hover:bg-gray-50 transition-colors">Skip ⏭️</button>
            )}
            {showReviewOption && taskData.type === 'quiz' && (
              <button onClick={handleReview} className="bg-yellow-400 text-yellow-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-md">
                Try Again <FaRedo />
              </button>
            )}
          </div>
        </div>

        {/* Live Session Recap for Gameplay */}
        {sessionHistory.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl mx-auto mt-8">
            <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/50 shadow-xl">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" /> Recent Activity
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessionHistory.slice(0, 4).map((item, i) => (
                  <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 ${item.isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {item.isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Q{item.index}</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{item.question}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}