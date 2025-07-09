import React from 'react';

const GradesReport = ({ progress }) => {
  const subjects = progress ? Object.keys(progress.subjects) : [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Subject-wise Grades</h3>
      {subjects.length > 0 ? (
        <ul>
          {subjects.map((subject) => {
            const subjectProgress = progress.subjects[subject];
            return (
              <li key={subject} className="mb-4 pb-4 border-b last:border-b-0">
                <p className="text-lg font-medium capitalize">{subject} - Level {subjectProgress.level}: <span className="font-bold">{subjectProgress.score}%</span></p>
                <p className="text-gray-600 text-sm">Grade: {subjectProgress.grade}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-700">No grades available yet.</p>
      )}
    </div>
  );
};

export default GradesReport;
