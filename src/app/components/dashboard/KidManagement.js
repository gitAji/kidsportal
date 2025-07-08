import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import AddChildForm from './AddChildForm';

const KidManagement = ({ onClose }) => {
  const [kids, setKids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [editingKid, setEditingKid] = useState(null);

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
    onClose(); // Close KidManagement modal after successful save in AddChildForm
  };

  if (loading) {
    return <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center"><p>Loading kids...</p></div>;
  }

  if (error) {
    return <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center"><p className="text-red-500">Error: {error}</p></div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full">
        <h2 className="text-2xl font-bold mb-4">Manage Kids</h2>

        <button
          onClick={() => setShowAddChildModal(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add New Child
        </button>

        {kids.length === 0 ? (
          <p className="text-gray-700">No kids added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">Age</th>
                  <th className="py-2 px-4 border-b">Grade</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kids.map((kid) => (
                  <tr key={kid.id}>
                    <td className="py-2 px-4 border-b">{kid.name}</td>
                    <td className="py-2 px-4 border-b">{kid.age}</td>
                    <td className="py-2 px-4 border-b">{kid.grade}</td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleEditKid(kid)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteKid(kid.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
        >
          Close
        </button>

        {showAddChildModal && (
          <AddChildForm
            onClose={handleCloseAddChildModal}
            kidToEdit={editingKid}
            onSaveSuccess={handleSaveSuccess} // Pass the new callback
          />
        )}
      </div>
    </div>
  );
};

export default KidManagement;