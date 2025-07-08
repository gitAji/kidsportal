import React, { useState, useEffect } from 'react';
import KidProgressReport from './KidProgressReport';
import AddChildForm from './AddChildForm'; 

const KidsList = () => {
  const [kids, setKids] = useState([
    {
      id: 'alice',
      name: 'Alice',
      age: 7,
      grade: '2nd Grade',
      assignedTasks: 10,
      tasksCompleted: 7,
      progress: 70,
    },
    {
      id: 'bob',
      name: 'Bob',
      age: 9,
      grade: '4th Grade',
      assignedTasks: 12,
      tasksCompleted: 9,
      progress: 75,
    },
  ]);
  const [showProgressReportModal, setShowProgressReportModal] = useState(false);
  const [selectedKid, setSelectedKid] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false); 
  const [editingKid, setEditingKid] = useState(null); 

  const handleViewProfileClick = (kid) => {
    setSelectedKid(kid);
    setShowProgressReportModal(true);
  };

  const handleCloseProgressReportModal = () => {
    setShowProgressReportModal(false);
    setSelectedKid(null);
  };

  const handleDeleteKid = (kidId) => {
    if (window.confirm("Are you sure you want to delete this child?")) {
      setKids(kids.filter(kid => kid.id !== kidId));
      alert("Child deleted successfully!");
    }
  };

  const handleEditKid = (kid) => {
    setEditingKid(kid);
    setShowAddChildModal(true); 
  };

  const handleCloseAddChildModal = () => {
    setShowAddChildModal(false);
    setEditingKid(null); 
  };

  const handleSaveSuccess = (newKid) => {
    if (editingKid) {
      setKids(kids.map(kid => (kid.id === newKid.id ? newKid : kid)));
    } else {
      setKids([...kids, { ...newKid, id: Date.now().toString() }]); // Add a simple ID for static data
    }
    setShowAddChildModal(false);
    setEditingKid(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kids.length === 0 ? (
        <p className="text-gray-700">No kids added yet. Click &quot;Add Kid&quot; to get started!</p>
      ) : (
        kids.map((kid) => (
          <div key={kid.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">{kid.name}</h3>
            <p className="text-gray-700">Age: {kid.age}</p>
            <p className="text-gray-700">Grade: {kid.grade}</p>
            <div className="mt-4">
              <p className="text-gray-700">Assigned Tasks: {kid.assignedTasks || 0}</p>
              <p className="text-gray-700">Tasks Completed: {kid.tasksCompleted || 0}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${kid.progress || 0}%` }}
                ></div>
              </div>
              <p className="text-gray-700 text-sm mt-1">Progress: {kid.progress || 0}%</p>
            </div>
            <div className="mt-4 flex justify-between space-x-2">
              <button
                onClick={() => handleEditKid(kid)}
                className="flex-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteKid(kid.id)}
                className="flex-1 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => handleViewProfileClick(kid)}
                className="flex-1 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm"
              >
                View Profile
              </button>
            </div>
          </div>
        ))
      )}

      {showProgressReportModal && (
        <KidProgressReport kid={selectedKid} onClose={handleCloseProgressReportModal} />
      )}

      {showAddChildModal && (
        <AddChildForm
          onClose={handleCloseAddChildModal}
          kidToEdit={editingKid}
          onSaveSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
};

export default KidsList;
