'use client';

import React from 'react';

const LessonViewer = ({ content }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-3xl font-bold text-[var(--deep-ocean)] mb-4">{content.title}</h2>
      {content.videoUrl && (
        <div className="aspect-w-16 aspect-h-9 mb-4">
          <iframe
            src={content.videoUrl}
            title={content.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      )}
      <p className="text-gray-700 leading-relaxed">{content.text}</p>
    </div>
  );
};

export default LessonViewer;
