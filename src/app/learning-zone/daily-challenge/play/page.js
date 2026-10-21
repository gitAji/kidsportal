"use client";

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCheck, FaTimes } from 'react-icons/fa';
import { useChild } from '../../../providers/ChildProvider';
import { getDailyChallengeQuestions, recordDailyChallengeCompletion } from '../../../utils/dailyChallenge';
import GameCompleteScreen from '../../../components/games/GameCompleteScreen';
import MinimalBackButton from '../../../components/child/MinimalBackButton';

function isCorrectAnswer(answer, correctAnswer) {
  return String(answer).toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();
}

function IdentificationInput({ correctAnswer, showResult, onSubmit }) {
  const [value, setValue] = useState('');
  return (
    <div>
      <input
        type="text"
        value={value}
        disabled={showResult}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your answer..."
        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 font-bold text-slate-700 focus:border-orange-400 focus:outline-none mb-3"
      />
      {!showResult && (
        <button
          onClick={() => onSubmit(value)}
          disabled={!value.trim()}
          className="w-full bg-orange-400 text-white font-black px-6 py-3 rounded-full disabled:opacity-40"
        >
          Submit
        </button>
      )}
      {showResult && (
        <p className="font-bold text-slate-500">
          Correct answer: <span className="text-emerald-600">{correctAnswer}</span>
        </p>
      )}
    </div>
  );
}

export default function DailyChallengePlayPage() {
  const { childUser } = useChild();
  const router = useRouter();
  const childId = childUser?.uid || childUser?.id;

  const questions = useMemo(
    () => (childUser?.gradeId ? getDailyChallengeQuestions(childUser.gradeId) : []),
    [childUser?.gradeId]
  );

  const [index, setIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!childUser) return null;

  if (questions.length === 0) {
    return (
      <>
        <MinimalBackButton />
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-10 text-center max-w-md border-4 border-white">
            <h1 className="text-2xl font-black text-slate-800 mb-3">No challenge available yet</h1>
            <p className="text-slate-500 font-bold mb-6">Finish a few lessons first, then come back!</p>
            <button
              onClick={() => router.push('/learning-zone/daily-challenge')}
              className="bg-slate-800 text-white font-black px-8 py-3 rounded-full"
            >
              Back
            </button>
          </div>
        </div>
      </>
    );
  }

  if (finished) {
    const stars = correctCount === questions.length ? 3 : correctCount >= Math.ceil(questions.length * 0.6) ? 2 : correctCount > 0 ? 1 : 0;
    return (
      <>
        <MinimalBackButton />
        <GameCompleteScreen
          title="Challenge Complete!"
          stars={stars}
          message={`You got ${correctCount} out of ${questions.length} right. Come back tomorrow to keep your streak going!`}
          onPlayAgain={() => {
            setIndex(0);
            setSelectedAnswer(null);
            setShowResult(false);
            setCorrectCount(0);
            setFinished(false);
          }}
          onBackToGames={() => router.push('/learning-zone/daily-challenge')}
        />
      </>
    );
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const handleSelect = (answer) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);
    if (isCorrectAnswer(answer, question.correctAnswer)) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (isLast) {
      recordDailyChallengeCompletion(childId, correctCount, questions.length);
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 to-amber-100">
      <MinimalBackButton />
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-black text-slate-500 uppercase tracking-widest">{question.subjectName}</span>
          <span className="text-sm font-black text-slate-500">{index + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-white/60 rounded-full h-3 mb-8 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-orange-400 to-amber-400 h-full rounded-full"
            animate={{ width: `${((index + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={question.questionId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-[2.5rem] shadow-xl p-8 border-4 border-white"
          >
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-6">{question.questionText}</h2>

            {question.type === 'multiple-choice' ? (
              <div className="grid grid-cols-1 gap-3">
                {question.options.map((opt) => {
                  const isSelected = selectedAnswer === opt;
                  const isRight = isCorrectAnswer(opt, question.correctAnswer);
                  let classes = 'border-slate-200 hover:border-orange-300 hover:bg-orange-50';
                  if (showResult && isRight) classes = 'border-emerald-400 bg-emerald-50';
                  else if (showResult && isSelected && !isRight) classes = 'border-rose-400 bg-rose-50';
                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(opt)}
                      disabled={showResult}
                      className={`text-left px-6 py-4 rounded-2xl border-2 font-bold text-slate-700 transition-all flex items-center justify-between ${classes}`}
                    >
                      {opt}
                      {showResult && isRight && <FaCheck className="text-emerald-500" />}
                      {showResult && isSelected && !isRight && <FaTimes className="text-rose-500" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <IdentificationInput
                correctAnswer={question.correctAnswer}
                showResult={showResult}
                onSubmit={handleSelect}
              />
            )}

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <button
                  onClick={handleNext}
                  className="w-full bg-slate-800 text-white font-black px-6 py-4 rounded-full text-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  {isLast ? 'See Results' : 'Next Question'} <FaArrowRight />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
