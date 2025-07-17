"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../../../../../../components/layout/header/Header";
import Footer from "../../../../../../components/layout/footer/Footer";
import BackToTop from "../../../../../../components/ui/BackToTop";
import Modal from "../../../../../../components/ui/Modal";
import VoiceButton from "../../../../../../components/ui/VoiceButton";
import FeedbackMessage from "../../../../../../components/ui/FeedbackMessage";
import ProgressBar from "../../../../../../components/ui/ProgressBar";
import "animate.css";

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

export default function Level1Content() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);

  const router = useRouter();
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const completedSoundRef = useRef(null);

  useEffect(() => {
    correctSoundRef.current = new Audio("/sounds/correct.mp3");
    incorrectSoundRef.current = new Audio("/sounds/incorrect.mp3");
    completedSoundRef.current = new Audio("/sounds/completed.mp3");
  }, []);

  const handleAnswer = (option) => {
    if (isAnswered) return;

    const isAnswerCorrect = option === questions[currentQuestionIndex].answer;
    setSelectedAnswer(option);
    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);

    if (isAnswerCorrect) {
      correctSoundRef.current.play();
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
    } else {
      incorrectSoundRef.current.play();
    }

    setTimeout(() => {
      if (isAnswerCorrect) {
        if (currentQuestionIndex + 1 < questions.length) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setIsAnswered(false);
        } else {
          setCompleted(true);
          completedSoundRef.current.play();
          setShowModal(true);
        }
      } else {
        setIsAnswered(false);
        setSelectedAnswer(null);
      }
    }, 2000);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    console.log(container);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#000000", // Black background for stars
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
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#ffffff", // White stars
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
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
              type: "star", // Stars
            },
            size: {
              value: { min: 1, max: 5 },
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
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 animate__animated animate__fadeInDown">
            Ariviyal - Level 1
          </h1>
          <p className="text-lg text-gray-600 mt-2 animate__animated animate__fadeInUp">
            Let&apos;s learn about fruits and vegetables!
          </p>
        </div>

        <ProgressBar progress={progress} />

        {!completed && (
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto animate__animated animate__zoomIn">
            <div className="flex items-center justify-center mb-6">
              <Image
                src={currentQuestion.image}
                alt={currentQuestion.question}
                width={currentQuestion.width}
                height={currentQuestion.height}
                className="rounded-lg"
              />
              <VoiceButton text={currentQuestion.question} />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-6">
              {currentQuestion.question}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`p-4 rounded-lg text-white font-bold text-lg transition-transform transform hover:scale-105 ${
                    optionColors[option] || "bg-gray-400"
                  } ${
                    selectedAnswer === option
                      ? isCorrect
                        ? "bg-green-500 animate__animated animate__bounceIn"
                        : "bg-red-500 animate__animated animate__shakeX"
                      : ""
                  }`}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              ))}
            </div>
            {selectedAnswer && (
              <FeedbackMessage
                isCorrect={isCorrect}
                correctMessage="Correct! Well done!"
                incorrectMessage="Not quite, try again!"
              />
            )}
          </div>
        )}

        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Congratulations!"
            message="You have successfully completed Level 1!"
            buttonText="Next Level"
            onButtonClick={() => router.push("/grades/1/ariviyal/levels/2")}
          >
            {/* Placeholder for Lottie animation */}
            {completed && (
              <div className="w-full h-48 flex items-center justify-center">
                <Lottie
                  animationData={{
                    /* Your Lottie animation JSON data here */
                    v: "5.7.4",
                    fr: 60,
                    ip: 0,
                    op: 180,
                    w: 500,
                    h: 500,
                    nm: "Confetti",
                    ddd: 0,
                    assets: [],
                    layers: [
                      {
                        ind: 1,
                        ty: 4,
                        nm: "Confetti",
                        sr: 1,
                        ks: {
                          o: { a: 0, k: [{ i: { x: 0.67, y: 0.67 }, o: { x: 0.33, y: 0.33 }, t: 0, s: [100] }, { t: 10, s: [0] }] },
                          r: { a: 0, k: [{ i: { x: 0.67, y: 0.67 }, o: { x: 0.33, y: 0.33 }, t: 0, s: [0] }, { t: 10, s: [360] }] },
                          p: { a: 1, k: [{ i: { x: 0.67, y: 0.67 }, o: { x: 0.33, y: 0.33 }, t: 0, s: [250, 250, 0] }, { t: 10, s: [250, 0, 0] }] },
                          a: { a: 0, k: [0, 0, 0] },
                          s: { a: 0, k: [100, 100, 100] },
                        },
                        ao: 0,
                        shapes: [
                          {
                            ty: "gr",
                            it: [
                              {
                                ind: 0,
                                ty: "sh",
                                ix: 1,
                                ks: {
                                  c: { a: 0, k: [0.96, 0.78, 0.0, 1] },
                                  o: { a: 0, k: [100] },
                                  s: { a: 0, k: [100, 100] },
                                  p: { a: 0, k: [0, 0] },
                                  a: { a: 0, k: [0, 0] },
                                  r: { a: 0, k: [0] },
                                  sk: { a: 0, k: [0] },
                                  sa: { a: 0, k: [0] },
                                },
                                mn: "Shape 1",
                                nm: "Shape 1",
                                hd: false,
                              },
                            ],
                            nm: "Group 1",
                            np: 3,
                            cix: 2,
                            hd: false,
                          },
                        ],
                        bm: 0,
                        sc: "#ffffff",
                        sh: 0,
                        cl: "",
                        ln: "",
                        ip: 0,
                        op: 180,
                        st: 0,
                        bm: 0,
                      },
                    ],
                  }}
                  loop={false}
                  autoplay={true}
                  style={{ width: 200, height: 200 }}
                />
              </div>
            )}
          </Modal>
        )}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
