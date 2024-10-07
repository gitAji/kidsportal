"use client"; // Ensure this component is treated as a client component

import React, { useEffect } from "react"; // Import React and useEffect
import useSound from "use-sound"; // Import use-sound for audio playback
import "animate.css"; // Importing animate.css for animations

// Import sound files
import correctSound from "../../../../public/sounds/correct.mp3"; // Adjust the path as necessary
import incorrectSound from "../../../../public/sounds/incorrect.mp3"; // Adjust the path as necessary

const FeedbackMessage = ({ message, isCorrect }) => {
  // Initialize sound effects
  const [playCorrect] = useSound(correctSound, { volume: 1 }); // 1 is max volume
  const [playIncorrect] = useSound(incorrectSound, { volume: 1 }); // 1 is max volume

  // Play sound based on the feedback
  useEffect(() => {
    if (isCorrect) {
      console.log("Correct answer sound playing...");
      playCorrect(); // Play sound for correct answer
    } else if (isCorrect === false) {
      console.log("Incorrect answer sound playing...");
      playIncorrect(); // Play sound for incorrect answer
    }
  }, [isCorrect, playCorrect, playIncorrect]);

  // Animation class based on feedback
  const animationClass = isCorrect
    ? "animate__animated animate__bounce"
    : "animate__animated animate__shakeX";

  return (
    <div
      className={`${animationClass} mt-2 p-2 rounded text-center ${
        isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
      }`}
    >
      {message}
      {isCorrect ? " Awesome 🎉" : " Try Again 😞"}
    </div>
  );
};

export default FeedbackMessage;
