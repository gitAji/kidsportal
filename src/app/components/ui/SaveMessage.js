"use client";
import React from 'react';

const SaveMessage = ({ status, message }) => {
  if (!status) return null;
  const bgColor = status === 'success' ? 'bg-green-500' : 'bg-red-500';
  return (
    <div className={`p-3 mt-4 text-white rounded-lg text-center ${bgColor}`}>
      {message}
    </div>
  );
};

export default SaveMessage;
