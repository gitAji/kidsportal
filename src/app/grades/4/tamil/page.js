"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import BackToTop from "@/components/ui/BackToTop";
import Modal from "@/components/ui/Modal";
import VoiceButton from "@/components/ui/VoiceButton";
import { FaCheckCircle, FaTimesCircle, FaTrophy, FaClock } from "react-icons/fa";

const optionButtonStyle = {
  minWidth: "120px",
  minHeight: "60px",
  fontSize: "24px",
  fontWeight: "bold",
};

const questions = [
  {
    questionTamil: "கீழே உள்ள வாக்கியத்தைப் படித்து கேள்விக்கு பதிலளிக்கவும்: 'ராமு பள்ளிக்குச் சென்றான்.'",
    question: "ராமு எங்கே சென்றான்?",
    answer: "பள்ளிக்கு",
    image: "/images/placeholder.png", // Placeholder for school
    audio: "/sounds/tamil/பள்ளிக்கு.mp3",
    options: ["பள்ளிக்கு", "சந்தைக்கு", "வீட்டிற்கு", "கோவிலுக்கு"],
  },
  {
    questionTamil: "கீழே உள்ள வாக்கியத்தைப் படித்து கேள்விக்கு பதிலளிக்கவும்: 'பூனை பால் குடித்தது.'",
    question: "பூனை என்ன குடித்தது?",
    answer: "பால்",
    image: "/images/cat.png",
    audio: "/sounds/tamil/பால்.mp3",
    options: ["தண்ணீர்", "பால்", "ஜூஸ்", "காபி"],
  },
];

const Level1 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [progress, setProgress] = useState({
    correct: 0,
    incorrect: 0,
    correctTimes: [],
    incorrectTimes: [],
  });
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const questionStartTimeRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    if (!completed) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [completed]);

  useEffect(() => {
    if (!completed) {
      questionStartTimeRef.current = Date.now();
      const audio = new Audio(questions[currentQuestionIndex].audio);
      audio.play().catch((err) => console.error("Audio play failed:", err));
    }
  }, [currentQuestionIndex, completed]);

  const handleAnswer = (answer) => {
    if (showFeedback) return;

    const timeTaken = (Date.now() - questionStartTimeRef.current) / 1000;
    setUserAnswer(answer);
    setShowFeedback(true);

    const correctAnswer = questions[currentQuestionIndex].answer;
    if (answer === correctAnswer) {
      setIsCorrect(true);
      setProgress((prev) => ({
        ...prev,
        correct: prev.correct + 1,
        correctTimes: [...prev.correctTimes, timeTaken],
      }));
    } else {
      setIsCorrect(false);
      setProgress((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        incorrectTimes: [...prev.incorrectTimes, timeTaken],
      }));
    }

    setTimeout(() => {
      setShowFeedback(false);
      setIsCorrect(null);
      setUserAnswer(null);
      setTimer(0);

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setCompleted(true);
        clearInterval(timerRef.current);
      }
    }, 2500);
  };

  const handleReattempt = () => {
    setProgress({ correct: 0, incorrect: 0, correctTimes: [], incorrectTimes: [] });
    setCompleted(false);
    setCurrentQuestionIndex(0);
    setTimer(0);
  };

  const goToTamilPage = () => {
    router.push("/grades/4/tamil");
  };

  const calculateAverageTime = (times) => {
    if (times.length === 0) return "0.00";
    const total = times.reduce((acc, time) => acc + time, 0);
    return (total / times.length).toFixed(2);
  };

  const progressPercentage = Math.round(
    (currentQuestionIndex / questions.length) * 100
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-yellow-100 to-pink-100">
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow container mx-auto p-4 flex flex-col items-center justify-center">
        {!completed ? (
          <div className="w-full max-w-2xl p-6 bg-white rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="text-2xl font-bold text-gray-700">
                <FaClock className="inline mr-2" />
                <span className="text-purple-600">{timer} வினாடிகள்</span>
              </div>
              <div className="w-1/2 bg-gray-200 rounded-full h-6">
                <div
                  className="bg-purple-600 h-full rounded-full text-white text-center font-bold transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                >
                  {progressPercentage}%
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <Image
                src={questions[currentQuestionIndex].image}
                alt={questions[currentQuestionIndex].questionTamil}
                width={150}
                height={150}
                className="mx-auto rounded-lg shadow-md"
              />
              <h2 className="text-2xl mt-4 font-bold text-gray-800">
                {questions[currentQuestionIndex].questionTamil}
              </h2>
              <h3 className="text-3xl mt-2 font-bold text-gray-800">
                {questions[currentQuestionIndex].question}
              </h3>
              <VoiceButton questionText={questions[currentQuestionIndex].answer} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {questions[currentQuestionIndex].options.map((option, i) => (
                <button
                  key={i}
                  style={optionButtonStyle}
                  className={`rounded-lg p-4 text-white transition duration-300 transform hover:scale-105 ${
                    showFeedback
                      ? option === questions[currentQuestionIndex].answer
                        ? "bg-green-500"
                        : userAnswer === option
                        ? "bg-red-500"
                        : "bg-gray-400"
                      : "bg-purple-500 hover:bg-purple-600"
                  }`}
                  onClick={() => handleAnswer(option)}
                  disabled={showFeedback}
                >
                  {option}
                </button>
              ))}
            </div>

            {showFeedback && (
              <div className="text-center mt-6">
                {isCorrect ? (
                  <FaCheckCircle className="text-green-500 text-6xl mx-auto" />
                ) : (
                  <FaTimesCircle className="text-red-500 text-6xl mx-auto" />
                )}
                <p className="text-xl font-semibold mt-2">
                  {isCorrect
                    ? `சரியான பதில்!`
                    : `சரியான பதில்: ${questions[currentQuestionIndex].answer}`}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <FaTrophy className="text-yellow-400 text-8xl mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">வாழ்த்துக்கள்!</h1>
            <p className="text-xl text-gray-600 mb-6">நீங்கள் இந்த நிலையை முடித்துவிட்டீர்கள்!</p>
            <div className="grid grid-cols-2 gap-4 text-xl font-bold">
              <div className="text-green-500">
                <FaCheckCircle className="inline mr-2" />
                சரி: {progress.correct}
              </div>
              <div className="text-red-500">
                <FaTimesCircle className="inline mr-2" />
                தவறு: {progress.incorrect}
              </div>
              <div className="text-green-500">
                <FaClock className="inline mr-2" />
                சராசரி சரியான நேரம்: {calculateAverageTime(progress.correctTimes)} வி
              </div>
              <div className="text-red-500">
                <FaClock className="inline mr-2" />
                சராசரி தவறான நேரம்: {calculateAverageTime(progress.incorrectTimes)} வி
              </div>
            </div>
            <div className="mt-8">
              <button
                onClick={handleReattempt}
                className="bg-yellow-500 text-white py-3 px-6 rounded-lg text-xl font-bold mr-4 transform hover:scale-105"
              >
                மீண்டும் முயற்சிக்கவும்
              </button>
              <button
                onClick={goToTamilPage}
                className="bg-blue-500 text-white py-3 px-6 rounded-lg text-xl font-bold transform hover:scale-105"
              >
                தமிழ் நிலைகளுக்குச் செல்லவும்
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <BackToTop />
      {isModalOpen && (
        <Modal
          setIsModalOpen={setIsModalOpen}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
        />
      )}
    </div>
  );
};

export default Level1;
