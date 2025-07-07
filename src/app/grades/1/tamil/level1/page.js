"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Optimized images with Next.js
import Header from "../../../../components/layout/header/Header"; // Import Header component
import Footer from "../../../../components/layout/footer/Footer"; // Import Footer component
import BackToTop from "../../../../components/ui/BackToTop"; // Import BackToTop button
import ToggleModal from "../../../../components/ui/Modal"; // Import Modal component
import VoiceButton from "../../../../components/ui/VoiceButton"; // Import the new VoiceButton component
import FeedbackMessage from "../../../../components/ui/FeedbackMessage"; // Import the FeedbackMessage component

// Sample questions array in Tamil with 12 main letters
const questions = [
  {
    questionTamil: "எந்த எழுத்து 'அ'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "அ",
    image: "/images/அ.png",
    width: 100,
    height: 100,
    options: ["அ", "ஆ", "இ", "ஈ"], // Options for letter selection
  },
  {
    questionTamil: "எந்த எழுத்து 'ஆ'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "ஆ",
    image: "/images/ஆ.png",
    width: 100,
    height: 100,
    options: ["அ", "ஆ", "இ", "ஈ"],
  },
  {
    questionTamil: "எந்த எழுத்து 'இ'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "இ",
    image: "/images/இ.png",
    width: 100,
    height: 100,
    options: ["இ", "ஈ", "உ", "எ"],
  },
  {
    questionTamil: "எந்த எழுத்து 'ஈ'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "ஈ",
    image: "/images/ஈ.png",
    width: 100,
    height: 100,
    options: ["இ", "ஈ", "உ", "எ"],
  },
  {
    questionTamil: "எந்த எழுத்து 'உ'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "உ",
    image: "/images/உ.png",
    width: 100,
    height: 100,
    options: ["உ", "எ", "ஏ", "ஒ"],
  },
  {
    questionTamil: "எந்த எழுத்து 'எ'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "எ",
    image: "/images/எ.png",
    width: 100,
    height: 100,
    options: ["உ", "எ", "ஏ", "ஒ"],
  },
  {
    questionTamil: "எந்த எழுத்து 'ஏ'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "ஏ",
    image: "/images/ஏ.png",
    width: 100,
    height: 100,
    options: ["ஏ", "ஒ", "ஃ", "க"],
  },
  {
    questionTamil: "எந்த எழுத்து 'ஒ'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "ஒ",
    image: "/images/ஒ.png",
    width: 100,
    height: 100,
    options: ["ஏ", "ஒ", "ஃ", "க"],
  },
  {
    questionTamil: "எந்த எழுத்து 'ஃ'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "ஃ",
    image: "/images/ஃ.png",
    width: 100,
    height: 100,
    options: ["ஏ", "ஒ", "ஃ", "க"],
  },
  {
    questionTamil: "எந்த எழுத்து 'க'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "க",
    image: "/images/க.png",
    width: 100,
    height: 100,
    options: ["க", "ச", "ட", "த"],
  },
  {
    questionTamil: "எந்த எழுத்து 'ச'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "ச",
    image: "/images/ச.png",
    width: 100,
    height: 100,
    options: ["க", "ச", "ட", "த"],
  },
  {
    questionTamil: "எந்த எழுத்து 'ட'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "ட",
    image: "/images/ட.png",
    width: 100,
    height: 100,
    options: ["ட", "த", "ப", "ம"],
  },
  {
    questionTamil: "எந்த எழுத்து 'த'?",
    questionEnglish: "Which letter is 'shown in the picture above'?",
    answer: "த",
    image: "/images/த.png",
    width: 100,
    height: 100,
    options: ["ட", "த", "ப", "ம"],
  },
];

