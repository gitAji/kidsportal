import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import AssignTaskForm from './AssignTaskForm';

const KidProgressReport = ({ kid, onClose }) => {
  const [showAssignTaskModal, setShowAssignTaskModal] = useState(false);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  if (!kid) {
    return null;
  }

  useEffect(() => {
    if (!kid || !kid.id) return;

    setLoadingTasks(true);
    setTasksError(null);

    // Fetch tasks from all subjects for this kid
    // This requires a collection group query if tasks are in subcollections of subjects
    // For simplicity, let's assume a top-level 'tasks' collection for now, or iterate through subjects
    // Given the data model: users/{kidId}/progressTracking/{subjectId}/tasks
    // We need to fetch all subjects first, then iterate to get tasks, or use a collection group query if available and indexed.
    // For now, let's simplify and assume a direct path for tasks under kid's progressTracking

    // A more robust solution would involve fetching all subjects first, then their tasks
    // For demonstration, let's assume a simplified structure or fetch all tasks under kid's progressTracking

    // To fetch tasks from users/{kidId}/progressTracking/{subjectId}/tasks, we need to know the subjectIds.
    // For now, let's fetch all tasks directly under a kid's progressTracking if that's feasible, or iterate.
    // Given the current data model, a direct query for all tasks under a kid across subjects is complex without collection group queries.
    // Let's adjust the data model slightly for easier fetching of all assigned tasks for a kid.
    // New proposed task path: users/{kidId}/assignedTasks/{taskId}

    const tasksCollectionRef = collection(db, 'users', kid.id, 'assignedTasks');
    const q = query(tasksCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssignedTasks(tasksData);
      setLoadingTasks(false);
    }, (err) => {
      console.error("Error fetching assigned tasks:", err);
      setTasksError("Failed to load assigned tasks.");
      setLoadingTasks(false);
    });

    return () => unsubscribe();
  }, [kid.id]);

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

  const handleAssignTaskClick = () => {
    setShowAssignTaskModal(true);
  };

  const handleCloseAssignTaskModal = () => {
    setShowAssignTaskModal(false);
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
            {loadingTasks ? (
              <p>Loading tasks overview...</p>
            ) : (
              <>
                <p className="text-gray-700">Total Assigned Tasks: {assignedTasks.length}</p>
                <p className="text-gray-700">Tasks Completed: {assignedTasks.filter(task => task.status === 'completed').length}</p>
                <p className="text-gray-700">Tasks In Progress: {assignedTasks.filter(task => task.status === 'in-progress').length}</p>
                <p className="text-gray-700">Tasks Assigned: {assignedTasks.filter(task => task.status === 'assigned').length}</p>
              </>
            )}
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
          <button
            onClick={handleAssignTaskClick}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Assign New Task
          </button>
          {loadingTasks ? (
            <p>Loading assigned tasks...</p>
          ) : tasksError ? (
            <p className="text-red-500">Error: {tasksError}</p>
          ) : assignedTasks.length === 0 ? (
            <p className="text-gray-700">No assigned tasks.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Task Name</th>
                    <th className="py-2 px-4 border-b">Subject</th>
                    <th className="py-2 px-4 border-b">Level</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Assigned Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="py-2 px-4 border-b">{task.lessonName}</td>
                      <td className="py-2 px-4 border-b">{task.subjectName}</td>
                      <td className="py-2 px-4 border-b">{task.levelName}</td>
                      <td className={`py-2 px-4 border-b ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ')}
                      </td>
                      <td className="py-2 px-4 border-b">{task.assignedDate?.toDate().toLocaleDateString()}</td>
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

        {showAssignTaskModal && (
          <AssignTaskForm
            onClose={handleCloseAssignTaskModal}
            kidId={kid.id}
            kidName={kid.name}
          />
        )}
      </div>
    </div>
  );
};

export default KidProgressReport;
