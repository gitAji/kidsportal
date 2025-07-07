import React from 'react';

const ProgressTracker = () => {
  const subjects = [
    { name: 'Math', progress: 80, status: 'completed' },
    { name: 'English', progress: 50, status: 'in-progress' },
    { name: 'Science', progress: 20, status: 'not-started' },
  ];

  const getProgressBarColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'not-started':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {subjects.map((subject) => (
        <div key={subject.name} className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-lg font-medium text-gray-700">{subject.name}</span>
            <span className="text-sm text-gray-600">{subject.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`${getProgressBarColor(subject.status)} h-2.5 rounded-full`}
              style={{ width: `${subject.progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1 capitalize">Status: {subject.status.replace('-', ' ')}</p>
        </div>
      ))}
    </div>
  );
};

export default ProgressTracker;
