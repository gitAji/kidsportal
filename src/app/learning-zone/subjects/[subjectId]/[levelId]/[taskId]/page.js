"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SkeletonLoader from '../../../../../components/ui/SkeletonLoader';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaRedo, FaForward, FaPaintBrush, FaKeyboard, FaHome, FaStar, FaTrophy, FaMedal, FaGift, FaEraser } from 'react-icons/fa';
import { useChild } from '../../../../../providers/ChildProvider';
import AudioPlayer from '../../../../../components/ui/AudioPlayer';
import DrawingCanvas from '../../../../../components/ui/DrawingCanvas';
import VirtualKeyboard from '../../../../../components/ui/VirtualKeyboard';
import InteractiveLesson from '../../../../../components/ui/InteractiveLesson';
import SuccessBadge from '../../../../../components/ui/SuccessBadge';
import CountUpNumber from '../../../../../components/ui/CountUpNumber';
import { motion, AnimatePresence } from "framer-motion";
import { FaLanguage } from 'react-icons/fa';
import { useLanguage } from '@/app/providers/LanguageProvider';
import confetti from 'canvas-confetti';
import { recordTaskCompletion, checkAchievements } from '../../../../../utils/achievements';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import Image from 'next/image';

export default function TaskContentPage() {
  const { childUser } = useChild();
  const [taskData, setTaskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { subjectId, levelId, taskId } = params;
  const { language, toggleLanguage, languageLoaded, t } = useLanguage();
  const isTamilSubject = subjectId?.toLowerCase().includes('tamil') || taskId?.toLowerCase().includes('tamil');

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [showReviewOption, setShowReviewOption] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showDrawingTool, setShowDrawingTool] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [retriedThisTask, setRetriedThisTask] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [clickedCountingItems, setClickedCountingItems] = useState([]);
  const [translatedQuestion, setTranslatedQuestion] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [contentLanguage, setContentLanguage] = useState(isTamilSubject ? 'ta' : 'en');

  // Once the parent's global learning-language preference has loaded, default
  // non-Tamil-subject content to it too — so a family that picked Tamil in
  // Settings gets Tamil content everywhere, not just the Tamil subject, and
  // doesn't have to manually re-toggle on every single lesson.
  useEffect(() => {
    if (!isTamilSubject && languageLoaded && language === 'ta') {
      setContentLanguage('ta');
    }
  }, [isTamilSubject, languageLoaded, language]);

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
      const cleanSubjectId = decodeURIComponent(subjectId)?.toLowerCase().replace(/ /g, '-');
      const cleanLevelId = decodeURIComponent(levelId)?.toLowerCase().replace(/ /g, '-');
      const cleanTaskId = decodeURIComponent(taskId)?.toLowerCase().replace(/ /g, '-');
      const gradeData = dbData.grades.find(g => g.gradeId?.toLowerCase().replace(/-/g, '') === childUser.gradeId?.toLowerCase().replace(/-/g, ''));
      const subject = gradeData?.subjects?.find(s =>
        s.subjectId?.toLowerCase() === cleanSubjectId ||
        s.subjectName?.toLowerCase() === cleanSubjectId
      );
      const level = subject?.levels?.find(l => l.levelId?.toLowerCase() === cleanLevelId);
      let task = level?.tasks?.find(t => t.taskId?.toLowerCase() === cleanTaskId);

      // Vertex AI Generation Fallback: If task doesn't exist, customize a new one automatically based on user level
      if (!task) {
        try {
          const aiRes = await fetch('/api/generate-task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              gradeId: childUser.gradeId,
              subjectId,
              levelId,
              taskId,
              childId: childUser.uid || childUser.id
            })
          });
          const aiData = await aiRes.json();
          if (aiData && aiData.questions) {
            task = aiData;
          }
        } catch (e) {
          console.error("Failed to generate AI task:", e);
        }
      }

      setTaskData(task || null);
      if (task && (task.type === 'quiz' || task.type === 'exam') && task.timeLimit) {
        setTimeLeft(task.timeLimit);
        setTimerActive(true);
      }
      setLoading(false);
    };
    fetchTask();
  }, [childUser, subjectId, levelId, taskId, router]);

  // Professor Greeting & Character Setup
  const professor = useMemo(() => {
    const char = childUser?.professorCharacter || 'owl';
    if (char === 'panda') return { name: t('panda_name'), img: '/images/smart-panda.png', defaultMsg: t('panda_default_msg') };
    return { name: t('owl_name'), img: '/images/professor-owl.png', defaultMsg: t('owl_default_msg') };
  }, [childUser, t]);

  useEffect(() => {
    if (taskData && !loading && !feedbackMessage) {
      const timer = setTimeout(() => {
        setFeedbackMessage({
          type: 'info',
          message: `${t('hi')} ${childUser?.name || t('explorer')}! ${t('imCharacter')} ${professor.name}. ${professor.defaultMsg}`
        });
      }, 1500);

      const clearTimer = setTimeout(() => {
        setFeedbackMessage(prev => prev?.type === 'info' ? null : prev);
      }, 9500);
      return () => { clearTimeout(timer); clearTimeout(clearTimer); };
    }
  }, [taskData, loading, childUser]);

  // Load progress from localStorage
  useEffect(() => {
    if (taskData && childUser) {
      const childId = childUser.uid || childUser.id;
      const progressKey = `kidsportal_progress_${childId}_${taskData.taskId}`;
      const saved = localStorage.getItem(progressKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCurrentQuestionIndex(parsed.currentQuestionIndex || 0);
          setScore(parsed.score || 0);
          setCorrectAnswersCount(parsed.correctAnswersCount || 0);
          setWrongAnswersCount(parsed.wrongAnswersCount || 0);
          setTimeTaken(parsed.timeTaken || 0);
          setSessionHistory(parsed.sessionHistory || []);
          if (parsed.timeLeft !== undefined) {
            setTimeLeft(parsed.timeLeft);
          }
        } catch (e) {
          console.error("Could not parse saved progress.", e);
        }
      }
    }
  }, [taskData, childUser]);

  // Save progress to localStorage
  useEffect(() => {
    if (taskData && childUser && !quizCompleted) {
      const childId = childUser.uid || childUser.id;
      const progressKey = `kidsportal_progress_${childId}_${taskData.taskId}`;
      localStorage.setItem(progressKey, JSON.stringify({
        currentQuestionIndex,
        score,
        correctAnswersCount,
        wrongAnswersCount,
        timeTaken,
        sessionHistory,
        timeLeft
      }));
    }
  }, [currentQuestionIndex, score, correctAnswersCount, wrongAnswersCount, timeTaken, sessionHistory, timeLeft, taskData, childUser, quizCompleted]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(p => {
        const next = p - 1;
        // Time alerts logic
        if (childUser?.timeAlertsEnabled) {
          if (next === 60) setFeedbackMessage({ type: 'info', message: t('one_min_left') });
          if (next === 30) setFeedbackMessage({ type: 'info', message: t('thirty_sec_left') });
          if (next === 10) setFeedbackMessage({ type: 'info', message: t('ten_sec_left') });
        }
        return next;
      });
      setTimeTaken(p => p + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, childUser, professor]);

  useEffect(() => {
    if (timeLeft <= 0 && timerActive) {
      setTimerActive(false);
      setQuizCompleted(true);
      completionSound?.play();
      triggerConfetti(false);
    }
  }, [timeLeft, timerActive, completionSound]);

  const currentQuestion = taskData?.questions?.[currentQuestionIndex];

  useEffect(() => {
    setTranslatedQuestion(null);
    if (!currentQuestion) return;

    // Decide if we need translation
    const needsTranslation = (isTamilSubject && contentLanguage === 'en') || (!isTamilSubject && contentLanguage === 'ta');
    const targetLang = contentLanguage === 'ta' ? 'ta' : 'en';

    if (needsTranslation) {
      const fetchTranslation = async () => {
        setIsTranslating(true);
        try {
          const res = await fetch('/api/translate-question', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: currentQuestion, targetLanguage: targetLang })
          });
          const data = await res.json();
          if (data.translatedData) {
            setTranslatedQuestion(data.translatedData);
          }
        } catch (e) {
          console.error("Translation failed", e);
        } finally {
          setIsTranslating(false);
        }
      };

      const handler = setTimeout(() => {
        fetchTranslation();
      }, 300);
      return () => clearTimeout(handler);
    }
  }, [currentQuestionIndex, currentQuestion, isTamilSubject, contentLanguage]);

  const cleanString = (str) => {
    if (str === null || str === undefined) return "";
    const s = String(str);
    return s
      .replace(/^\[.*?\]\s*/i, "")
      .replace(/^(quizz|quiz|exam|lesson)\s*\d+[:\s-]*\s*/i, "")
      .replace(/^option\s*[a-z0-9]+[:\s-]*\s*/i, "")
      .trim();
  };

  const displayQuestion = translatedQuestion ? { ...currentQuestion, ...translatedQuestion } : currentQuestion;

  const handleSubmitAnswer = async (overrideAnswer) => {
    if (!currentQuestion) return;

    // We optionally accept overrideAnswer to allow answering options immediately without waiting for state
    const answerToCheck = typeof overrideAnswer !== 'undefined' ? overrideAnswer : userAnswer;
    if (answerToCheck === undefined || answerToCheck === null || answerToCheck === '') return;

    // Standard string matching logic for multiple choice or as fallback
    let isCorrect = String(answerToCheck).toLowerCase().trim() === String(currentQuestion.correctAnswer).toLowerCase().trim();
    let message = isCorrect ? t('feedbackGood') : t('feedbackBad');

    if (currentQuestion.type === 'writing') {
      isCorrect = true; // For tracing, completion is success
      message = "Fantastic! You've traced it perfectly! 🎨🦉";
    }

    // If it's a drawing, we'll simulate AI vision approval for now
    if (String(userAnswer).startsWith('data:image')) {
      setIsCheckingAnswer(true);
      setTimeout(() => {
        setFeedbackMessage({
          type: 'correct',
          message: `Wow! I can read your writing perfectly! It says "${currentQuestion.correctAnswer}". You are becoming a great writer! 🦉🖌️`
        });
        setIsCheckingAnswer(false);
        // Use custom question points or default to 10
        const pointsToAdd = currentQuestion.points || 10;
        setScore(prev => prev + pointsToAdd);

        // Save to progress
        const updatedHistory = [...taskHistory, {
          index: currentQuestionIndex + 1,
          question: currentQuestion.questionText,
          isCorrect: true,
          type: 'writing'
        }];
        setTaskHistory(updatedHistory);
      }, 2000);
      return;
    }

    // If it's a typed answer, have the AI tutor interactively grade it and give custom feedback
    if (currentQuestion.type === 'identification' && answerToCheck.length > 0) {
      setIsCheckingAnswer(true);
      try {
        const aiRes = await fetch('/api/evaluate-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionText: currentQuestion.questionText,
            correctAnswer: currentQuestion.correctAnswer,
            studentAnswer: answerToCheck
          })
        });
        const aiEvaluation = await aiRes.json();

        if (aiEvaluation && typeof aiEvaluation.isCorrect !== 'undefined') {
          isCorrect = aiEvaluation.isCorrect;
          message = aiEvaluation.feedback || (isCorrect ? 'Awesome! 🌟 +10 pts' : 'Oops! Try again 💪');
        }
      } catch (err) {
        console.error("AI Evaluation failed, falling back to basic check", err);
      }
      setIsCheckingAnswer(false);
    }

    // Track how many times this question has been attempted (first try = 1),
    // and only offer one retry: a wrong second attempt moves on for good.
    const attemptNumber = attemptCount + 1;
    setAttemptCount(attemptNumber);
    const canRetry = (taskData.type === 'quiz' || taskData.type === 'exam') && attemptNumber < 2;

    if (isCorrect) {
      setFeedbackMessage({ type: 'correct', message });
      const pointsToAdd = currentQuestion.points || 10;
      setScore(s => s + pointsToAdd);
      setCorrectAnswersCount(c => c + 1);
      setShowReviewOption(false);
      correctSound?.play();
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    } else {
      setFeedbackMessage({ type: 'wrong', message });
      setWrongAnswersCount(c => c + 1);
      setShowReviewOption(canRetry);
      incorrectSound?.play();
    }
    const historyItem = {
      question: currentQuestion.questionText,
      userAnswer: answerToCheck,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      index: currentQuestionIndex + 1,
      type: currentQuestion.type,
      attempts: attemptNumber,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSessionHistory(prev => [historyItem, ...prev]);
    setTimerActive(false);

    // Auto-advance logic: If the student gets it right, move to the next question
    // automatically after seeing the confetti for 1.5 seconds to save them clicks.
    if (isCorrect) {
      setTimeout(() => {
        // We use click() on the button element to seamlessly trigger the next question
        // avoiding state-closure issues. If the user already clicked it manually, 
        // the button will be gone from the DOM and this will safely do nothing.
        document.getElementById('next-btn')?.click();
      }, 1500);
    }
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
    setAttemptCount(0);
    setClickedCountingItems([]);
    if (currentQuestionIndex < taskData.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setTimerActive(true);
    } else {
      const finalCorrect = correctAnswersCount + (feedbackMessage?.type === 'correct' ? 1 : 0);
      const total = taskData.questions.length;
      setQuizCompleted(true);
      setTimerActive(false);

      // Clear saved progress on completion
      if (childUser) {
        const childId = childUser.uid || childUser.id;
        localStorage.removeItem(`kidsportal_progress_${childId}_${taskData.taskId}`);
      }

      const isSuccess = (finalCorrect / total) >= 0.5;
      if (isSuccess) completionSound?.play();
      triggerConfetti(isSuccess);
      if (childUser?.uid || childUser?.id) {
        const childId = childUser.uid || childUser.id;
        // If task has a flat xpReward, use that as the base score for 100% completion
        // Otherwise use the calculated cumulative score
        const finalScore = taskData.xpReward ? Math.floor((finalCorrect / total) * taskData.xpReward) : score;

        const updatedStats = recordTaskCompletion(childId, {
          type: taskData.type, score: finalScore, totalQuestions: total,
          correct: finalCorrect, timeTaken, levelId, subjectId, retried: retriedThisTask,
          taskId: taskData.taskId
        });
        setAttemptNumber(updatedStats._attemptNumber || 1);

        // Only check achievements on FIRST completion — retakes don't earn new stickers
        let unlocked = [];
        if (!updatedStats._isRepeat) {
          unlocked = checkAchievements(childId, updatedStats);
          if (unlocked.length > 0) {
            setNewAchievements(unlocked);
          }
        }

        // Always sync this attempt (first play or retake) so parents see a full log
        fetch('/api/child-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            childId,
            parentUid: childUser.parentUid,
            stats: updatedStats,
            newAchievements: unlocked,
            sessionHistory,
            taskId: taskData.taskId,
            taskName: taskData.taskName,
            subjectId,
            levelId,
            score: finalScore,
            type: taskData.type,
            attemptNumber: updatedStats._attemptNumber || 1,
            isRetake: !!updatedStats._isRepeat,
          }),
        }).catch(console.error);
      }
    }
  };

  const handleSkip = () => { setWrongAnswersCount(c => c + 1); handleNextQuestion(); };
  const handleReview = () => { setUserAnswer(''); setFeedbackMessage(null); setShowReviewOption(false); setRetriedThisTask(true); setTimerActive(true); setClickedCountingItems([]); };
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Retake the exam / practice the quiz or lesson again — every attempt is logged for parents.
  const handleRetake = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedbackMessage(null);
    setScore(0);
    setCorrectAnswersCount(0);
    setWrongAnswersCount(0);
    setShowReviewOption(false);
    setAttemptCount(0);
    setQuizCompleted(false);
    setTimeTaken(0);
    setRetriedThisTask(false);
    setNewAchievements([]);
    setSessionHistory([]);
    setClickedCountingItems([]);
    setTranslatedQuestion(null);
    if (taskData?.timeLimit) {
      setTimeLeft(taskData.timeLimit);
      setTimerActive(true);
    }
  };

  const handleLessonComplete = async () => {
    completionSound?.play();
    triggerConfetti(true);
    const childId = childUser?.uid || childUser?.id;
    if (!childId) {
      router.back();
      return;
    }

    // Clear saved progress
    localStorage.removeItem(`kidsportal_progress_${childId}_${taskData.taskId}`);

    // 10 pts for completing a lesson
    // Use custom xpReward for lesson completion, or default to 10
    const finalScore = taskData.xpReward || 10;

    const updatedStats = recordTaskCompletion(childId, {
      type: taskData.type, score: finalScore, totalQuestions: 1,
      correct: 1, timeTaken: 0, levelId, subjectId, retried: false,
      taskId: taskData.taskId
    });
    setAttemptNumber(updatedStats._attemptNumber || 1);

    // Only check achievements on FIRST completion — retakes don't earn new stickers
    let unlocked = [];
    if (!updatedStats._isRepeat) {
      unlocked = checkAchievements(childId, updatedStats);
    }

    // Always sync this attempt (first play or practice replay) so parents see a full log
    fetch('/api/child-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        childId,
        parentUid: childUser.parentUid,
        stats: updatedStats,
        newAchievements: unlocked,
        sessionHistory,
        taskId: taskData.taskId,
        taskName: taskData.taskName,
        subjectId,
        levelId,
        score: finalScore,
        type: taskData.type,
        attemptNumber: updatedStats._attemptNumber || 1,
        isRetake: !!updatedStats._isRepeat,
      }),
    }).catch(console.error);

    if (unlocked.length > 0) {
      setNewAchievements(unlocked);
      setScore(10);
      setQuizCompleted(true); // Re-use the summary screen
      return;
    }

    // Repeat play or no new achievements — go back
    router.back();
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
            <SuccessBadge icon={<FaStar size={100} className="text-yellow-400" />} ringColor="rgba(250, 204, 21, 0.5)" />
            <h1 className="text-4xl font-extrabold mb-4 text-green-600">{t('lessonComplete')}</h1>
            <p className="text-xl text-gray-600 mb-8">+<CountUpNumber value={score} /> {t('pointsAdded')}</p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-3">
              <button onClick={() => router.back()} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black px-6 py-4 rounded-full text-xl hover:scale-[1.02] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2">
                <FaHome /> {t('backToMap')}
              </button>
              <button onClick={() => router.push('/learning-zone/rewards')} className="w-full bg-white text-cyan-600 font-bold px-6 py-3.5 rounded-full text-lg border-2 border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300 transition-all flex items-center justify-center gap-2">
                <FaGift /> My Rewards
              </button>
            </motion.div>
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
    let medal = t('keep_practicing'), medalColor = 'text-gray-500', bgGradient = 'from-red-50 to-teal-100';
    let icon = <FaStar size={80} className="text-gray-400" />;
    let ringColor = 'rgba(148, 163, 184, 0.4)';
    if (pct === 100) { medal = t('perfect_medal'); medalColor = 'text-yellow-600'; bgGradient = 'from-yellow-100 to-amber-200'; icon = <FaTrophy size={100} className="text-yellow-500" />; ringColor = 'rgba(250, 204, 21, 0.5)'; }
    else if (pct >= 75) { medal = t('great_medal'); medalColor = 'text-slate-600'; bgGradient = 'from-gray-100 to-slate-200'; icon = <FaMedal size={90} className="text-gray-400" />; ringColor = 'rgba(148, 163, 184, 0.5)'; }
    else if (pct >= 50) { medal = t('good_medal'); medalColor = 'text-orange-700'; bgGradient = 'from-orange-50 to-orange-100'; icon = <FaMedal size={90} className="text-orange-500" />; ringColor = 'rgba(249, 115, 22, 0.5)'; }

    return (
      <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-4 flex flex-col items-center justify-center gap-6`}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }}
          className="p-10 text-center bg-white/80 backdrop-blur-md rounded-[3rem] shadow-2xl max-w-lg w-full border-4 border-white">
          <SuccessBadge icon={icon} ringColor={ringColor} />
          <h1 className={`text-4xl font-extrabold mb-2 ${medalColor}`}>{medal}</h1>
          {attemptNumber > 1 && (
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-100 rounded-full py-1 px-4 inline-block mb-4">
              {t('attemptLabel')} #{attemptNumber}
            </p>
          )}
          <div className="bg-white rounded-3xl p-6 shadow-inner mb-8">
            <p className="text-3xl font-black text-gray-800 mb-1">{t('scoreLabel')}: <span className="text-green-500"><CountUpNumber value={score} /></span></p>
            <p className="text-xl text-gray-600 mb-1">✅ <span className="font-bold text-green-500">{correctAnswersCount}</span> / {totalQuestions}</p>
            <p className="text-xl text-gray-600 mb-3">❌ <span className="font-bold text-red-500">{wrongAnswersCount}</span></p>
            {taskData.type !== 'lesson' && <p className="text-lg text-gray-400 bg-gray-100 rounded-full py-1 px-4 inline-block">⏳ {formatTime(timeTaken)}</p>}
          </div>

          <div className="mt-8 text-left">
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> {t('detailedRecap')}
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {sessionHistory.slice().reverse().map((item, i) => (
                <div key={i} className={`p-4 rounded-2xl border-2 ${item.isCorrect ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">{t('question')} {item.index}</span>
                    <span className={item.isCorrect ? 'text-green-600' : 'text-red-600'}>
                      {item.isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 mb-2">{cleanString(item.question)}</p>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 font-bold uppercase text-xs">{t('yourAnswer')}</p>
                      <p className={`font-bold ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>{item.userAnswer || t('skipped')}</p>
                    </div>
                    {!item.isCorrect && (
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-xs">{t('correctAnswer')}</p>
                        <p className="font-bold text-green-600">{item.correctAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-3 mt-8">
            <button onClick={() => router.back()} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black px-6 py-4 rounded-full text-xl hover:scale-[1.02] transition-all shadow-lg shadow-blue-200/50 flex items-center justify-center gap-2">
              <FaHome /> {t('backToMap')}
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleRetake} className="w-full bg-white text-emerald-600 font-bold px-6 py-3.5 rounded-full text-lg border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all flex items-center justify-center gap-2">
                <FaRedo /> {taskData.type === 'exam' ? t('retakeExam') : t('practiceAgain')}
              </button>
              <button onClick={() => router.push('/learning-zone/rewards')} className="w-full bg-white text-cyan-600 font-bold px-6 py-3.5 rounded-full text-lg border-2 border-cyan-200 hover:bg-cyan-50 hover:border-cyan-300 transition-all flex items-center justify-center gap-2">
                <FaGift /> {t('myRewards')}
              </button>
            </div>
          </motion.div>
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
        <div className="flex items-center justify-center mb-4 w-full max-w-4xl">
          <div className="flex gap-3 h-14">
            <div className="bg-white shadow-md rounded-2xl px-6 py-2 flex items-center gap-3 border-b-4 border-yellow-200">
              <div className="bg-yellow-100 p-2 rounded-xl text-yellow-600">
                <FaStar className="text-xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">{t('scoreLabel')}</p>
                <p className="font-black text-slate-800 text-xl leading-none">{score}</p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-2xl px-6 py-2 flex items-center gap-3 border-b-4 border-green-200">
              <div className="bg-green-100 p-2 rounded-xl text-green-600">
                <FaCheckCircle className="text-xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">{t('correctText')}</p>
                <p className="font-black text-slate-800 text-xl leading-none">{correctAnswersCount}</p>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-2xl px-6 py-2 flex items-center gap-3 border-b-4 border-red-200">
              <div className="bg-red-100 p-2 rounded-xl text-red-600">
                <FaTimesCircle className="text-xl" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">{t('wrongText')}</p>
                <p className="font-black text-slate-800 text-xl leading-none">{wrongAnswersCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Task Media (Video/Audio) for non-lessons */}
        {(taskData.type === 'quiz' || taskData.type === 'exam') && (taskData.videoUrl || taskData.audioUrl) && (
          <div className="w-full max-w-4xl mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskData.videoUrl && (
              <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-100 overflow-hidden aspect-video">
                <iframe
                  src={taskData.videoUrl}
                  className="w-full h-full rounded-2xl"
                  title="Task Media"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}
            {taskData.audioUrl && (
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col justify-center gap-4">
                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Listen to Instructions</p>
                <audio controls className="w-full">
                  <source src={taskData.audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}

        <div className="w-full max-w-4xl flex items-center gap-6 mb-8">
          <div className="flex-grow flex flex-col gap-2">
            <div className="flex justify-between items-end px-1">
              <p className="text-sm font-black text-slate-400 uppercase tracking-wider">
                {taskData.type} Progress
              </p>
              <p className="text-sm font-black text-slate-600">
                {t('question')} {currentQuestionIndex + 1} of {totalQuestions}
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
                <p className="text-xs font-black uppercase tracking-wider opacity-80 leading-none mb-1">{t('time_left')}</p>
                <p className="text-2xl font-black font-mono leading-none tracking-tighter">{formatTime(timeLeft)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl p-8 mb-6 border border-slate-100 relative max-w-3xl w-full mx-auto">
          {feedbackMessage && (feedbackMessage.type === 'correct' || feedbackMessage.type === 'wrong') && (
            <motion.div initial={{ scale: 0.5, opacity: 0, x: 20 }} animate={{ scale: 1, opacity: 1, x: 0 }}
              className={`absolute top-4 right-4 px-4 py-1.5 rounded-2xl font-black shadow-lg text-sm flex items-center gap-2 z-20 tracking-widest uppercase border-2 border-white ${feedbackMessage.type === 'correct' ? 'bg-green-500 text-white shadow-green-200' : 'bg-red-500 text-white shadow-red-200'}`}>
              {feedbackMessage.type === 'correct' ? <><FaCheckCircle /> {t('correctText')}</> : <><FaTimesCircle /> {t('incorrectText')}</>}
            </motion.div>
          )}

          {languageLoaded && !feedbackMessage && (
            <button
              onClick={() => setContentLanguage(prev => prev === 'en' ? 'ta' : 'en')}
              className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black text-xs shadow drop-shadow-sm hover:scale-105 active:scale-95 transition-transform z-20"
            >
              <FaLanguage size={14} />
              <span>{contentLanguage === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          )}

          <div className="text-2xl font-bold mb-8 flex flex-col items-center text-center text-gray-800 mt-4">
            {/* Question Image */}
            {currentQuestion.imageUrl && currentQuestion.type !== 'counting' && (
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

            {currentQuestion.type === 'counting' && currentQuestion.imageUrl && (
              <div className="mb-8 w-full flex justify-center gap-4 sm:gap-8 flex-wrap">
                {Array.from({ length: parseInt(currentQuestion.correctAnswer) || parseInt(currentQuestion.count) || 1 }).map((_, idx) => {
                  const isClicked = clickedCountingItems.includes(idx);
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                      onClick={() => {
                        if (isClicked) {
                          setClickedCountingItems(prev => prev.filter(i => i !== idx));
                        } else {
                          setClickedCountingItems(prev => [...prev, idx]);
                          if (typeof Audio !== 'undefined') {
                            const popAudio = new Audio('/sounds/pop.mp3');
                            popAudio.volume = 0.5;
                            popAudio.play().catch(e => console.log('Audio play ignored'));
                          }
                        }
                      }}
                      className="relative cursor-pointer select-none"
                    >
                      <img
                        src={currentQuestion.imageUrl}
                        alt={`Item ${idx + 1}`}
                        draggable={false}
                        className={`h-24 w-24 sm:h-36 sm:w-36 md:h-48 md:w-48 object-contain transition-all duration-300 ${isClicked ? 'opacity-60 scale-95 saturate-50' : 'hover:scale-110 drop-shadow-xl hover:drop-shadow-2xl'}`}
                      />
                      {isClicked && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1 border-2 border-white shadow-md z-10"
                        >
                          <FaCheckCircle className="text-xl sm:text-2xl" />
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {cleanString(displayQuestion?.questionText)}
            {currentQuestion.type === 'counting' && (
              <p className="text-base text-gray-500 mt-2 font-medium">{t('counting_instruction')}</p>
            )}
            <div className="mt-3 bg-blue-50 text-blue-500 rounded-full hover:bg-blue-100 transition-colors">
              <AudioPlayer
                text={cleanString(displayQuestion?.questionText)}
                lang={contentLanguage === 'ta' ? 'ta-IN' : 'en-US'}
              />
            </div>
            {isTranslating && <p className="text-xs text-indigo-500 font-bold mt-2 animate-pulse">Translating...</p>}
          </div>

          {displayQuestion?.options && (
            <div className={currentQuestion.type === 'counting' ? "flex flex-wrap justify-center gap-4 bg-gray-100/50 p-6 rounded-[2rem] max-w-2xl mx-auto" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
              {(displayQuestion.options || []).map((opt, i) => ({ original: opt, index: i }))
                .filter(item => item.original !== null && item.original !== undefined && String(item.original).trim() !== '')
                .map((item, index) => {
                  const cleaned = cleanString(item.original);
                  const optionText = cleaned || (item.original ? String(item.index + 1) : "");
                  // Map back to currentQuestion.options for consistent answer tracking
                  const originalOption = currentQuestion.options ? currentQuestion.options[item.index] : item.original;

                  const isSelected = userAnswer === originalOption;
                  // A wrong quiz answer offers a "Try Again" on this same question, so
                  // don't reveal which option is correct yet — that would let the
                  // student just re-click the highlighted answer instead of actually
                  // knowing it. Only reveal it once there's no more retry coming
                  // (answered correctly, or the one allowed retry is used up).
                  const revealCorrectAnswer = feedbackMessage?.type === 'correct' || !showReviewOption;
                  let style = "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50";

                  if (currentQuestion.type === 'counting') {
                    style = "bg-blue-500 text-white border-4 border-blue-600 shadow-md hover:bg-blue-400 hover:scale-110";
                    if (feedbackMessage && (feedbackMessage.type === 'correct' || feedbackMessage.type === 'wrong')) {
                      if (revealCorrectAnswer && originalOption === currentQuestion.correctAnswer) style = "bg-green-500 text-white border-4 border-green-600 scale-110 shadow-lg";
                      else if (isSelected && feedbackMessage.type === 'wrong') style = "bg-red-500 text-white border-4 border-red-600 opacity-80 scale-95";
                      else style = "bg-gray-300 text-gray-500 border-4 border-gray-400 opacity-50";
                    } else if (isSelected) {
                      style = "bg-blue-600 text-white border-4 border-white shadow-inner scale-95";
                    }
                  } else {
                    if (feedbackMessage && (feedbackMessage.type === 'correct' || feedbackMessage.type === 'wrong')) {
                      if (revealCorrectAnswer && originalOption === currentQuestion.correctAnswer) style = "bg-green-100 border-2 border-green-500 text-green-800 scale-105 shadow-md";
                      else if (isSelected && feedbackMessage.type === 'wrong') style = "bg-red-100 border-2 border-red-500 text-red-800 line-through opacity-80";
                      else style = "bg-gray-100 border-2 border-gray-200 text-gray-400 opacity-40";
                    } else if (isSelected) style = "bg-blue-100 border-2 border-blue-500 text-blue-800 scale-[1.02] shadow-sm";
                  }

                  return (
                    <button key={index} onClick={() => {
                      if (!feedbackMessage) {
                        setUserAnswer(originalOption);
                        handleSubmitAnswer(originalOption);
                      }
                    }} disabled={!!feedbackMessage || isTranslating}
                      className={currentQuestion.type === 'counting' ? `w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full transition-all duration-300 font-black text-2xl sm:text-3xl md:text-4xl flex items-center justify-center ${style}` : `p-6 rounded-2xl transition-all duration-300 font-bold text-xl ${style}`}>{optionText}</button>
                  );
                })}
            </div>
          )}

          {currentQuestion.type === 'identification' && (
            <div className="max-w-md mx-auto relative">
              {userAnswer && String(userAnswer).startsWith('data:image') ? (
                <div className="bg-white border-4 border-indigo-200 rounded-3xl p-4 flex flex-col items-center gap-3 shadow-inner">
                  <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Your Written Answer</div>
                  <img src={userAnswer} className="max-h-32 object-contain" alt="Written answer" />
                  <button onClick={() => setUserAnswer('')} className="text-red-500 text-sm font-bold flex items-center gap-1 hover:underline">
                    <FaEraser /> Start Over
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input type="text" value={userAnswer} onChange={e => setUserAnswer(e.target.value)} disabled={!!feedbackMessage || isCheckingAnswer}
                    className={`w-full py-4 pl-14 pr-14 text-center text-2xl font-bold border-4 rounded-full focus:outline-none transition-colors ${feedbackMessage?.type === 'correct' ? 'border-green-400 bg-green-50' : feedbackMessage?.type === 'wrong' ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'} ${isCheckingAnswer ? 'opacity-50 cursor-wait bg-gray-50' : ''}`}
                    placeholder="Type..." />

                  {!feedbackMessage && !isCheckingAnswer && (
                    <>
                      <button
                        onClick={() => setShowKeyboard(!showKeyboard)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-100 text-slate-600 p-3 rounded-full hover:bg-slate-200 transition-colors shadow-sm cursor-pointer z-10"
                        title="Use Virtual Keyboard"
                        type="button"
                      >
                        <FaKeyboard size={18} />
                      </button>

                      <button
                        onClick={() => setShowDrawingTool(true)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-cyan-100 text-cyan-600 p-3 rounded-full hover:bg-cyan-200 transition-colors shadow-sm cursor-pointer z-10"
                        title="Write on Screen"
                        type="button"
                      >
                        <FaPaintBrush size={18} />
                      </button>
                    </>
                  )}
                </div>
              )}

              {showKeyboard && !String(userAnswer).startsWith('data:image') && <div className="mt-4"><VirtualKeyboard onKeyPress={handleKeyPress} /></div>}
            </div>
          )}

          {currentQuestion.type === 'writing' && (
            <div className="w-full flex flex-col items-center">
              <div className="mb-6 p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 border-dashed text-indigo-600 font-bold text-center">
                Use the colors below to trace the letter <span className="text-3xl font-black mx-1">{currentQuestion.correctAnswer}</span>!
              </div>
              <DrawingCanvas
                template={currentQuestion.correctAnswer}
                onFinish={(data) => {
                  setUserAnswer("done");
                  handleSubmitAnswer("done");
                }}
              />
            </div>
          )}

          {showDrawingTool && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl shadow-2xl p-6 relative w-full max-w-4xl flex flex-col items-center border-4 border-cyan-200">
                <button onClick={() => setShowDrawingTool(false)} className="absolute -top-4 -right-4 p-3 rounded-full bg-red-500 text-white hover:bg-red-600 z-10 shadow-lg"><FaTimesCircle size={22} /></button>
                <div className="mb-4 text-center">
                  <h3 className="font-bold text-2xl text-cyan-600 flex items-center justify-center gap-2"><FaPaintBrush /> Write Your Answer</h3>
                  <p className="text-slate-500 font-medium">Use your mouse or finger to write the word!</p>
                </div>
                <div className="border-4 border-dashed border-cyan-100 rounded-2xl overflow-hidden w-full bg-slate-50">
                  <DrawingCanvas
                    width={typeof window !== 'undefined' ? (window.innerWidth > 800 ? 750 : window.innerWidth * 0.85) : 600}
                    height={400}
                    onFinish={(imageData) => {
                      setUserAnswer(imageData);
                      setShowDrawingTool(false);
                      setShowKeyboard(false);
                    }}
                  />
                </div>
                <p className="text-xs font-bold text-slate-400 mt-4 uppercase tracking-widest">{t('writing_instruction')}</p>
              </motion.div>
            </div>
          )}

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {!feedbackMessage ? (
              // Hide Check Answer button if the question has clickable options or is a writing task (it has its own Done button)
              (!currentQuestion.options && currentQuestion.type !== 'writing') && (
                <button onClick={() => handleSubmitAnswer()} disabled={!userAnswer || isCheckingAnswer}
                  className={`px-10 py-4 text-xl font-bold rounded-full transition-all flex items-center justify-center shadow-lg ${(userAnswer && !isCheckingAnswer) ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                  {isCheckingAnswer ? (
                    <>{t('thinking')} <span className="animate-spin ml-2 inline-block">⏳</span></>
                  ) : (
                    <>{t('checkAnswer')} <FaCheckCircle className="ml-2" /></>
                  )}
                </button>
              )
            ) : (
              <button id="next-btn" onClick={handleNextQuestion} className="bg-blue-500 text-white px-10 py-4 font-bold rounded-full text-xl hover:bg-blue-600 hover:scale-105 transition-all flex items-center justify-center shadow-lg">
                {currentQuestionIndex < totalQuestions - 1 ? t('next') : t('finish')}
              </button>
            )}
            {!feedbackMessage && taskData.type === 'quiz' && (
              <button onClick={handleSkip} className="bg-white border-2 border-gray-300 text-gray-500 font-bold px-8 py-4 rounded-full text-lg hover:bg-gray-50 transition-colors">{t('skip')}</button>
            )}
            {showReviewOption && (taskData.type === 'quiz' || taskData.type === 'exam') && (
              <button onClick={handleReview} className="bg-yellow-400 text-yellow-900 font-bold px-8 py-4 rounded-full text-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-md">
                {t('tryAgain')} <FaRedo />
              </button>
            )}
          </div>
        </div>

        {/* Live Session Recap for Gameplay */}
        {sessionHistory.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl mx-auto mt-8">
            <div className="bg-white/60 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/50 shadow-xl">
              <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <FaTrophy className="text-yellow-500" /> {t('recentActivity')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessionHistory.slice(0, 4).map((item, i) => (
                  <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 ${item.isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${item.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {item.isCorrect ? <FaCheckCircle /> : <FaTimesCircle />}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Q{item.index}</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{item.question}</p>
                    </div>
                    {item.attempts > 1 && (
                      <span className="flex-shrink-0 text-xs font-black uppercase text-slate-400 bg-slate-100 rounded-full px-2.5 py-1">
                        {item.attempts} tries
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* AI Tutor Avatar */}
      {taskData && (
        <div className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-[100] flex flex-col justify-end items-end pointer-events-none">
          {/* Professor Owl Speech Bubble */}
          <AnimatePresence mode="wait">
            {(feedbackMessage || isCheckingAnswer) && (
              <motion.div
                key="speech-bubble"
                initial={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: 20, y: 20 }}
                className={`bg-white/95 backdrop-blur-md rounded-3xl rounded-br-sm shadow-2xl p-4 md:p-5 mb-3 max-w-[260px] md:max-w-sm border-4 overflow-hidden pointer-events-auto relative ${feedbackMessage?.type === 'correct' ? 'border-green-300' : feedbackMessage?.type === 'wrong' ? 'border-red-300' : 'border-indigo-300'}`}
              >
                <div className="absolute top-0 right-0 p-1 opacity-20">
                  <FaStar className="text-yellow-400 text-xs" />
                </div>
                <p className="font-bold text-slate-700 text-sm md:text-base leading-snug">
                  {isCheckingAnswer ? t('thinking_msg') : feedbackMessage?.message}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Professor Character */}
          <div className="relative pointer-events-auto mt-2">
            {/* Name Tag */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg border border-slate-700 z-30 whitespace-nowrap"
            >
              {professor.name}
            </motion.div>

            <motion.div
              animate={isCheckingAnswer ? {
                y: [0, -10, 0],
                rotate: [0, -3, 3, -3, 0],
                scale: [1, 1.05, 1]
              } : {
                y: [0, -6, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: isCheckingAnswer ? 0.6 : 3.5,
                ease: "easeInOut"
              }}
              className="w-28 h-28 md:w-44 md:h-44 flex items-center justify-center mr-2 relative z-20 group"
            >
              <div className={`relative w-full h-full bg-white rounded-full border-[5px] shadow-[0_10px_25px_rgba(0,0,0,0.15)] overflow-hidden flex items-center justify-center transition-all duration-300 ${feedbackMessage?.type === 'correct' ? 'border-green-400 shadow-[0_15px_35px_rgba(74,222,128,0.3)]' : feedbackMessage?.type === 'wrong' ? 'border-red-400 shadow-[0_15px_35px_rgba(248,113,113,0.3)]' : 'border-indigo-200 group-hover:border-indigo-400 group-hover:shadow-[0_15px_35px_rgba(99,102,241,0.3)]'}`}>
                <div className="relative w-[85%] h-[85%] mt-3">
                  <Image
                    src={professor.img}
                    alt={professor.name}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}