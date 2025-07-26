import React from 'react';
import SubjectsSection from '../../components/learning/SubjectsSection';
import HowWeMakeLearningFunSection from '../../components/learning/HowWeMakeLearningFunSection';

// This is the public-facing page that showcases what the platform offers.
// It does not require a user to be logged in.

export default function LearningPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-800">Explore Our Subjects</h1>
        <p className="text-xl text-gray-600 mt-4">
          A world of fun and interactive learning awaits!
        </p>
      </header>

      <SubjectsSection />

      <HowWeMakeLearningFunSection />
      
    </div>
  );
}