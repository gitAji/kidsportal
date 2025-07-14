"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image"; // Optimized images with Next.js
import Header from "../../../../components/layout/header/Header"; // Import Header component
import Footer from "../../../../components/layout/footer/Footer"; // Import Footer component
import BackToTop from "../../../../components/ui/BackToTop"; // Import BackToTop button
import ToggleModal from "../../../../components/ui/Modal"; // Import Modal component

// Sample questions
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

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../../../../components/layout/header/Header";
import Footer from "../../../../components/layout/footer/Footer";
import BackToTop from "../../../../components/ui/BackToTop";
import ToggleModal from "../../../../components/ui/Modal";
import VoiceButton from "../../../../components/ui/VoiceButton";
import FeedbackMessage from "../../../../components/ui/FeedbackMessage";
import ProgressBar from "../../../../components/ui/ProgressBar";
import useSound from "use-sound";
import correctSound from "../../../../../../public/sounds/correct.mp3";
import incorrectSound from "../../../../../../public/sounds/incorrect.mp3";
import "animate.css";

// Sample questions for Ariviyal Level 1
const questions = [
  {
    question: "Which of these is a fruit?",
    answer: "Apple",
    options: ["Apple", "Carrot", "Broccoli", "Potato"],
    image: "/images/apple.png",
    width: 100,
    height: 100,
  },
  {
    question: "Which of these is a vegetable?",
    answer: "Carrot",
    options: ["Banana", "Carrot", "Orange", "Grapes"],
    image: "/images/apple.png", // Placeholder
    width: 100,
    height: 100,
  },
];

const optionColors = {
  Apple: "bg-red-500 hover:bg-red-600",
  Carrot: "bg-orange-500 hover:bg-orange-600",
  Broccoli: "bg-green-500 hover:bg-green-600",
  Potato: "bg-yellow-700 hover:bg-yellow-800",
  Banana: "bg-yellow-400 hover:bg-yellow-500",
  Orange: "bg-orange-500 hover:bg-orange-600",
  Grapes: "bg-purple-500 hover:bg-purple-600",
};

const Level1 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [playCorrect] = useSound(correctSound);
  const [playIncorrect] = useSound(incorrectSound);

  useEffect(() => {
    const savedProgress = localStorage.getItem("ariviyalL1Progress");
    if (savedProgress) {
      const { completed, currentQuestionIndex } = JSON.parse(savedProgress);
      setCompleted(completed);
      setCurrentQuestionIndex(currentQuestionIndex);
      setProgress((currentQuestionIndex / questions.length) * 100);
    }
  }, []);

  const validateAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setFeedback("Correct! You are a science whiz! 🔬");
      setIsCorrect(true);
      playCorrect();
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setProgress((nextIndex / questions.length) * 100);
          setFeedback("");
          setIsCorrect(null);
          localStorage.setItem(
            "ariviyalL1Progress",
            JSON.stringify({ completed: false, currentQuestionIndex: nextIndex })
          );
        } else {
          setCompleted(true);
          setProgress(100);
          localStorage.setItem(
            "ariviyalL1Progress",
            JSON.stringify({ completed: true, currentQuestionIndex: 0 })
          );
        }
      }, 1500);
    } else {
      setFeedback("Not quite, give it another go!");
      setIsCorrect(false);
      playIncorrect();
    }
  };

  const handleReattempt = () => {
    setCompleted(false);
    setCurrentQuestionIndex(0);
    setProgress(0);
    setFeedback("");
    setIsCorrect(null);
    localStorage.removeItem("ariviyalL1Progress");
  };

  const goToAriviyalPage = () => {
    window.location.href = "/grades/1/ariviyal";
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow p-4 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
          Level 1: Science Explorer!
        </h1>
        <div className="w-full max-w-2xl mx-auto">
          <ProgressBar percentage={progress} />
        </div>

        <div className="mt-8 bg-white bg-opacity-20 p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center backdrop-blur-sm">
          {completed ? (
            <div className="flex flex-col items-center">
              <Image
                src="/images/completed.avif"
                alt="Completed"
                width={200}
                height={200}
                className="rounded-full shadow-lg"
              />
              <h2 className="text-3xl font-bold mt-4 text-yellow-300">
                You are a Science Superstar!
              </h2>
              <div className="mt-6">
                <button
                  onClick={handleReattempt}
                  className="bg-yellow-400 text-white py-3 px-6 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-transform duration-300 mr-4"
                >
                  Play Again
                </button>
                <button
                  onClick={goToAriviyalPage}
                  className="bg-green-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-transform duration-300"
                >
                  Back to Ariviyal
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center items-center mb-6">
                <Image
                  src={questions[currentQuestionIndex].image}
                  alt={questions[currentQuestionIndex].question}
                  width={questions[currentQuestionIndex].width}
                  height={questions[currentQuestionIndex].height}
                  className="transform hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h2 className="text-2xl font-semibold mt-2 text-white flex items-center justify-center">
                {questions[currentQuestionIndex].question}
                <VoiceButton
                  questionText={questions[currentQuestionIndex].question}
                />
              </h2>
              <div className="grid grid-cols-2 gap-4 mt-6">
                {questions[currentQuestionIndex].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => validateAnswer(option)}
                    className={`${optionColors[option]} text-white font-bold py-4 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300`}
                  >
                    {option}
                  </button>
                ))}
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


export default Level1;
