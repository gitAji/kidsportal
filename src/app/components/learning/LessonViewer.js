"use client";
import React from 'react';

const LessonViewer = ({ content }) => {
  return (
    <div>
      <h1>Lesson Viewer</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default LessonViewer;
