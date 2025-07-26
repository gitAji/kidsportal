"use client";
import React from 'react';
import { FaBook, FaPencilAlt, FaGraduationCap, FaCheckCircle, FaPlayCircle } from 'react-icons/fa';

const getTaskIcon = (type) => {
  switch (type) {
    case 'lesson': return <FaBook />;
    case 'quiz': return <FaPencilAlt />;
    case 'exam': return <FaGraduationCap />;
    default: return null;
  }
};

const LevelPath = ({ tasks, activeTaskId, completedTaskIds, onTaskSelect }) => {
  return (
    <div className="relative p-4">
      {/* The visual path line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-300 transform -translate-y-1/2"></div>
      
      <div className="relative flex justify-between items-center">
        {tasks.map((task, index) => {
          const isCompleted = completedTaskIds.includes(task.taskId);
          const isActive = activeTaskId === task.taskId;
          
          // Determine if the task is the next one to be done
          const lastCompletedIndex = tasks.findIndex(t => t.taskId === completedTaskIds[completedTaskIds.length - 1]);
          const isNextUp = (completedTaskIds.length === 0 && index === 0) || (lastCompletedIndex === index - 1);

          return (
            <div key={task.taskId} className="flex flex-col items-center z-10">
              <button
                onClick={() => onTaskSelect(task)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl text-white transition-all duration-300 transform hover:scale-110
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-400'}
                  ${isActive ? 'ring-4 ring-blue-400' : ''}
                  ${isNextUp && !isCompleted ? 'animate-pulse bg-blue-500' : ''}
                `}
                title={task.taskName}
              >
                {isCompleted ? <FaCheckCircle /> : getTaskIcon(task.type)}
              </button>
              <p className="mt-2 text-sm font-semibold text-gray-700 text-center w-24 truncate">
                {task.taskName}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelPath;
