'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LevelCard from '@/app/components/ui/LevelCard';

const LevelsPage = () => {
  const { gradeId, subjectId } = useParams();
  const [unlockedLevels, setUnlockedLevels] = useState([1]); // Initially, only level 1 is unlocked

  // In a real app, you would fetch the unlocked levels for the user from a database.
  // For now, we'll just use local state.

  const levels = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">{subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} - Grade {gradeId}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {levels.map(level => (
            <LevelCard 
              key={level} 
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
