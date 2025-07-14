"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image"; // Optimized images with Next.js
import Header from "../../../../components/layout/header/Header"; // Import Header component
import Footer from "../../../../components/layout/footer/Footer"; // Import Footer component
import BackToTop from "../../../../components/ui/BackToTop"; // Import BackToTop button
import ToggleModal from "../../../../components/ui/Modal"; // Import Modal component
import VoiceButton from "../../../../components/ui/VoiceButton"; // Import the new VoiceButton component
import useSound from "use-sound"; // Import use-sound for audio playback
import correctSound from "../../../../../../public/sounds/correct.mp3"; // Correct answer sound
import incorrectSound from "../../../../../../public/sounds/incorrect.mp3"; // Incorrect answer sound
import FeedbackMessage from "../../../../components/ui/FeedbackMessage"; // Import the FeedbackMessage component

import ProgressBar from "../../../../components/ui/ProgressBar"; // Import ProgressBar

// Sample questions array
const questions = [
  {
    question: "How many apples do you see?",
    answer: "2",
    count: 2,
    image: "/images/apple.png",
    width: 100,
    height: 100,
  },
  {
    question: "How many dogs are there?",
    answer: "3",
    count: 3,
    image: "/images/dog.png",
    width: 100,
    height: 100,
  },
  {
    question: "How many cats do you see?",
    answer: "4",
    count: 4,
    image: "/images/cat.png",
    width: 100,
    height: 100,
  },
  {
    question: "How many birds are flying?",
    answer: "5",
    count: 5,
    image: "/images/bird.png",
    width: 100,
    height: 100,
  },
];

const Level1 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [playCorrect] = useSound(correctSound);
  const [playIncorrect] = useSound(incorrectSound);

  useEffect(() => {
    const savedProgress = localStorage.getItem("level1Progress");
    if (savedProgress) {
      const { completed, currentQuestionIndex } = JSON.parse(savedProgress);
      setCompleted(completed);
      setCurrentQuestionIndex(currentQuestionIndex);
      setProgress((currentQuestionIndex / questions.length) * 100);
    }
  }, []);

  const validateAnswer = () => {
    const trimmedAnswer = userAnswer.trim();
    if (trimmedAnswer === questions[currentQuestionIndex].answer) {
      setFeedback("Correct! 🎉");
      setIsCorrect(true);
      playCorrect();
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setProgress((nextIndex / questions.length) * 100);
          setUserAnswer("");
          setFeedback("");
          setIsCorrect(null);
          localStorage.setItem(
            "level1Progress",
            JSON.stringify({ completed: false, currentQuestionIndex: nextIndex })
          );
        } else {
          setCompleted(true);
          setProgress(100);
          localStorage.setItem(
            "level1Progress",
            JSON.stringify({ completed: true, currentQuestionIndex: 0 })
          );
        }
      }, 1500);
    } else {
      setFeedback(
        `Try again! The correct answer was ${questions[currentQuestionIndex].answer}.`
      );
      setIsCorrect(false);
      playIncorrect();
    }
  };

  const handleReattempt = () => {
    setCompleted(false);
    setCurrentQuestionIndex(0);
    setProgress(0);
    setUserAnswer("");
    setFeedback("");
    setIsCorrect(null);
    localStorage.removeItem("level1Progress");
  };

  const goToMathPage = () => {
    window.location.href = "/grades/1/math";
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow p-4 sm:p-6 flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 drop-shadow-lg">
          Level 1: Counting Fun!
        </h1>
        <div className="w-full max-w-2xl mx-auto mb-6">
          <ProgressBar percentage={progress} />
        </div>

        <div className="mt-4 sm:mt-8 bg-white bg-opacity-20 p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center backdrop-blur-sm">
          {completed ? (
            <div className="flex flex-col items-center">
              <Image
                src="/images/completed.avif"
                alt="Completed"
                width={180}
                height={180}
                className="rounded-full shadow-lg mb-4"
              />
              <h2 className="text-2xl sm:text-3xl font-bold mt-4 text-yellow-300">
                Awesome! You did it!
              </h2>
              <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleReattempt}
                  className="bg-yellow-400 text-white py-3 px-6 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-transform duration-300"
                >
                  Play Again
                </button>
                <button
                  onClick={goToMathPage}
                  className="bg-green-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-transform duration-300"
                >
                  Back to Math
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center items-center mb-6">
                {[...Array(questions[currentQuestionIndex].count)].map(
                  (_, index) => (
                    <div
                      key={index}
                      className="transform hover:scale-110 transition-transform duration-300 m-1 sm:m-2"
                    >
                      <Image
                        src={questions[currentQuestionIndex].image}
                        alt={`Item ${index + 1}`}
                        width={questions[currentQuestionIndex].width}
                        height={questions[currentQuestionIndex].height}
                      />
                    </div>
                  )
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold mt-2 text-white">
                {questions[currentQuestionIndex].question}
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center mt-4 space-y-3 sm:space-y-0 sm:space-x-4">
                <VoiceButton
                  questionText={questions[currentQuestionIndex].question}
                />
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Your answer"
                  className="border-2 border-yellow-300 bg-transparent text-white rounded-full p-3 w-full max-w-xs text-center text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-yellow-200"
                />
                <button
                  onClick={validateAnswer}
                  className="bg-pink-500 text-white py-3 px-8 rounded-full shadow-lg hover:bg-pink-600 transform hover:scale-105 transition-transform duration-300"
                  disabled={!userAnswer}
                >
                  Submit
                </button>
              </div>
              {feedback && (
                <FeedbackMessage message={feedback} isCorrect={isCorrect} />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
      {isModalOpen && (
        <ToggleModal
          setIsModalOpen={setIsModalOpen}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
        />
      )}
    </div>
  );
};

export default Level1;
