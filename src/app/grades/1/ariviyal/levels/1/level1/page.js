"use client"; // Ensure this component is treated as a client component

import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "../../../../../../components/layout/header/Header";
import Footer from "../../../../../../components/layout/footer/Footer";
import BackToTop from "../../../../../../components/ui/BackToTop";
import Modal from "../../../../../../components/ui/Modal";
import VoiceButton from "../../../../../../components/ui/VoiceButton";
import FeedbackMessage from "../../../../components/ui/FeedbackMessage";
import ProgressBar from "../../../../../../components/ui/ProgressBar";
import useSound from "use-sound";
import correctSound from "/sounds/correct.mp3";
import incorrectSound from "/sounds/incorrect.mp3";
import "animate.css";

// Sample questions for Ariviyal Level 1
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

import dynamic from "next/dynamic";

const Level1Content = dynamic(() => import("./Level1Content"), { ssr: false });

export default function Level1() {
  return <Level1Content />;
}
