import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { auth } from '../../../firebase/auth';
import SkeletonLoader from '../ui/SkeletonLoader';
import AddChildForm from './AddChildForm'; // Reusing the AddChildForm
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaUser, FaChartLine, FaTasks, FaHourglassHalf, FaCog, FaUpload, FaFilePdf } from 'react-icons/fa';

const ChildDashboard = ({ child, onDelete, onClose }) => {
  console.log("ChildDashboard received child prop:", child);
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
    console.log("Edit button clicked. Setting currentView to 'edit'.");
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
          <h2 className="text-3xl font-bold text-[var(--deep-ocean)] mb-6 text-center">{childData.name}&apos;s Dashboard</h2>
          
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
                <div className="flex items-center mb-4">
                  {/* Child Image/Initial */}
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-white text-5xl font-bold mr-4">
                    {childData.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-[var(--deep-ocean)]">{childData.name}</h3>
                    <p className="text-lg text-gray-600">Age: {childData.age}</p>
                    <p className="text-lg text-gray-600">Grade: {childData.grade}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
                    <FaUpload className="mr-2" /> Upload Image
                  </button>
                </div>
                <p className="text-[var(--foreground)] mt-4"><strong>Notes:</strong> {childData.notes || 'No notes available.'}</p>
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-4">
                  <button
                    onClick={handleEditClick}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center"
                    title="Edit Child"
                  >
                    <FaEdit className="mr-2" /> 
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center"
                    title="Delete Child"
                  >
                    <FaTrash className="mr-2" /> 
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-2xl font-semibold text-[var(--deep-ocean)] mb-4">Learning Insights</h3>

                {/* Progress Overview */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-[var(--heading-color)] mb-3">Overall Progress</h4>
                  <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                    <div
                      className="bg-green-500 h-4 rounded-full text-xs font-medium text-blue-100 text-center p-0.5 leading-none"
                      style={{ width: `${overallProgress}%` }}
                    >
                      {overallProgress}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{completedTasksCount} of {assignedTasksCount} tasks completed.</p>
                </div>

                {/* Activity Trends */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-700">Learning Streak</h5>
                    <p className="text-2xl font-bold text-blue-600">5 days</p>
                    <p className="text-sm text-gray-500">Keep up the great work!</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-gray-700">Last Active</h5>
                    <p className="text-2xl font-bold text-blue-600">Yesterday</p>
                    <p className="text-sm text-gray-500">Completed Math Quiz</p>
                  </div>
                </div>

                {/* Subject-wise Performance */}
                <div className="mb-6">
                  <h4 className="text-xl font-semibold text-[var(--heading-color)] mb-3">Subject Performance</h4>
                  <div className="space-y-4">
                    {Object.entries(childData.progress?.subjects || {}).map(([subject, data]) => (
                      <div key={subject}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[var(--foreground)] font-medium">{subject}</span>
                          <span className={`font-bold ${data.score >= 70 ? 'text-green-600' : data.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>{data.score || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className={`h-2.5 rounded-full ${data.score >= 70 ? 'bg-green-500' : data.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                               style={{ width: `${data.score || 0}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="mb-6">
                    <h4 className="text-xl font-semibold text-[var(--heading-color)] mb-3">Recent Activity</h4>
                    <ul className="space-y-2">
                        {childData.assignedTasks?.filter(t => t.status === 'completed').slice(0, 3).map((task, index) => (
                            <li key={index} className="flex items-center text-gray-700">
                                <FaCheckCircle className="text-green-500 mr-2" />
                                <span>Completed <strong>{task.name}</strong> in {task.subject}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Download Report Button */}
                <div className="text-right mt-6">
                  <button className="px-4 py-2 bg-primary-blue text-white rounded-md hover:bg-primary-blue/80 flex items-center">
                    <FaFilePdf className="mr-2" />
                    Download Report
                  </button>
                </div>
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
                <h3 className="text-2xl font-semibold text-[var(--deep-ocean)] mb-6">Settings & Controls</h3>

                {/* Academic Settings */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-[var(--heading-color)] mb-4 border-b pb-2">Academic Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Grade Level */}
                    <div>
                      <label htmlFor="grade-level" className="block text-md font-medium text-gray-700 mb-2">Grade Level</label>
                      <select
                        id="grade-level"
                        name="grade-level"
                        defaultValue={childData.grade}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option>Kindergarten</option>
                        <option>Grade 1</option>
                        <option>Grade 2</option>
                        <option>Grade 3</option>
                        <option>Grade 4</option>
                        <option>Grade 5</option>
                      </select>
                    </div>
                    {/* Subject Access */}
                    <div>
                      <h5 className="text-md font-medium text-gray-700 mb-2">Subject Access</h5>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input id="math-access" name="math-access" type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                          <label htmlFor="math-access" className="ml-3 block text-sm text-gray-900">Mathematics</label>
                        </div>
                        <div className="flex items-center">
                          <input id="english-access" name="english-access" type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                          <label htmlFor="english-access" className="ml-3 block text-sm text-gray-900">English</label>
                        </div>
                        <div className="flex items-center">
                          <input id="science-access" name="science-access" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                          <label htmlFor="science-access" className="ml-3 block text-sm text-gray-900">Science</label>
                        </div>
                         <div className="flex items-center">
                          <input id="tamil-access" name="tamil-access" type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                          <label htmlFor="tamil-access" className="ml-3 block text-sm text-gray-900">Tamil</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Goals & Limits */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-[var(--heading-color)] mb-4 border-b pb-2">Goals & Time Limits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="time-limit" className="block text-md font-medium text-gray-700 mb-2">Daily Time Limit</label>
                      <select
                        id="time-limit"
                        name="time-limit"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option>No Limit</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>1.5 hours</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="learning-goal" className="block text-md font-medium text-gray-700 mb-2">Weekly Learning Goal (e.g., 5 lessons)</label>
                      <input
                        type="text"
                        name="learning-goal"
                        id="learning-goal"
                        placeholder="e.g., 5 lessons"
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Control */}
                <div className="mb-8">
                    <h4 className="text-xl font-semibold text-[var(--heading-color)] mb-4 border-b pb-2">Account Control</h4>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <div>
                            <h5 className="font-medium text-gray-800">Child&apos;s Login Access</h5>
                            <p className="text-sm text-gray-600">Enable or disable the child&apos;s ability to log in independently.</p>
                        </div>
                        <label htmlFor="login-toggle" className="inline-flex relative items-center cursor-pointer">
                            <input type="checkbox" value="" id="login-toggle" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>


                {/* Save Changes Button */}
                <div className="text-right mt-8">
                  <button
                    type="button"
                    className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit View */}
        {currentView === 'edit' && (
          <div className="w-full flex-shrink-0 p-4 md:p-6">
            <h2 className="text-3xl font-bold text-[var(--deep-ocean)] mb-6 text-center">Edit Child</h2>
            <AddChildForm childToEdit={child} onClose={handleCancel} onSaveSuccess={handleSaveSuccess} />
          </div>
        )}

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