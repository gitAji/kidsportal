"use client"; // Ensure this component is treated as a client component
import React, { useState, useEffect } from "react";
import Image from "next/image"; // Optimized images with Next.js
import Header from "../../../../components/layout/header/Header"; // Import Header component
import Footer from "../../../../components/layout/footer/Footer"; // Import Footer component
import BackToTop from "../../../../components/ui/BackToTop"; // Import BackToTop button
import ToggleModal from "../../../../components/ui/Modal"; // Import Modal component
import VoiceButton from "../../../../components/ui/VoiceButton"; // Import the new VoiceButton component
import FeedbackMessage from "../../../../components/ui/FeedbackMessage"; // Import the FeedbackMessage component
import "animate.css"; // Import animate.css for animations

// Sample questions array for English Level 1
const questions = [
  {
    question: "What color is the apple?",
    answer: "Red",
    options: ["Red", "Green", "Blue", "Yellow"],
    image: "/images/apple.png", // Replace with an actual image of an apple
    width: 100,
    height: 100,
  },
  {
    question: "What color is the sky?",
    answer: "Blue",
    options: ["Blue", "Green", "Red", "Yellow"],
    image: "/images/sky.png", // Replace with an actual image of the sky
    width: 100,
    height: 100,
  },
  {
    question: "What color is a banana?",
    answer: "Yellow",
    options: ["Yellow", "Blue", "Red", "Green"],
    image: "/images/banana.png", // Replace with an actual image of a banana
    width: 100,
    height: 100,
  },
  {
    question: "What color is the grass?",
    answer: "Green",
    options: ["Green", "Blue", "Red", "Yellow"],
    image: "/images/grass.png", // Replace with an actual image of grass
    width: 100,
    height: 100,
  },
];

const Level1 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [progress, setProgress] = useState({
    correct: 0,
    incorrect: 0,
    attempted: 0,
  });
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem("level1Progress");
    if (savedProgress) {
      const { correct, incorrect, attempted, completed } =
        JSON.parse(savedProgress);
      setProgress({ correct, incorrect, attempted });
      setCompleted(completed);
      setCurrentQuestionIndex(0);
    }
  }, []);

  const validateAnswer = (selectedOption) => {
    setProgress((prev) => ({ ...prev, attempted: prev.attempted + 1 }));

    if (selectedOption === questions[currentQuestionIndex].answer) {
      setFeedback("Great job! You got it right!");
      setIsCorrect(true);
      setProgress((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setFeedback(
        `Oops! The correct answer was "${questions[currentQuestionIndex].answer}".`
      );
      setIsCorrect(false);
      setProgress((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
      }));
    }

    setTimeout(() => {
      setFeedback("");
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setCompleted(true);
      }
    }, 2000);
  };

  useEffect(() => {
    localStorage.setItem(
      "level1Progress",
      JSON.stringify({ ...progress, completed })
    );
  }, [progress, completed]);

  const progressPercentage = (progress.attempted / questions.length) * 100;

  const handleReattempt = () => {
    setProgress({ correct: 0, incorrect: 0, attempted: 0 });
    setCompleted(false);
    setCurrentQuestionIndex(0);
  };

  const goToEnglishPage = () => {
    window.location.href = "/grades/1/english"; // Redirect to the English page
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow p-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Level 1: English Vocabulary</h1>
        <div className="mb-4 bg-gray-100 p-6 rounded-lg shadow w-full max-w-md">
          {/* Quiz completion image */}
          {completed ? (
            <div className="flex justify-center">
              <Image
                src="/images/completed.png" // Image shown on quiz completion
                alt="Completed"
                width={150}
                height={150}
              />
            </div>
          ) : (
            <div className="flex flex-wrap justify-center">
              <Image
                src={questions[currentQuestionIndex].image}
                alt={questions[currentQuestionIndex].question}
                width={questions[currentQuestionIndex].width}
                height={questions[currentQuestionIndex].height}
                className="mb-2"
              />
            </div>
          )}

          <h2 className="text-xl mt-2 text-black">
            {completed
              ? "Quiz Completed!"
              : questions[currentQuestionIndex].question}
          </h2>

          {/* Multiple choice buttons */}
          {!completed && (
            <div className="flex justify-around mt-4">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => validateAnswer(option)}
                  className={`bg-${option.toLowerCase()}-500 text-white p-4 rounded-full w-16 h-16`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Feedback message */}
          {feedback && (
            <FeedbackMessage message={feedback} isCorrect={isCorrect} />
          )}
        </div>

        {/* Progress status */}
        <div className="mt-4 bg-gray-200 p-4 rounded-lg shadow w-full max-w-md">
          <h3 className="font-bold text-black">Progress:</h3>
          <p className="text-black">Correct: {progress.correct}</p>
          <p className="text-black">Incorrect: {progress.incorrect}</p>
          <div className="mt-2">
            <div className="h-4 bg-blue-300 rounded">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <p className="text-black">
              {progress.attempted}/{questions.length} attempted
            </p>
          </div>
        </div>

        {/* Completion actions */}
        {completed && (
          <div className="mt-4">
            <button
              onClick={handleReattempt}
              className="bg-yellow-500 text-white py-2 px-4 rounded mr-2"
            >
              Reattempt
            </button>
            <button
              onClick={goToEnglishPage}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              Go to English Page
            </button>
          </div>
        )}
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