const Level1 = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null); // State to track if the answer is correct
  const [progress, setProgress] = useState({
    correct: 0,
    incorrect: 0,
    wrongAnswers: [],
    attempted: 0,
  });
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  // Load progress from localStorage when the component mounts
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

  // Function to validate the user's answer
  const validateAnswer = () => {
    const trimmedAnswer = userAnswer.trim();
    setProgress((prev) => ({ ...prev, attempted: prev.attempted + 1 })); // Increment attempted

    if (trimmedAnswer === questions[currentQuestionIndex].answer) {
      setIsCorrect(true);
      setProgress((prev) => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setIsCorrect(false);
      setProgress((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        wrongAnswers: [
          ...prev.wrongAnswers,
          questions[currentQuestionIndex].questionTamil,
        ],
      }));
    }

    // Move to the next question after 2 seconds or mark as completed
    setTimeout(() => {
      setUserAnswer("");
      setIsCorrect(null); // Reset isCorrect
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setCompleted(true);
      }
    }, 2000);
  };

  // Save progress to localStorage on every update of progress or completion
  useEffect(() => {
    localStorage.setItem(
      "level1Progress",
      JSON.stringify({ ...progress, completed })
    );
  }, [progress, completed]);

  // Function to restart the quiz
  const handleReattempt = () => {
    setProgress({ correct: 0, incorrect: 0, wrongAnswers: [], attempted: 0 });
    setCompleted(false);
    setCurrentQuestionIndex(0);
    setUserAnswer("");
  };

  // Function to navigate back to the Math page
  const goToMathPage = () => {
    window.location.href = "/grades/1/math"; // Redirect to the math page
  };

  // Calculate progress percentage
  const progressPercentage = Math.round(
    ((currentQuestionIndex + 1) / questions.length) * 100
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow container mx-auto p-4">
        <div className="max-w-md mx-auto">
          {/* Display question */}
          {!completed ? (
            <>
              <div className="flex justify-center mb-4">
                <Image
                  src={questions[currentQuestionIndex].image}
                  alt={questions[currentQuestionIndex].questionTamil}
                  width={questions[currentQuestionIndex].width}
                  height={questions[currentQuestionIndex].height}
                />
              </div>

              <h2 className="text-3xl mt-2 text-black">
                {questions[currentQuestionIndex].questionTamil}
              </h2>
              <p className="text-gray-600">
                {questions[currentQuestionIndex].questionEnglish}
              </p>

              {/* Speak button and answer input */}
              <VoiceButton
                questionText={questions[currentQuestionIndex].questionEnglish}
              />
              <div className="mt-4 grid grid-cols-2 gap-4">
                {questions[currentQuestionIndex].options.map((option, i) => (
                  <button
                    key={i}
                    className={`border border-gray-300 rounded p-2 w-full text-black transition duration-300 ${
                      userAnswer === option ? "bg-blue-200" : "bg-red-200"
                    }`}
                    onClick={() => setUserAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <button
                onClick={validateAnswer}
                className="bg-blue-500 text-white py-1 px-3 rounded mt-2"
                disabled={!userAnswer} // Disable button if no answer is provided
              >
                சமர்ப்பிக்கவும்
              </button>

              {/* Progress Bar */}
              <div className="w-full bg-gray-300 rounded-full h-4 mb-4 mt-4">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              {/* Feedback Message */}
              {isCorrect !== null && <FeedbackMessage isCorrect={isCorrect} />}
            </>
          ) : (
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">முடிந்தது!</h1>
              <Image
                src="/images/completed.png" // Image shown on quiz completion
                alt="Completed"
                width={150}
                height={150}
              />
            </div>
          )}

          {/* Progress status */}
          <div className="mt-4 bg-gray-200 p-4 rounded-lg shadow w-full max-w-md">
            <h3 className="font-bold text-black">முன்னேற்றம்:</h3>
            <p className="text-black">சரியான: {progress.correct}</p>
            <p className="text-black">தவறான: {progress.incorrect}</p>
            <p className="text-black">
              தவறான பதில்கள்: {progress.wrongAnswers.join(", ") || "None"}
            </p>
            <p>
              {progress.attempted}/{questions.length} முயற்சிகள்
            </p>
          </div>

          {/* Completion actions */}
          {completed && (
            <div className="mt-4">
              <button
                onClick={handleReattempt}
                className="bg-yellow-500 text-white py-2 px-4 rounded mr-2"
              >
                மீண்டும் முயற்சிக்கவும்
              </button>
              <button
                onClick={goToMathPage}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                கணிதப் பக்கம் செல்லவும்
              </button>
            </div>
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
