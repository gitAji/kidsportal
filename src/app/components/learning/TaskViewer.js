'use client';

import React from 'react';

const TaskViewer = ({ taskData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-3xl font-bold text-[var(--deep-ocean)] mb-4">{taskData.title}</h2>
      <p className="text-gray-700 leading-relaxed mb-4">{taskData.description}</p>
      {taskData.instructions && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Instructions:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {taskData.instructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
      )}
      {taskData.dueDate && (
        <p className="text-gray-600">Due Date: <span className="font-semibold">{taskData.dueDate}</span></p>
      )}
      {/* Placeholder for task submission or completion UI */}
      <div className="mt-6 text-right">
        <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          Mark as Complete
        </button>
      </div>
    </div>
  );
};

export default TaskViewer;
