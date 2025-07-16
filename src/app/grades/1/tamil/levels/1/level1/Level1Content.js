"use client"; // Ensure this component is treated as a client component

import React, { useState, useEffect } from "react";
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
import { auth, db } from "../../../../../../firebase/config";

const useSound = dynamic(() => import('use-sound'), { ssr: false });
import correctSound from "../../../../../../../public/sounds/correct.mp3";
import incorrectSound from "../../../../../../../public/sounds/incorrect.mp3";
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
}