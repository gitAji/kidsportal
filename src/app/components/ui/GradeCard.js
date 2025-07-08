// app/src/components/ui/GradeCard.js

import React from "react";

export default function GradeCard({
  gradeIndex,
  gradeLabel,
  borderColor,
  subjectColors,
  generateLink,
}) {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-lg text-center ${borderColor} border-2`}
    >
      <h3 className="text-2xl font-bold text-blue-600 mb-2">
        {gradeIndex + 1}
      </h3>
      <h4 className="text-lg font-medium">{gradeLabel}</h4>
      <p className="mt-4 text-gray-600">Subjects:</p>
      <div className="mt-2 flex flex-wrap justify-center space-x-2">
        {subjectColors.map((subject) => (
          <a
            key={subject.subject}
            href={generateLink(gradeIndex + 1, subject.subject)} // Generate the link dynamically
            className={`rounded-full py-2 px-4 mb-2 text-sm font-semibold transition-all duration-200 hover:scale-110 ${subject.textColor} ${subject.color}`}
            style={{ backgroundColor: subject.color, color: subject.textColor }}
          >
            {subject.subject}
          </a>
        ))}
      </div>
    </div>
  );
}
