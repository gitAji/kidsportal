"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect } from "react";
import Image from "next/image"; // Optimized images with Next.js
import Header from "@/components/layout/header/Header"; // Import Header component
import Footer from "@/components/layout/footer/Footer"; // Import Footer component
import BackToTop from "@/components/ui/BackToTop"; // Import BackToTop button
import Modal from "@/components/ui/Modal"; // Import Modal component

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

const Level1 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [progress, setProgress] = useState({
    correct: 0,
    incorrect: 0,
    wrongAnswers: [],
    attempted: 0,
  });
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("level1Progress");
    if (savedProgress) {
      const { correct, incorrect, wrongAnswers, attempted, completed } =
        JSON.parse(savedProgress);
      setProgress({ correct, incorrect, wrongAnswers, attempted });
      setCompleted(completed);
      setCurrentQuestionIndex(0);
    }
  }, []);

  const validateAnswer = () => {
    const trimmedAnswer = userAnswer.trim();

    setProgress((prev) => ({ ...prev, attempted: prev.attempted + 1 })); // Increase attempt count

    if (trimmedAnswer === questions[currentQuestionIndex].answer) {
      setFeedback("Well done! 🎉");
      setProgress((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setFeedback(
        `Oops! The correct answer was ${questions[currentQuestionIndex].answer}. 😞`
      );
      setProgress((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        wrongAnswers: [
          ...prev.wrongAnswers,
          questions[currentQuestionIndex].question,
        ],
      }));
    }

    // Move to the next question or end the quiz if all questions are completed
    setTimeout(() => {
      setFeedback(""); // Clear feedback after moving to next question
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setUserAnswer(""); // Clear the input for the next question
      } else {
        setCompleted(true); // Set completed to true when done
      }
    }, 2000);
  };

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(
      "level1Progress",
      JSON.stringify({ ...progress, completed })
    );
  }, [progress, completed]);

  // Calculate progress percentage based on attempted questions
  const progressPercentage = (progress.attempted / questions.length) * 100;

  const handleReattempt = () => {
    setProgress({ correct: 0, incorrect: 0, wrongAnswers: [], attempted: 0 });
    setCompleted(false);
    setCurrentQuestionIndex(0); // Restart the questions
    setUserAnswer(""); // Clear the input
  };

  const goToMathPage = () => {
    window.location.href = "/grades/1/math"; // Redirect to Math page
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow p-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Level 1: Counting</h1>
        <div className="mb-4 bg-gray-100 p-6 rounded-lg shadow w-full max-w-md">
          {/* Display a "completed" image if quiz is done */}
          {completed ? (
            <div className="flex justify-center">
              <Image
                src="/images/completed.png" // Image for completion state
                alt="Completed"
                width={150}
                height={150}
              />
            </div>
          ) : (
            <div className="flex flex-wrap justify-center">
              {[...Array(questions[currentQuestionIndex].count)].map(
                (_, index) => (
                  <Image
                    key={index}
                    src={questions[currentQuestionIndex].image}
                    alt={questions[currentQuestionIndex].question}
                    width={questions[currentQuestionIndex].width}
                    height={questions[currentQuestionIndex].height}
                    className="mb-2"
                  />
                )
              )}
            </div>
          )}

          <h2 className="text-xl mt-2 text-black">
            {completed
              ? "Quiz Completed!"
              : questions[currentQuestionIndex].question}
          </h2>

          {!completed && (
            <>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer"
                className="border border-gray-300 rounded p-2 mt-2 w-full text-black"
              />
              <button
                onClick={validateAnswer}
                className="bg-blue-500 text-white py-1 px-3 rounded mt-2"
                disabled={!userAnswer} // Disable button if input is empty
              >
                Submit
              </button>
            </>
          )}
          {feedback && (
            <div
              className={`mt-2 ${
                feedback.includes("Well done")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {feedback}
            </div>
          )}
        </div>

        {/* Progress Status */}
        <div className="mt-4 bg-gray-200 p-4 rounded-lg shadow w-full max-w-md">
          <h3 className="font-bold text-black">Progress:</h3>
          <p className="text-black">Correct: {progress.correct}</p>
          <p className="text-black">Incorrect: {progress.incorrect}</p>
          <p className="text-black">
            Wrong Answers: {progress.wrongAnswers.join(", ") || "None"}
          </p>
          <div className="mt-2">
            <div className="h-4 bg-blue-300 rounded">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <div>
              <p className="text-xs text-right text-black">
                {progressPercentage.toFixed(0)}% Completed
              </p>
            </div>
          </div>

          {/* Retry All */}
          {completed && progress.correct !== questions.length && (
            <button
              onClick={handleReattempt}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Retry All
            </button>
          )}

          {/* Show "Back to Levels" if all answers are correct */}
          {completed && progress.correct === questions.length && (
            <button
              onClick={goToMathPage}
              className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
            >
              Back to Levels
            </button>
          )}

          {/* Completion Summary */}
          {completed && (
            <p className="text-green-600 font-bold mt-4">
              Done! You got {progress.correct} right out of {questions.length}!
              🎉
            </p>
          )}
        </div>
      </main>

      <Footer />
      <BackToTop />
      <Modal
          setIsModalOpen={setIsModalOpen}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
        />
    </div>
  );
};

export default Level1;
