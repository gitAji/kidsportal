"use client";
import React, { useState } from 'react';
import dbData from '../../../public/db.json'; // Use the local JSON data

const AssignTaskForm = ({ child, onAssign, onClose }) => {
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [error, setError] = useState('');

  // Get the subjects available for the child's grade
  const gradeData = dbData.grades.find(g => g.gradeName === child.grade);
  const availableSubjects = gradeData ? gradeData.subjects : [];

  // Get the tasks for the selected subject
  const availableTasks = selectedSubjectId 
    ? availableSubjects.find(s => s.subjectId === selectedSubjectId)?.levels.flatMap(l => l.tasks) || []
    : [];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!selectedTaskId) {
      setError('Please select a task to assign.');
      return;
    }
    
    const taskToAssign = availableTasks.find(t => t.taskId === selectedTaskId);
    
    // Check if the task is already assigned
    if (child.assignedTasks?.some(t => t.taskId === selectedTaskId)) {
        setError('This task has already been assigned to this child.');
        return;
    }

    onAssign(taskToAssign);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Assign a New Task to {child.name}</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-bold mb-2">1. Select a Subject:</label>
          <select
            id="subject"
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setSelectedTaskId(''); // Reset task selection
            }}
            className="form-input"
          >
            <option value="">-- Choose a Subject --</option>
            {availableSubjects.map(subject => (
              <option key={subject.subjectId} value={subject.subjectId}>{subject.subjectName}</option>
            ))}
          </select>
        </div>

        {selectedSubjectId && (
          <div className="mb-6">
            <label htmlFor="task" className="block text-sm font-bold mb-2">2. Select a Task:</label>
            <select
              id="task"
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="form-input"
            >
              <option value="">-- Choose a Task --</option>
              {availableTasks.map(task => (
                <option key={task.taskId} value={task.taskId}>{task.taskName} ({task.type})</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700" disabled={!selectedTaskId}>
            Assign Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignTaskForm;