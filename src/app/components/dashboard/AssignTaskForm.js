import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, addDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import { addNotification } from '../../../firebase/notifications'; // Import addNotification

const AssignTaskForm = ({ onClose, kidId, kidName }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = () => {
      const subjectsCollectionRef = collection(db, 'subjects');
      const q = query(subjectsCollectionRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const subjectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubjects(subjectsData);
        setLoading(false);
      }, (err) => {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects.");
        setLoading(false);
      });
      return () => unsubscribe();
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      const levelsCollectionRef = collection(db, 'subjects', selectedSubject, 'levels');
      const q = query(levelsCollectionRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const levelsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLevels(levelsData);
        setSelectedLevel(''); // Reset selected level when subject changes
        setLessons([]); // Clear lessons
        setSelectedLesson(''); // Clear selected lesson
      }, (err) => {
        console.error("Error fetching levels:", err);
        setError("Failed to load levels.");
      });
      return () => unsubscribe();
    } else {
      setLevels([]);
      setSelectedLevel('');
      setLessons([]);
      setSelectedLesson('');
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedSubject && selectedLevel) {
      const lessonsCollectionRef = collection(db, 'subjects', selectedSubject, 'levels', selectedLevel, 'lessons');
      const q = query(lessonsCollectionRef);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const lessonsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLessons(lessonsData);
        setSelectedLesson(''); // Reset selected lesson when level changes
      }, (err) => {
        console.error("Error fetching lessons:", err);
        setError("Failed to load lessons.");
      });
      return () => unsubscribe();
    } else {
      setLessons([]);
      setSelectedLesson('');
    }
  }, [selectedSubject, selectedLevel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!auth.currentUser) {
      setError("No user logged in.");
      return;
    }
    if (!selectedSubject || !selectedLevel || !selectedLesson) {
      setError("Please select a subject, level, and lesson.");
      return;
    }

    try {
      const parentUid = auth.currentUser.uid;
      const taskRef = collection(db, 'users', kidId, 'assignedTasks');
      await addDoc(taskRef, {
        lessonId: selectedLesson,
        subjectId: selectedSubject,
        levelId: selectedLevel,
        status: 'assigned',
        assignedBy: parentUid,
        assignedDate: new Date(),
        kidName: kidName, // Store kid's name for easier display
        lessonName: lessons.find(l => l.id === selectedLesson)?.name, // Store lesson name
        subjectName: subjects.find(s => s.id === selectedSubject)?.name, // Store subject name
        levelName: levels.find(l => l.id === selectedLevel)?.name, // Store level name
      });
      setSuccessMessage('Task assigned successfully!');

      // Add notification for the kid
      await addNotification(kidId, `A new task has been assigned to you: ${lessons.find(l => l.id === selectedLesson)?.name} in ${subjects.find(s => s.id === selectedSubject)?.name}.`);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Error assigning task:", err);
      setError("Failed to assign task. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <p>Loading subjects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Assign Task to {kidName}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject:</label>
            <select
              id="subject"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
            >
              <option value="">Select a Subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="level" className="block text-gray-700 text-sm font-bold mb-2">Level:</label>
            <select
              id="level"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              disabled={!selectedSubject}
              required
            >
              <option value="">Select a Level</option>
              {levels.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="lesson" className="block text-gray-700 text-sm font-bold mb-2">Lesson:</label>
            <select
              id="lesson"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
              disabled={!selectedLevel}
              required
            >
              <option value="">Select a Lesson</option>
              {lessons.map(lesson => (
                <option key={lesson.id} value={lesson.id}>{lesson.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Assign Task
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTaskForm;