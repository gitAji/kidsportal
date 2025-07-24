'use client';
import React from 'react';
import { FaBookOpen, FaLock, FaCheckCircle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const SubjectCard = ({ subject, onLevelClick }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
    <h3 className="text-3xl font-bold text-gray-800 mb-4">{subject.subjectName}</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {subject.levels.map(level => (
        <LevelCard key={level.levelId} level={level} onClick={() => onLevelClick(level)} />
      ))}
    </div>
  </div>
);

const LevelCard = ({ level, onClick }) => {
  const isCompleted = level.tasks.every(task => task.status === 'completed');

  return (
    <button
      onClick={onClick}
      disabled={level.isLocked}
      className={`relative p-6 text-left w-full rounded-xl shadow-md transition-all duration-300 transform ${
        level.isLocked 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
          : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
      }`}
    >
      {level.isLocked && (
        <div className="absolute top-2 right-2 text-xl">
          <FaLock />
        </div>
      )}
      {isCompleted && (
        <div className="absolute top-2 right-2 text-2xl text-green-300">
          <FaCheckCircle />
        </div>
      )}
      <h4 className="text-xl font-bold">{level.levelName}</h4>
      {level.isLocked && <p className="text-sm mt-1">{level.lockMessage}</p>}
    </button>
  );
};

const LearningZone = ({ child, subjects }) => {
  const router = useRouter();

  const handleLevelClick = (level) => {
    if (!level.isLocked) {
      // For now, we can just log it. Later this will navigate to a task page.
      console.log("Navigating to level:", level.levelId);
      // router.push(`/learning-zone/${level.levelId}`);
    }
  };

  return (
    <div>
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-gray-800">Hello, {child.name}!</h1>
        <p className="text-xl text-gray-600 mt-2">Ready for a new adventure in learning?</p>
      </header>

      {!subjects || subjects.length === 0 ? (
        <div className="text-center bg-white p-10 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-700">No adventures here yet!</h2>
          <p className="text-lg text-gray-500 mt-2">It looks like there are no subjects or levels ready for your grade. Please ask your parent to check back later!</p>
        </div>
      ) : (
        subjects.map(subject => (
          <SubjectCard key={subject.subjectId} subject={subject} onLevelClick={handleLevelClick} />
        ))
      )}
    </div>
  );
};

export default LearningZone;
