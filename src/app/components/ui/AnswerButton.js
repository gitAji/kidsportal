// components/ui/AnswerButton.js
import React from "react";

const AnswerButton = ({ option, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-lg text-white ${
        isSelected ? "bg-red-400" : "bg-orange-300 hover:bg-orange-600"
      }`}
    >
      {option}
    </button>
  );
};

export default AnswerButton;
