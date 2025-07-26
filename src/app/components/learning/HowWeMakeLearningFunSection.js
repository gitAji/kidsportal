"use client";
import React from 'react';
import { FaGamepad, FaTrophy, FaPaintBrush } from 'react-icons/fa';

const features = [
  {
    icon: <FaGamepad />,
    title: 'Game-Like Adventures',
    description: 'We turn learning into a journey with visual paths and interactive challenges that feel like playing a game.'
  },
  {
    icon: <FaTrophy />,
    title: 'Rewards & Collectibles',
    description: "Children earn points and unlock cool stickers for completing tasks, giving them a sense of accomplishment."
  },
  {
    icon: <FaPaintBrush />,
    title: 'Avatar Customization',
    description: "Kids can spend their points in the Avatar Shop to personalize their character and express their creativity."
  }
];

const HowWeMakeLearningFunSection = () => {
  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800">How We Make Learning Fun</h2>
        <p className="text-lg text-gray-600 mt-2">Our platform is more than just lessons; it&apos;s an experience.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="text-5xl text-blue-500 mb-4 inline-block">{feature.icon}</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowWeMakeLearningFunSection;