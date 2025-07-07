import React from 'react';
import AssignedTasks from './AssignedTasks';
import ProgressTracker from './ProgressTracker';
import GradesReport from './GradesReport';
import RewardsDisplay from './RewardsDisplay';

const KidDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Kid Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Assigned Tasks</h2>
        <AssignedTasks />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Progress Tracker</h2>
        <ProgressTracker />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Grades</h2>
        <GradesReport />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Rewards</h2>
        <RewardsDisplay />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Content Interaction</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-700">Interactive content, quizzes, videos will be displayed here.</p>
          {/* Placeholder for interactive content */}
        </div>
      </section>
    </div>
  );
};

export default KidDashboard;
