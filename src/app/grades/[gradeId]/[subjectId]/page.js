"use client";

import React from "react";
import { useParams } from "next/navigation";
import LevelCard from "../../../components/ui/LevelCard"; // Adjust the import path as necessary
import LevelPath from "../../../components/ui/LevelPath"; // Adjust the import path as necessary
import Timeline from "@/components/ui/Timeline";

const LevelsPage = () => {
  const { gradeId, subjectId } = useParams();
  const [unlockedLevels, setUnlockedLevels] = React.useState([1]); // Initially, only level 1 is unlocked
  const levels = Array.from({ length: 12 }, (_, i) => i + 1);
  const [cardRefs] = React.useState(levels.map(() => React.createRef()));
  const [progress, setProgress] = React.useState(0); // Add progress state

  // Simulate progress for demonstration
  React.useEffect(() => {
    const completedLevels = unlockedLevels.length;
    setProgress((completedLevels / levels.length) * 100);
  }, [unlockedLevels, levels.length]);

  // In a real app, you would fetch the unlocked levels for the user from a database.
  // For now, we'll just use local state.

  return (
    <div
      className="min-h-screen bg-cover bg-center p-8"
      style={{ backgroundImage: "url('/images/intro11.png')" }}
    >
      <Timeline />
      <div className="relative max-w-7xl mx-auto bg-white bg-opacity-80 rounded-xl shadow-lg p-8">
        <LevelPath cardRefs={cardRefs} />
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          {subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} - Grade{" "}
          {gradeId}
        </h1>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}></div>
        </div>
        <p className="text-right text-gray-700 text-sm mb-6">
          {progress.toFixed(0)}% Completed
        </p>
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
