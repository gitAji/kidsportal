"use client";

import React from "react";
import { useParams } from "next/navigation";
import LevelCard from "../../../components/ui/LevelCard"; // Adjust the import path as necessary
import LevelPath from "../../../components/ui/LevelPath"; // Adjust the import path as necessary

const LevelsPage = () => {
  const { gradeId, subjectId } = useParams();
  const [unlockedLevels, setUnlockedLevels] = React.useState([1]); // Initially, only level 1 is unlocked
  const levels = Array.from({ length: 12 }, (_, i) => i + 1);
  const [cardRefs] = React.useState(levels.map(() => React.createRef()));

  // In a real app, you would fetch the unlocked levels for the user from a database.
  // For now, we'll just use local state.

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: "url('/images/intro11.png')" }}
    >
      <div className="relative max-w-7xl mx-auto bg-white bg-opacity-80 rounded-xl shadow-lg p-8">
        <LevelPath cardRefs={cardRefs} />
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          {subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} - Grade{" "}
          {gradeId}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {levels.map((level, i) => (
            <LevelCard
              key={level}
              ref={cardRefs[i]}
              grade={gradeId}
              subject={subjectId}
              level={level}
              isUnlocked={unlockedLevels.includes(level)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelsPage;
