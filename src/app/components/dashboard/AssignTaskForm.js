import React, { useState } from 'react';
import { collection, addDoc, doc, getDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';

const AssignTaskForm = ({ onClose, childId, childName }) => {
  const parentUid = auth.currentUser?.uid; // Get parent UID from auth

  // Placeholder for addNotification function
  const addNotification = async (userId, message) => {
    try {
      await addDoc(collection(db, 'users', userId, 'notifications'), {
        id: new Date().getTime().toString(), // Simple unique ID
        type: 'task_assigned',
        message: message,
        read: false,
        timestamp: new Date(),
      });
      console.log("Notification added successfully!");
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  };

  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [levels, setLevels] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingLevels, setLoadingLevels] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'subjects'));
        const subjectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSubjects(subjectsData);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      setLoadingLevels(true);
      const fetchLevels = async () => {
        try {
          const subjectDoc = await getDoc(doc(db, 'subjects', selectedSubject));
          if (subjectDoc.exists()) {
            const subjectData = subjectDoc.data();
            // Assuming child.grade is available, for now, let's use a default or pass it as a prop
            const childGrade = childToEdit?.grade || 1; // Default to grade 1 if not available
            const gradeData = subjectData.grades.find(g => g.grade === childGrade);
            if (gradeData) {
              setLevels(gradeData.levels);
            } else {
              setLevels([]);
            }
          }
        } catch (error) {
          console.error("Error fetching levels:", error);
        } finally {
          setLoadingLevels(false);
        }
      };
      fetchLevels();
    } else {
      setLevels([]);
      setLessons([]);
    }
  }, [selectedSubject, childId]); // Added childId to dependency array

  useEffect(() => {
    if (selectedSubject && selectedLevel) {
      setLoadingLessons(true);
      const fetchLessons = async () => {
        try {
          const subjectDoc = await getDoc(doc(db, 'subjects', selectedSubject));
          if (subjectDoc.exists()) {
            const subjectData = subjectDoc.data();
            const childGrade = childToEdit?.grade || 1; // Default to grade 1 if not available
            const gradeData = subjectData.grades.find(g => g.grade === childGrade);
            const levelData = gradeData?.levels.find(l => l.level.toString() === selectedLevel);
            if (levelData && levelData.questions) {
              // For simplicity, treating questions as lessons for now
              setLessons(levelData.questions.map((q, index) => ({ id: `lesson${index + 1}`, name: q.question })));
            } else {
              setLessons([]);
            }
          }
        } catch (error) {
          console.error("Error fetching lessons:", error);
        } finally {
          setLoadingLessons(false);
        }
      };
      fetchLessons();
    } else {
      setLessons([]);
    }
  }, [selectedSubject, selectedLevel, childId]); // Added childId to dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!selectedSubject || !selectedLevel || !selectedLesson) {
      alert("Please select a subject, level, and lesson.");
      return;
    }

    // Simulate saving to a database
    console.log(`Assigning task to ${kidName}: Subject: ${selectedSubject}, Level: ${selectedLevel}, Lesson: ${selectedLesson}`);
    const taskRef = collection(db, 'users', childId, 'assignedTasks');
      await addDoc(taskRef, {
        lessonId: selectedLesson,
        subjectId: selectedSubject,
        levelId: selectedLevel,
        status: 'assigned',
        assignedBy: parentUid,
        assignedDate: new Date(),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default due date 7 days from now
        childName: childName, // Store child's name for easier display
        lessonName: lessons.find(l => l.id === selectedLesson)?.name, // Store lesson name
        subjectName: subjects.find(s => s.id === selectedSubject)?.name, // Store subject name
        levelName: levels.find(l => l.id === selectedLevel)?.name, // Store level name
      });
      setSuccessMessage('Task assigned successfully!');

      // Add notification for the parent
      await addNotification(parentUid, `A new task has been assigned to ${childName}: ${lessons.find(l => l.id === selectedLesson)?.name} in ${subjects.find(s => s.id === selectedSubject)?.name}.`);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Assign Task to {childName}</h2>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-[var(--foreground)] text-sm font-bold mb-2">Subject:</label>
            <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:shadow-outline"
          >
              <option value="">Select a Subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="level" className="block text-[var(--foreground)] text-sm font-bold mb-2">Level:</label>
            <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:shadow-outline"
          >
              <option value="">Select a Level</option>
              {currentLevels.map(level => (
                <option key={level.id} value={level.id}>{level.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="lesson" className="block text-[var(--foreground)] text-sm font-bold mb-2">Lesson:</label>
            <select
            id="lesson"
            name="lesson"
            value={formData.lesson}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:shadow-outline"
          >
              <option value="">Select a Lesson</option>
              {currentLessons.map(lesson => (
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
