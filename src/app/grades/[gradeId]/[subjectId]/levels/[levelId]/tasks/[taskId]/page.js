'use client';

import { useParams } from 'next/navigation';
import ProgressBar from '@/app/components/ui/ProgressBar';


import Breadcrumb from '@/app/components/ui/BreadCrumb';

const TaskPage = () => {
  const { gradeId, subjectId, levelId, taskId } = useParams();

  // For demonstration, a static progress. In a real app, this would be dynamic.
  const taskProgress = 75; 

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center">
        <Breadcrumb />
        <h1 className="text-5xl font-extrabold mb-6 text-[var(--heading-color)] drop-shadow-lg">
          Task: {taskId.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
        </h1>
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">Task Progress</h2>
          <ProgressBar percentage={taskProgress} />
          <p className="text-right text-white mt-2">{taskProgress.toFixed(0)}% Completed</p>
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-white text-xl leading-relaxed">
          <p>Welcome to the <strong>{taskId.replace(/-/g, ' ')}</strong> task!</p>
          <p className="mt-4">This is where the interactive content for this task will be displayed. Get ready to learn and have fun!</p>
          <p className="mt-4">You are currently in Grade {gradeId}, Subject {subjectId}, Level {levelId}.</p>
        </div>
      </div>
    </div>
  );
};

export default TaskPage;
