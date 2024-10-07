// components/ui/SubmitAnswerButton.js
import React from "react";

const SubmitButton = ({ onSubmit, disabled }) => {
  return (
    <button
      onClick={onSubmit}
      className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
      disabled={disabled} // Disable button if input is empty or not allowed
    >
      Submit
    </button>
  );
};

export default SubmitButton;
