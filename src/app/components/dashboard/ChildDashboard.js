import React, { useState } from 'react';
import AssignTaskForm from './AssignTaskForm';
import AssignedTasks from './AssignedTasks';
import ProgressTracker from './ProgressTracker';
import GradesReport from './GradesReport';
import RewardsDisplay from './RewardsDisplay';

const ChildDashboard = ({ child, onClose }) => {
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);

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

  const handleAssignTaskClick = () => {
    setShowAssignTaskModal(true);
  };

  const handleCloseAssignTaskModal = () => {
    setShowAssignTaskModal(false);
  };

  const assignedTasks = child.assignedTasks || [];
  const overallProgress = child.progress ? child.progress.overall : 0;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-4">{child.name}&apos;s Progress Report</h2>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Overview</h3>
          <p className="text-gray-700">Age: {child.age}</p>
          <p className="text-gray-700">Grade: {child.grade}</p>
          <div className="mt-4">
            <p className="text-gray-700">Total Assigned Tasks: {assignedTasks.length}</p>
            <p className="text-gray-700">Tasks Completed: {assignedTasks.filter(task => task.status === 'completed').length}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-700 text-sm mt-1">Overall Progress: {overallProgress}%</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Assigned Tasks Details</h3>
          <button
            onClick={handleAssignTaskClick}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Assign New Task
          </button>
          {assignedTasks.length === 0 ? (
            <p className="text-gray-700">No assigned tasks.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Subject</th>
                    <th className="py-2 px-4 border-b">Level</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Assigned Date</th>
                    <th className="py-2 px-4 border-b">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="py-2 px-4 border-b">{task.subjectId}</td>
                      <td className="py-2 px-4 border-b">{task.levelId}</td>
                      <td className={`py-2 px-4 border-b ${getStatusColor(task.status)}`}>
                        {task.status}
                      </td>
                      <td className="py-2 px-4 border-b">{new Date(task.assignedDate.seconds * 1000).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">{new Date(task.dueDate.seconds * 1000).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Progress Tracker</h2>
          <ProgressTracker progress={child.progress} />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Grades</h2>
          <GradesReport progress={child.progress} />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Rewards</h2>
          <RewardsDisplay rewards={child.rewards} />
        </section>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Close
        </button>

        {showAssignTaskModal && (
          <AssignTaskForm
            onClose={handleCloseAssignTaskModal}
            childId={child.id}
            childName={child.name}
          />
        )}
      </div>
    </div>
  );
};

export default ChildDashboard;
