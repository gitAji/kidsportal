"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Header from "../../../../components/layout/header/Header";
import Footer from "../../../../components/layout/footer/Footer";
import BackToTop from "../../../../components/ui/BackToTop";
import ToggleModal from "../../../../components/ui/Modal";

// Sample questions
const questions = [
  {
    question: "How many apples do you see?",
    answer: "2",
    count: 2, // Number of images to display
    image: "/images/apple.png", // Ensure these images exist in your public folder
    width: 100, // Set the width for Image component
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
  });
  const [completed, setCompleted] = useState(false);
  const [reviewingWrongAnswers, setReviewingWrongAnswers] = useState(false);
  const [wrongQuestionIndex, setWrongQuestionIndex] = useState(0); // To track wrong question index

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem("level1Progress");
    if (savedProgress) {
      const { correct, incorrect, wrongAnswers, completed } =
        JSON.parse(savedProgress);
      setProgress({ correct, incorrect, wrongAnswers });
      setCompleted(completed);
      setCurrentQuestionIndex(0); // Start from the first question
    }
  }, []);

  const validateAnswer = () => {
    const trimmedAnswer = userAnswer.trim();

    if (trimmedAnswer === questions[currentQuestionIndex].answer) {
      setFeedback("Well done! 🎉");
      setProgress((prev) => ({ ...prev, correct: prev.correct + 1 }));

      // If reviewing wrong answers, remove this question from wrongAnswers
      if (reviewingWrongAnswers) {
        setProgress((prev) => ({
          ...prev,
          wrongAnswers: prev.wrongAnswers.filter(
            (q) => q !== questions[currentQuestionIndex].question
          ),
        }));
      }
    } else {
      setFeedback(
        `Oops! The correct answer was ${questions[currentQuestionIndex].answer}. 😞`
      );
      if (!reviewingWrongAnswers) {
        setProgress((prev) => ({
          ...prev,
          incorrect: prev.incorrect + 1,
          wrongAnswers: [
            ...prev.wrongAnswers,
            questions[currentQuestionIndex].question,
          ],
        }));
      }
    }

    // Move to the next question or revisit wrong answers
    setTimeout(() => {
      setFeedback(""); // Clear feedback after moving to next question

      if (
        !reviewingWrongAnswers &&
        currentQuestionIndex < questions.length - 1
      ) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setUserAnswer(""); // Clear the input for the next question
      } else if (reviewingWrongAnswers) {
        revisitWrongAnswers(); // Continue reviewing wrong answers
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

  // Progress percentage capped at 100%
  const progressPercentage = Math.min(
    (progress.correct / questions.length) * 100,
    100
  );

  // Handle revisiting wrong answers
  const revisitWrongAnswers = () => {
    setReviewingWrongAnswers(true);
    if (wrongQuestionIndex < progress.wrongAnswers.length) {
      const wrongQuestionText = progress.wrongAnswers[wrongQuestionIndex];
      const wrongQuestionIndexInQuestions = questions.findIndex(
        (q) => q.question === wrongQuestionText
      );
      setCurrentQuestionIndex(wrongQuestionIndexInQuestions);
      setWrongQuestionIndex(wrongQuestionIndex + 1);
    } else {
      setCompleted(true); // Mark complete if no more wrong questions to review
    }
  };

  const handleReattempt = () => {
    setReviewingWrongAnswers(false);
    setProgress((prev) => ({ ...prev, wrongAnswers: [] })); // Clear wrong answers
    setCurrentQuestionIndex(0); // Restart from the first question
    setCompleted(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow p-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Level 1: Counting</h1>

        {/* Success message if completed */}
        {completed && !reviewingWrongAnswers && (
          <div className="mb-4 bg-green-100 p-6 rounded-lg shadow w-full max-w-md">
            <h2 className="text-2xl font-bold text-green-700">
              You've completed all the questions! 🎉
            </h2>
            <p className="text-green-600">
              Well done! You've finished Level 1.
            </p>
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
          </div>
        )}

        {/* Only show question card if not completed */}
        {!completed && (
          <div className="mb-4 bg-gray-100 p-6 rounded-lg shadow w-full max-w-md">
            {/* Display images based on count */}
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
            <h2 className="text-xl mt-2 text-black">
              {questions[currentQuestionIndex].question}
            </h2>
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
              disabled={!userAnswer}
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
        )}

        {/* Progress bar */}
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
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div>
              <p className="text-xs text-right text-black">
                {progressPercentage.toFixed(0)}% Complete
              </p>
            </div>
          </div>

          {/* Button to Revisit Incorrect Questions */}
          {progress.incorrect > 0 && !reviewingWrongAnswers && (
            <button
              onClick={revisitWrongAnswers}
              className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Revisit Incorrect Questions
            </button>
          )}

          {/* Retry All */}
          {completed && progress.incorrect > 0 && (
            <button
              onClick={handleReattempt}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Retry All
            </button>
          )}
        </div>
      </main>

      <Footer />
      <BackToTop />
      {/* Toggle Modal for SignIn and SignUp */}
      <ToggleModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
    </div>
  );
};

export default Level1;
