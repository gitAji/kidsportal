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
import Lottie from "lottie-react";

const useSound = dynamic(() => import('use-sound'), { ssr: false });
import correctSound from "../../../../../../../public/sounds/correct.mp3";
import incorrectSound from "../../../../../../../public/sounds/incorrect.mp3";
import "animate.css";

// Sample questions array for English Level 1
const questions = [
  {
    question: "What color is the apple?",
    answer: "Red",
    options: ["Red", "Green", "Blue", "Yellow"],
    image: "/images/apple.png",
    width: 100,
    height: 100,
  },
  {
    question: "What color is the sky?",
    answer: "Blue",
    options: ["Blue", "Green", "Red", "Yellow"],
    image: "/images/cloud.png", // Using cloud for sky
    width: 100,
    height: 100,
  },
  {
    question: "What color is a banana?",
    answer: "Yellow",
    options: ["Yellow", "Blue", "Red", "Green"],
    image: "/images/banana.png",
    width: 100,
    height: 100,
  },
  {
    question: "What color is the grass?",
    answer: "Green",
    options: ["Green", "Blue", "Red", "Yellow"],
    image: "/images/grass.png",
    width: 100,
    height: 100,
  },
];

const optionColors = {
  Red: "bg-red-500 hover:bg-red-600",
  Green: "bg-green-500 hover:bg-green-600",
  Blue: "bg-blue-500 hover:bg-blue-600",
  Yellow: "bg-yellow-400 hover:bg-yellow-500",
};

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

  const [playCorrect] = useSound(correctSound);
  const [playIncorrect] = useSound(incorrectSound);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setIsPremiumUser(userDocSnap.data().isPremium || false);
        }
      }
      setLoadingUser(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const savedProgress = localStorage.getItem("englishL1Progress");
    if (savedProgress) {
      const { completed, currentQuestionIndex } = JSON.parse(savedProgress);
      setCompleted(completed);
      setCurrentQuestionIndex(currentQuestionIndex);
      setProgress((currentQuestionIndex / questions.length) * 100);
    }
  }, []);

  const validateAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setFeedback("Super! That's right! ✨");
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
            "englishL1Progress",
            JSON.stringify({ completed: false, currentQuestionIndex: nextIndex })
          );
        } else {
          setCompleted(true);
          setProgress(100);
          localStorage.setItem(
            "englishL1Progress",
            JSON.stringify({ completed: true, currentQuestionIndex: 0 })
          );
        }
      }, 1500);
    } else {
      setFeedback("Not quite, try again!");
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
    localStorage.removeItem("englishL1Progress");
  };

  const goToEnglishPage = () => {
    window.location.href = "/grades/1/english";
  };

  const pathname = usePathname();
  const levelId = parseInt(pathname.split('/').pop());

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
        <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
          Level 1: Color Champions!
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
                You are a Color Master!
              </h2>
              <div className="mt-6">
                <button
                  onClick={handleReattempt}
                  className="bg-yellow-400 text-white py-3 px-6 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-transform duration-300 mr-4"
                >
                  Play Again
                </button>
                <button
                  onClick={goToEnglishPage}
                  className="bg-green-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-transform duration-300"
                >
                  Back to English
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
        <Modal
          setIsModalOpen={setIsModalOpen}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
        />
      )}
    </div>
  );
}