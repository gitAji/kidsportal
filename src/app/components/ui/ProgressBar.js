// components/ui/ProgressBar.js

import React from "react";

const ProgressBar = ({ progress }) => {
  return (
    <div className="relative w-full h-4 bg-gray-200 rounded-full mt-4">
      <div
        style={{ width: `${progress}%` }}
        className={`absolute h-full bg-green-500 rounded-full`}
      />
    </div>
  );
};

export default ProgressBar;
