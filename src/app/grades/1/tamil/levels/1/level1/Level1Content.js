"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Header from "../../../../../../components/layout/header/Header";
import Footer from "../../../../../../components/layout/footer/Footer";
import BackToTop from "../../../../../../components/ui/BackToTop";
import Modal from "../../../../../../components/ui/Modal";
import VoiceButton from "../../../../../../components/ui/VoiceButton";
import FeedbackMessage from "../../../../../../components/ui/FeedbackMessage";
import ProgressBar from "../../../../../../components/ui/ProgressBar";
import dynamic from 'next/dynamic';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const useSound = dynamic(() => import('use-sound'), { ssr: false });
import correctSound from "@/public/sounds/correct.mp3";
import incorrectSound from "@/public/sounds/incorrect.mp3";
import "animate.css";

// Sample questions array in Tamil with 12 main letters
const questions = [
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "அ",
    image: "/images/அ.png",
    width: 100,
    height: 100,
    options: ["அ", "ஆ", "இ", "ஈ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "ஆ",
    image: "/images/ஆ.png",
    width: 100,
    height: 100,
    options: ["அ", "ஆ", "இ", "ஈ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "இ",
    image: "/images/இ.png",
    width: 100,
    height: 100,
    options: ["இ", "ஈ", "உ", "எ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "ஈ",
    image: "/images/ஈ.png",
    width: 100,
    height: 100,
    options: ["இ", "ஈ", "உ", "எ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "உ",
    image: "/images/உ.png",
    width: 100,
    height: 100,
    options: ["உ", "எ", "ஏ", "ஒ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "எ",
    image: "/images/எ.png",
    width: 100,
    height: 100,
    options: ["உ", "எ", "ஏ", "ஒ"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "ஏ",
    image: "/images/ஏ.png",
    width: 100,
    height: 100,
    options: ["ஏ", "ஒ", "ஃ", "க"],
  },
  {
    questionTamil: "இந்த எழுத்தை கண்டுபிடிக்கவும்",
    questionEnglish: "Find this letter",
    answer: "ஒ",
    image: "/images/ஒ.png",
    width: 100,
    height: 100,
    options: ["ஏ", "ஒ", "ஃ", "க"],
  },
];

export default function Level1Content() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const pathname = usePathname();
  const levelId = parseInt(pathname.split('/').pop());

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  if (loadingUser) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-grow p-4">
          <p>Loading user data...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (levelId > 2 && (!currentUser || !isPremiumUser)) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
        <main className="flex-grow p-4 flex flex-col items-center justify-center text-white">
          <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl text-center backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-4 text-red-500">Access Denied</h2>
            <p className="text-gray-700 mb-4">This level is only available to Premium users.</p>
            <button
              onClick={() => router.push('/pricing')}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Upgrade to Premium
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#87CEEB", // Sky blue background
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "bubble",
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 200,
                size: 40,
                duration: 2,
                opacity: 0.8,
                speed: 3,
              },
              push: {
                quantity: 4,
              },
            },
          },
          particles: {
            color: {
              value: "#FFFFFF", // White bubbles
            },
            links: {
              enable: false,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle", // Bubbles
            },
            size: {
              value: { min: 1, max: 10 },
            },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Ensure it's in the background
        }}
      />
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow p-4 flex flex-col items-center justify-center relative z-10">
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
                className="border-2 border-yellow-300 bg-transparent text-white rounded-full p-3 w-full max-w-xs text-center text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-yellow-200"
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
}