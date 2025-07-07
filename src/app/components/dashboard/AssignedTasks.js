import React from 'react';

const AssignedTasks = () => {
  const tasks = [
    {
      id: 1,
      name: 'Math - Addition Level 1',
      deadline: '2025-07-15',
      status: 'pending',
    },
    {
      id: 2,
      name: 'English - Alphabets',
      deadline: '2025-07-10',
      status: 'complete',
    },
    {
      id: 3,
      name: 'Science - Animals',
      deadline: '2025-07-20',
      status: 'not-started',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'complete':
        return 'text-green-600';
      case 'not-started':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {tasks.length === 0 ? (
        <p className="text-gray-700">No assigned tasks.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-2">
              <p className="text-lg font-medium">{task.name}</p>
              <p className="text-gray-600 text-sm">Deadline: {task.deadline}</p>
              <p className={`${getStatusColor(task.status)} text-sm capitalize`}>
                Status: {task.status.replace('-', ' ')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignedTasks;
