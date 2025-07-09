import React from 'react';

const AssignedTasks = ({ tasks }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      case 'not-started':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="mb-2">
              <p className="text-lg font-medium">{task.subjectName} - {task.lessonName}</p>
              <p className="text-gray-600 text-sm">Due Date: {new Date(task.dueDate.seconds * 1000).toLocaleDateString()}</p>
              <p className={`${getStatusColor(task.status)} text-sm capitalize`}>
                Status: {task.status}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No assigned tasks.</p>
      )}
    </div>
  );
};

export default AssignedTasks;
