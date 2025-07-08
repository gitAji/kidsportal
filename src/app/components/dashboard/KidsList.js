import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import KidProgressReport from './KidProgressReport';
import AddChildForm from './AddChildForm'; // Import AddChildForm

const KidsList = () => {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProgressReportModal, setShowProgressReportModal] = useState(false);
  const [selectedKid, setSelectedKid] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false); // State for AddChildForm modal
  const [editingKid, setEditingKid] = useState(null); // State for kid being edited

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      setError("No user logged in.");
      return;
    }

    const parentUid = auth.currentUser.uid;
    const kidsCollectionRef = collection(db, 'users', parentUid, 'kids');
    const q = query(kidsCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const kidsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setKids(kidsData);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching kids:", err);
      setError("Failed to load kids data.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleViewProfileClick = (kid) => {
    setSelectedKid(kid);
    setShowProgressReportModal(true);
  };

  const handleCloseProgressReportModal = () => {
    setShowProgressReportModal(false);
    setSelectedKid(null);
  };

  const handleDeleteKid = async (kidId) => {
    if (window.confirm("Are you sure you want to delete this child?")) {
      try {
        const parentUid = auth.currentUser.uid;
        const kidDocRef = doc(db, 'users', parentUid, 'kids', kidId);
        await deleteDoc(kidDocRef);
        alert("Child deleted successfully!");
      } catch (err) {
        console.error("Error deleting child:", err);
        alert("Failed to delete child. Please try again.");
      }
    }
  };

  const handleEditKid = (kid) => {
    setEditingKid(kid);
    setShowAddChildModal(true); // Reuse AddChildForm for editing
  };

  const handleCloseAddChildModal = () => {
    setShowAddChildModal(false);
    setEditingKid(null); // Clear editing kid when modal closes
  };

  const handleSaveSuccess = () => {
    // This function can be used to refresh the list or show a global success message
    // For now, the AddChildForm handles its own success message and closing
    setShowAddChildModal(false);
    setEditingKid(null);
  };

  if (loading) {
    return <p>Loading kids...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (kids.length === 0) {
    return <p className="text-gray-700">No kids added yet. Click &quot;Add Kid&quot; to get started!</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kids.map((kid) => (
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
      ))}

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