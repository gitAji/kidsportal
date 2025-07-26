"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartBar, FaBook, FaCheckCircle, FaPercentage } from 'react-icons/fa';

const ProgressTracker = ({ child }) => {
  const { progress, assignedTasks } = child;

  if (!assignedTasks || assignedTasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mt-4">Your child&apos;s progress will be shown here once they start completing tasks.</p>
      </div>
    );
  }

  const completedTasks = assignedTasks.filter(t => t.status === 'completed');
  const overallCompletion = Math.round((completedTasks.length / assignedTasks.length) * 100);

  // Aggregate scores by subject
  const subjectProgress = {};
  completedTasks.forEach(task => {
    // This assumes a task ID format like "math-1-level-1-quiz-1"
    const subjectName = task.taskId.split('-')[0]; 
    if (!subjectProgress[subjectName]) {
      subjectProgress[subjectName] = { scores: [], count: 0 };
    }
    if (task.score !== undefined) {
      subjectProgress[subjectName].scores.push(task.score);
    }
    subjectProgress[subjectName].count++;
  });

  const chartData = Object.keys(subjectProgress).map(subject => ({
    name: subject.charAt(0).toUpperCase() + subject.slice(1),
    avgScore: subjectProgress[subject].scores.reduce((a, b) => a + b, 0) / subjectProgress[subject].scores.length,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FaChartBar className="mr-3 text-blue-500" /> Overall Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">{assignedTasks.length}</p>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-3xl font-bold text-yellow-600">{assignedTasks.length - completedTasks.length}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">{overallCompletion}%</p>
            <p className="text-sm text-gray-600">Completion</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FaPercentage className="mr-3 text-green-500" /> Average Score by Subject
        </h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgScore" fill="#82ca9d" name="Average Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <FaBook className="mr-3 text-yellow-500" /> Recently Completed Tasks
        </h3>
        <ul className="space-y-3">
          {completedTasks.slice(-5).reverse().map(task => (
            <li key={task.taskId} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-3" />
                <span className="font-medium text-gray-700">{task.taskName}</span>
              </div>
              {task.score !== undefined && (
                <span className="font-semibold text-gray-800">Score: {task.score}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProgressTracker;