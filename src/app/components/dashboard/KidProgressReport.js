import React from 'react';

const KidProgressReport = ({ kid, onClose }) => {
  if (!kid) {
    return null;
  }

  // Placeholder data for tasks - in a real app, this would come from Firebase
  const assignedTasks = [
    { id: 1, name: 'Math - Addition Level 1', status: 'completed', deadline: '2025-07-15' },
    { id: 2, name: 'English - Alphabets', status: 'in-progress', deadline: '2025-07-20' },
    { id: 3, name: 'Science - Animals', status: 'assigned', deadline: '2025-07-25' },
    { id: 4, name: 'History - Ancient Civilizations', status: 'assigned', deadline: '2025-07-30' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-yellow-600';
      case 'assigned':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-4">{kid.name}'s Progress Report</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Overview</h3>
          <p className="text-gray-700">Age: {kid.age}</p>
          <p className="text-gray-700">Grade: {kid.grade}</p>
          <div className="mt-4">
            <p className="text-gray-700">Total Assigned Tasks: {assignedTasks.length}</p>
            <p className="text-gray-700">Tasks Completed: {assignedTasks.filter(task => task.status === 'completed').length}</p>
            <p className="text-gray-700">Tasks In Progress: {assignedTasks.filter(task => task.status === 'in-progress').length}</p>
            <p className="text-gray-700">Tasks Assigned: {assignedTasks.filter(task => task.status === 'assigned').length}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${kid.progress || 0}%` }}
              ></div>
            </div>
            <p className="text-gray-700 text-sm mt-1">Overall Progress: {kid.progress || 0}%</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Assigned Tasks Details</h3>
          {assignedTasks.length === 0 ? (
            <p className="text-gray-700">No assigned tasks.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Task Name</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="py-2 px-4 border-b">{task.name}</td>
                      <td className={`py-2 px-4 border-b ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </td>
                      <td className="py-2 px-4 border-b">{task.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default KidProgressReport;
