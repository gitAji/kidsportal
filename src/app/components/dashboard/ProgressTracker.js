"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaChartBar, FaBook, FaStar } from 'react-icons/fa';

const ProgressTracker = ({ progress }) => {
  if (!progress || !progress.subjects) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        <FaChartBar className="text-6xl text-gray-300 mx-auto mb-4" />
        <p>No progress to display yet. Start learning to see your progress!</p>
      </div>
    );
  }

  const data = Object.entries(progress.subjects).map(([name, values]) => ({
    name,
    score: values.score,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-indigo-600 flex items-center">
        <FaChartBar className="mr-2" /> Your Progress
      </h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressTracker;
