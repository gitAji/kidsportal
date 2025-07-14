import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import SkeletonLoader from '../ui/SkeletonLoader';
import AddChildForm from './AddChildForm'; // Reusing the AddChildForm
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaUser, FaChartLine, FaTasks, FaHourglassHalf, FaCog, FaUpload } from 'react-icons/fa';

const ChildDashboard = ({ child, onEdit, onDelete, onClose }) => {
  const [currentView, setCurrentView] = useState('details'); // 'details', 'edit', 'deleteConfirm'
  const [activeTab, setActiveTab] = useState('about'); // New state for active tab
  const [childData, setChildData] = useState(child);
  const [loading, setLoading] = useState(false); // Already have child data from prop
  const router = useRouter();

  useEffect(() => {
    setChildData(child);
    setCurrentView('details'); // Reset view when child changes
    setActiveTab('about'); // Reset active tab when child changes
  }, [child]);

  const handleEditClick = () => {
    setCurrentView('edit');
  };

  const handleDeleteClick = () => {
    setCurrentView('deleteConfirm');
  };

  const handleCancel = () => {
    setCurrentView('details');
  };

  const handleSaveSuccess = () => {
    setCurrentView('details');
    // ParentDashboard will re-fetch children list, so no need to refresh here
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await onDelete(childData.id); // Call parent's onDelete function
      setLoading(false);
      onClose(); // Close the main modal after deletion
    } catch (error) {
      console.error("Error deleting child:", error);
      setLoading(false);
      alert("Failed to delete child. Please try again.");
    }
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  if (!childData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold text-[var(--deep-ocean)] mb-4">No Child Data Available</h2>
        <p className="text-[var(--foreground)]">Please select a child or ensure child data is loaded.</p>
      </div>
    );
  }

  const assignedTasksCount = childData.assignedTasks ? childData.assignedTasks.length : 0;
  const completedTasksCount = childData.assignedTasks ? childData.assignedTasks.filter(task => task.status === 'completed').length : 0;
  const overallProgress = childData.progress ? childData.progress.overall : 0;

  // Calculate profile completion (placeholder logic)
  const profileFields = [
    childData.name,
    childData.age,
    childData.grade,
    childData.gender,
    childData.username,
    // Add more fields as they become relevant for completion
  ];
  const filledFields = profileFields.filter(field => field !== null && field !== undefined && field !== '').length;
  const profileCompletionPercentage = Math.round((filledFields / profileFields.length) * 100);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className={`flex transition-transform duration-500 ease-in-out h-full
          ${
            currentView === 'details' ? 'translate-x-0' :
            currentView === 'edit' ? '-translate-x-full' :
            currentView === 'deleteConfirm' ? '-translate-x-full' : ''
          }`}
      >
        {/* Details View */}
        <div className="w-full flex-shrink-0 p-4 md:p-6">
          <h2 className="text-3xl font-bold text-[var(--deep-ocean)] mb-6 text-center">{childData.name}'s Dashboard</h2>
          
          {/* Tab Navigation */}
          <div className="mb-6">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" role="tablist">
              <li className="me-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg flex items-center transition-colors duration-200 ${
                    activeTab === 'about' ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--foreground)] hover:text-[var(--foreground)] hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('about')}
                  type="button"
                  role="tab"
                  aria-controls="about"
                  aria-selected={activeTab === 'about'}
                >
                  <FaUser className="mr-2" /> About
                </button>
              </li>
              <li className="me-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg flex items-center transition-colors duration-200 ${
                    activeTab === 'insights' ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--foreground)] hover:text-[var(--foreground)] hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('insights')}
                  type="button"
                  role="tab"
                  aria-controls="insights"
                  aria-selected={activeTab === 'insights'}
                >
                  <FaChartLine className="mr-2" /> Insights
                </button>
              </li>
              <li className="me-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg flex items-center transition-colors duration-200 ${
                    activeTab === 'tasks' ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--foreground)] hover:text-[var(--foreground)] hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('tasks')}
                  type="button"
                  role="tab"
                  aria-controls="tasks"
                  aria-selected={activeTab === 'tasks'}
                >
                  <FaTasks className="mr-2" /> Tasks
                </button>
              </li>
              <li className="me-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg flex items-center transition-colors duration-200 ${
                    activeTab === 'progress' ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--foreground)] hover:text-[var(--foreground)] hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('progress')}
                  type="button"
                  role="tab"
                  aria-controls="progress"
                  aria-selected={activeTab === 'progress'}
                >
                  <FaHourglassHalf className="mr-2" /> Progress
                </button>
              </li>
              <li className="me-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg flex items-center transition-colors duration-200 ${
                    activeTab === 'settings' ? 'border-blue-600 text-blue-600' : 'border-transparent text-[var(--foreground)] hover:text-[var(--foreground)] hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('settings')}
                  type="button"
                  role="tab"
                  aria-controls="settings"
                  aria-selected={activeTab === 'settings'}
                >
                  <FaCog className="mr-2" /> Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div id="child-dashboard-tab-content">
            {activeTab === 'about' && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-2xl font-semibold text-[var(--deep-ocean)] mb-4">About {childData.name}</h3>
                <div className="flex items-center mb-4">
                  {/* Child Image/Initial */}
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white text-5xl font-bold mr-4">
                    {childData.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[var(--foreground)] text-xl font-bold">{childData.name}</p>
                    <p className="text-[var(--foreground)]">Age: {childData.age} | Grade: {childData.grade} | Gender: {childData.gender}</p>
                    <p className="text-[var(--foreground)]">Profile Completion: <span className="font-bold">{profileCompletionPercentage}%</span></p>
                    <p className="text-[var(--foreground)]">Last Activity: (Placeholder)</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
                    <FaUpload className="mr-2" /> Upload Image
                  </button>
                </div>
                <p className="text-[var(--foreground)] mt-4"><strong>Notes:</strong> {childData.notes || 'No notes available.'}</p>
                <div className="flex justify-around mt-6">
                  <button
                    onClick={handleEditClick}
                    className="px-6 py-3 bg-sunny-yellow text-[var(--deep-ocean)] font-semibold rounded-lg hover:bg-sunny-yellow/80 transition-colors duration-300 flex items-center"
                  >
                    <FaEdit className="mr-2" /> Edit Child
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="px-6 py-3 bg-sweet-pink text-white font-semibold rounded-lg hover:bg-sweet-pink/80 transition-colors duration-300 flex items-center"
                  >
                    <FaTrash className="mr-2" /> Delete Child
                  </button>
                  <button
                    onClick={() => {
                      sessionStorage.setItem('childUser', JSON.stringify(childData));
                      router.push('/child-dashboard');
                    }}
                    className="px-6 py-3 bg-primary-blue text-white font-semibold rounded-lg hover:bg-primary-blue/80 transition-colors duration-300 flex items-center"
                  >
                    Login as Child
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-2xl font-semibold text-[var(--deep-ocean)] mb-4">Insights</h3>
                <h4 className="text-xl font-semibold text-[var(--heading-color)] mb-3">Subject Performance:</h4>
                <div className="space-y-4 mb-6">
                  {Object.entries(childData.progress?.subjects || {}).map(([subject, data]) => (
                    <div key={subject}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[var(--foreground)] font-medium">{subject}</span>
                        <span className={`font-bold ${data.score >= 70 ? 'text-green-600' : data.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{data.score || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div className={`h-4 rounded-full ${data.score >= 70 ? 'bg-green-500' : data.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                             style={{ width: `${data.score || 0}%` }}></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{data.feedback}</p>
                    </div>
                  ))}
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-3">Task Summary:</h4>
                <p className="text-gray-700">Completed Tasks: <span className="font-bold">{completedTasksCount}</span></p>
                <p className="text-gray-700">Assigned Tasks: <span className="font-bold">{assignedTasksCount}</span></p>
                <p className="text-gray-700 mb-4">In Progress: <span className="font-bold">{assignedTasksCount - completedTasksCount}</span></p>
                
                <div className="flex space-x-2 mb-4">
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Last 7 days</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">This month</button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Custom range</button>
                </div>
                <button className="mt-4 px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-primary-blue/80">View Full Report</button>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-2xl font-semibold text-[var(--deep-ocean)] mb-4">Tasks</h3>
                {childData.assignedTasks && childData.assignedTasks.length > 0 ? (
                  <ul className="space-y-3">
                    {childData.assignedTasks.map((task, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        {task.status === 'completed' && <FaCheckCircle className="text-green-500 mr-2 text-xl" />}
                        {task.status === 'in-progress' && <FaHourglassHalf className="text-yellow-500 mr-2 text-xl" />}
                        {task.status === 'not-started' && <FaTimesCircle className="text-red-500 mr-2 text-xl" />}
                        <span className="font-medium">{task.name}</span> - <span className="ml-1 capitalize">{task.status.replace('-', ' ')}</span>
                        {/* Start/Continue button */}
                        {task.status !== 'completed' && (
                          <button
                            className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded"
                            onClick={() => router.push(`/learning/${task.subjectId}/${task.levelId}/${task.lessonId}`)} // Assuming these fields exist
                          >
                            {task.status === 'not-started' ? 'Start' : 'Continue'}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No tasks assigned yet.</p>
                )}
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-2xl font-semibold text-[var(--deep-ocean)] mb-4">Progress</h3>
                <p className="text-gray-700 mb-2"><strong>Week-by-week activity:</strong> (Placeholder for timeline)</p>
                <p className="text-gray-700 mb-2"><strong>Time spent on platform:</strong> (Placeholder)</p>
                <p className="text-gray-700 mb-2"><strong>Badges/Milestones:</strong> (Placeholder)</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-2xl font-semibold text-[var(--deep-ocean)] mb-4">Settings</h3>
                <p className="text-gray-700 mb-2"><strong>Update grade:</strong> (Placeholder)</p>
                <p className="text-gray-700 mb-2"><strong>Assign subject access:</strong> (Placeholder)</p>
                <p className="text-gray-700 mb-2"><strong>Notification preferences:</strong> (Placeholder)</p>
                <p className="text-gray-700 mb-2"><strong>Optional:</strong> Lock account, change theme for child, etc. (Placeholder)</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit View */}
        <div className="w-full flex-shrink-0 p-4 md:p-6">
          <h2 className="text-3xl font-bold text-[var(--deep-ocean)] mb-6 text-center">Edit Child</h2>
          <AddChildForm childToEdit={childData} onClose={handleCancel} onSaveSuccess={handleSaveSuccess} />
        </div>

        {/* Delete Confirmation View */}
        <div className="w-full flex-shrink-0 p-4 md:p-6 flex flex-col items-center justify-center text-center">
          <FaTrash className="text-red-500 text-6xl mb-4" />
          <h2 className="text-2xl font-bold text-[var(--deep-ocean)] mb-4">Are you sure you want to delete {childData.name}?</h2>
          <p className="text-gray-700 mb-6">This action cannot be undone.</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleConfirmDelete}
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Confirm Delete
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors duration-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildDashboard;