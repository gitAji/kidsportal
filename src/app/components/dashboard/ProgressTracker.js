import React from 'react';

const ProgressTracker = ({ progress }) => {
  const subjects = progress ? Object.keys(progress.subjects) : [];

  const getProgressBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {subjects.length > 0 ? (
        subjects.map((subject) => {
          const subjectProgress = progress.subjects[subject];
          return (
            <div key={subject} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-lg font-medium text-gray-700 capitalize">{subject}</span>
                <span className="text-sm text-gray-600">Score: {subjectProgress.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${getProgressBarColor(subjectProgress.score)} h-2.5 rounded-full`}
                  style={{ width: `${subjectProgress.score}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Grade: {subjectProgress.grade}, Level: {subjectProgress.level}</p>
            </div>
          );
        })
      ) : (
        <p className="text-gray-700">No progress to display.</p>
      )}
    </div>
  );
};

export default ProgressTracker;
