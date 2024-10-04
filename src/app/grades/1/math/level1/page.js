// src/app/grades/1/math/level1/page.js

"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect } from "react"; // Import React and useState
import Image from "next/image"; // Import Image from next/image for optimized images
import Header from "../../../../components/layout/header/Header"; // Import Header component
import Footer from "../../../../components/layout/footer/Footer"; // Import Footer component
import BackToTop from "../../../../components/ui/BackToTop"; // Import BackToTop button

// Sample questions
const questions = [
  {
    question: "How many apples do you see?",
    answer: "2",
    count: 2, // Number of images to display
    image: "/images/apple.png", // Ensure these images exist in your public folder
    width: 100, // Set the width for Image component
    height: 100, // Set the height for Image component
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
  });
  const [completed, setCompleted] = useState(false); // To track if the user completed all questions

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("level1Progress");
    if (savedProgress) {
      const { correct, incorrect, wrongAnswers, completed } =
        JSON.parse(savedProgress);
      setProgress({ correct, incorrect, wrongAnswers });
      setCompleted(completed);
      setCurrentQuestionIndex(wrongAnswers.length ? 0 : 0); // Start from the first question
    }
  }, []);

  const validateAnswer = () => {
    if (userAnswer === questions[currentQuestionIndex].answer) {
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

    // Move to the next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setFeedback("You've completed all the questions! 🎉");
        setCompleted(true); // Set completed to true
      }
      setUserAnswer(""); // Clear the input for the next question
    }, 2000); // Delay of 2 seconds to show feedback
  };

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(
      "level1Progress",
      JSON.stringify({ ...progress, completed })
    );
  }, [progress, completed]);

  // Calculate progress percentage
  const progressPercentage = (progress.correct / questions.length) * 100;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Level 1: Counting</h1>
        <div className="mb-4 bg-gray-100 p-6 rounded-lg shadow w-full max-w-md">
          {/* Display the appropriate number of images based on the count */}
          <div className="flex justify-center">
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
          <h2 className="text-xl mt-2">
            {questions[currentQuestionIndex].question}
          </h2>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Your answer"
            className="border border-gray-300 rounded p-2 mt-2 w-full"
          />
          <button
            onClick={validateAnswer}
            className="bg-blue-500 text-white py-1 px-3 rounded mt-2"
            disabled={!userAnswer} // Disable button if input is empty
          >
            Submit
          </button>
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
          <h3 className="font-bold">Progress:</h3>
          <p>Correct: {progress.correct}</p>
          <p>Incorrect: {progress.incorrect}</p>
          <p>Wrong Answers: {progress.wrongAnswers.join(", ") || "None"}</p>
          <div className="mt-2">
            <div className="h-4 bg-blue-300 rounded">
              <div
                className="h-full bg-blue-500 rounded"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-right">
              {progressPercentage.toFixed(0)}% Complete
            </p>
          </div>
          {completed && (
            <p className="text-green-600 font-bold">
              You've completed this level! 🎉
            </p>
          )}
        </div>

        {/* Button to return to Math Page */}
        {completed && (
          <button
            onClick={() => {
              localStorage.setItem(
                "mathProgress",
                JSON.stringify({
                  status: "Completed",
                  wrongAnswers: progress.wrongAnswers.length,
                })
              );
              window.location.href = "/grades/1/math"; // Redirect to Math page
            }}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
          >
            Back to Levels
          </button>
        )}

        {/* Review Incorrect Answers */}
        {completed && progress.incorrect > 0 && (
          <div className="mt-4">
            <h3 className="font-bold">Review Incorrect Answers:</h3>
            <ul className="list-disc list-inside">
              {progress.wrongAnswers.map((question, index) => (
                <li key={index} className="text-red-500">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Level1;
