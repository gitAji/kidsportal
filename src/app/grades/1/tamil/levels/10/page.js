import React from 'react';
import Link from 'next/link';

const LevelPage = () => {
  const tasks = [1, 2, 3, 4];
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Grade 1 Tamil - Level 10</h1>
      <div className="grid grid-cols-2 gap-4">
        {tasks.map(task => (
          <Link legacyBehavior key={task} href={`/grades/1/tamil/levels/10/task${task}`}>
            <a className="bg-blue-500 text-white p-8 rounded-lg text-center text-2xl">
              Task {task}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LevelPage;
