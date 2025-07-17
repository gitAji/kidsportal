"use client";
import { useState, useEffect, useRef } from "react";
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
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
          />
        )}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
