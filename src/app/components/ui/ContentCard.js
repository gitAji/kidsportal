// src/app/components/ui/ContentCard.js
"use client";

import React from "react";

const ContentCard = ({ title, content, error }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>{content}</div>
      )}
    </div>
  );
};

export default ContentCard;
