import React, { useState, useEffect } from 'react';

const AssignTaskForm = ({ onClose, kidId, kidName }) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);

  // Static data for demonstration
  const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'english', name: 'English Language Arts' },
    { id: 'science', name: 'Science' },
    { id: 'tamil', name: 'Tamil' },
  ];

  const levelsData = {
    math: [
      { id: 'level1', name: 'Level 1' },
      { id: 'level2', name: 'Level 2' },
    ],
    english: [
      { id: 'level1', name: 'Level 1' },
      { id: 'level2', name: 'Level 2' },
    ],
  };

  const lessonsData = {
    math: {
      level1: [
        { id: 'lesson1', name: 'Lesson 1: Counting' },
        { id: 'lesson2', name: 'Lesson 2: Addition Basics' },
      ],
    },
    english: {
      level1: [
        { id: 'lesson1', name: 'Lesson 1: ABCs' },
        { id: 'lesson2', name: 'Lesson 2: Short Vowels' },
      ],
    },
  };

  const currentLevels = selectedSubject ? levelsData[selectedSubject] || [] : [];
  const currentLessons = (selectedSubject && selectedLevel) ? (lessonsData[selectedSubject] && lessonsData[selectedSubject][selectedLevel]) || [] : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!selectedSubject || !selectedLevel || !selectedLesson) {
      alert("Please select a subject, level, and lesson.");
      return;
    }

    // Simulate saving to a database
    console.log(`Assigning task to ${kidName}: Subject: ${selectedSubject}, Level: ${selectedLevel}, Lesson: ${selectedLesson}`);
    setSuccessMessage('Task assigned successfully!');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Assign Task to {kidName}</h2>
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">Subject:</label>
            <select
              id="subject"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedLevel('');
                setSelectedLesson('');
              }}
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
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setSelectedLesson('');
              }}
              disabled={!selectedSubject}
              required
            >
              <option value="">Select a Level</option>
              {currentLevels.map(level => (
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
