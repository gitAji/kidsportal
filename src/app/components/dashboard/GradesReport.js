import React from 'react';

const GradesReport = () => {
  const grades = [
    { subject: 'Math', level: 'Level 1', score: '90%', feedback: 'Excellent work on addition!' },
    { subject: 'English', level: 'Level 1', score: '75%', feedback: 'Good effort, focus on phonics.' },
    { subject: 'Science', level: 'Level 1', score: '85%', feedback: 'Strong understanding of animal habitats.' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Subject-wise Grades</h3>
      {grades.length === 0 ? (
        <p className="text-gray-700">No grades available yet.</p>
      ) : (
        <ul>
          {grades.map((grade, index) => (
            <li key={index} className="mb-4 pb-4 border-b last:border-b-0">
              <p className="text-lg font-medium">{grade.subject} - {grade.level}: <span className="font-bold">{grade.score}</span></p>
              <p className="text-gray-600 text-sm">Feedback: {grade.feedback}</p>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-xl font-semibold mt-6 mb-4">Strengths and Weaknesses Summary</h3>
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="text-gray-700 mb-2"><strong>Strengths:</strong> Strong in foundational math and science concepts.</p>
        <p className="text-gray-700"><strong>Weaknesses:</strong> Needs more practice with English phonics and reading comprehension.</p>
      </div>
    </div>
  );
};

export default GradesReport;
