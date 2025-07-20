"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import BackToTop from "@/components/ui/BackToTop";
import Modal from "@/components/ui/Modal";
import VoiceButton from "@/components/ui/VoiceButton";
import dynamic from 'next/dynamic';
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Lottie from "lottie-react";

const useSound = dynamic(() => import('use-sound'), { ssr: false });
import correctSound from "@/public/sounds/correct.mp3";
import incorrectSound from "@/public/sounds/incorrect.mp3";
import FeedbackMessage from "@/components/ui/FeedbackMessage";
import ProgressBar from "@/components/ui/ProgressBar";

const questions = [
  {
    question: "What is the largest animal on Earth?",
    type: "mcq",
    options: ["Elephant", "Blue Whale", "Giraffe", "Dinosaur"],
    correctAnswer: "Blue Whale",
    rewardPoints: 10,
  },
  {
    question: "Which planet is known as the Red Planet?",
    type: "mcq",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    correctAnswer: "Mars",
    rewardPoints: 10,
  },
  {
    question: "What is the process by which plants make their own food?",
    type: "mcq",
    options: ["Respiration", "Digestion", "Photosynthesis", "Germination"],
    correctAnswer: "Photosynthesis",
    rewardPoints: 10,
  },
  {
    question: "Which of these is a reptile?",
    type: "mcq",
    options: ["Frog", "Fish", "Snake", "Bird"],
    correctAnswer: "Snake",
    rewardPoints: 10,
  },
];

export default function Level2Content() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [progress, setProgress] = useState({
    correct: 0,
    incorrect: 0,
    wrongAnswers: [],
    attempted: 0,
    score: 0,
  });
  const [completed, setCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

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
    const savedProgress = localStorage.getItem("level2AriviyalProgress");
    if (savedProgress) {
      const { correct, incorrect, wrongAnswers, attempted, completed, score } =
        JSON.parse(savedProgress);
      setProgress({ correct, incorrect, wrongAnswers, attempted, score });
      setCompleted(completed);
      setCurrentQuestionIndex(0);
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerActive && !completed) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    } else if (!timerActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, completed, timer]);

  const startTimer = () => {
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
  };

  const validateAnswer = () => {
    const currentQuestion = questions[currentQuestionIndex];
    let isAnswerCorrect = false;

    if (currentQuestion.type === "mcq") {
      isAnswerCorrect = userAnswer === currentQuestion.correctAnswer;
    } else {
      isAnswerCorrect = userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    }

    setProgress((prev) => ({ ...prev, attempted: prev.attempted + 1 }));

    if (isAnswerCorrect) {
      setFeedback("Correct! 🎉");
      setIsCorrect(true);
      playCorrect();
      setProgress((prev) => ({ ...prev, correct: prev.correct + 1, score: prev.score + currentQuestion.rewardPoints }));
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          setUserAnswer("");
          setFeedback("");
          setIsCorrect(null);
          localStorage.setItem(
            "level2AriviyalProgress",
            JSON.stringify({ ...progress, completed: false, currentQuestionIndex: nextIndex })
          );
        } else {
          setCompleted(true);
          stopTimer();
          localStorage.setItem(
            "level2AriviyalProgress",
            JSON.stringify({ ...progress, completed: true, currentQuestionIndex: 0, score: progress.score + currentQuestion.rewardPoints })
          );
        }
      }, 1500);
    } else {
      setFeedback(
        `Try again! The correct answer was ${currentQuestion.correctAnswer}.`
      );
      setIsCorrect(false);
      playIncorrect();
      setProgress((prev) => ({
        ...prev,
        incorrect: prev.incorrect + 1,
        wrongAnswers: [...prev.wrongAnswers, currentQuestionIndex],
      }));
    }
  };

  const handleReattempt = () => {
    setCompleted(false);
    setCurrentQuestionIndex(0);
    setProgress({ correct: 0, incorrect: 0, wrongAnswers: [], attempted: 0, score: 0 });
    setUserAnswer("");
    setFeedback("");
    setIsCorrect(null);
    setTimer(0);
    setTimerActive(false);
    localStorage.removeItem("level2AriviyalProgress");
  };

  const goToSubjectPage = () => {
    window.location.href = `/grades/2/ariviyal`;
  };

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

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col min-h-screen relative">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#87CEEB",
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
              value: "#FFFFFF",
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
              type: "circle",
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
          zIndex: -1,
        }}
      />
      <Header setIsModalOpen={setIsModalOpen} setIsRegister={setIsRegister} />
      <main className="flex-grow p-4 flex flex-col items-center justify-center relative z-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4 drop-shadow-lg">
          Level 2: Science Explorers!
        </h1>
        <div className="w-full max-w-md mx-auto mb-6">
          <ProgressBar percentage={(progress.correct / questions.length) * 100} />
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
                Awesome! You completed the level!
              </h2>
              <p className="text-white text-lg mt-2">Your score: {progress.score} points</p>
              <p className="text-white text-lg mt-2">Time taken: {timer} seconds</p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleReattempt}
                  className="bg-yellow-400 text-white py-3 px-6 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-transform duration-300"
                >
                  Play Again
                </button>
                <button
                  onClick={goToSubjectPage}
                  className="bg-green-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transform hover:scale-105 transition-transform duration-300"
                >
                  Back to Levels
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-white text-lg mb-4">Time: {timer} seconds</p>
              <h2 className="text-xl sm:text-2xl font-semibold mt-2 text-white">
                {currentQuestion.question}
              </h2>
              {currentQuestion.image && (
                <div className="flex justify-center my-4">
                  <Image
                    src={currentQuestion.image}
                    alt="Question Image"
                    width={200}
                    height={200}
                    className="rounded-lg"
                  />
                </div>
              )}
              <div className="flex flex-col items-center justify-center mt-4 space-y-3 sm:space-y-0 sm:space-x-4">
                <VoiceButton questionText={currentQuestion.question} />
                {currentQuestion.type === "mcq" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xs">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(option)}
                        className={`py-3 px-6 rounded-full shadow-lg transition-colors duration-300
                          ${userAnswer === option ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Your answer"
                    className="border-2 border-yellow-300 bg-transparent text-white rounded-full p-3 w-full max-w-xs text-center text-lg sm:text-xl focus:outline-none focus:ring-2 focus:ring-yellow-200"
                  />
                )}
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
        <Modal
          setIsModalOpen={setIsModalOpen}
          isRegister={isRegister}
          setIsRegister={setIsRegister}
        />
      )}
    </div>
  );
}
