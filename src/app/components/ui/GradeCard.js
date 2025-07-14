import React from "react";
import Link from "next/link";

export default function GradeCard({
  gradeIndex,
  gradeLabel,
  borderColor,
  subjectColors,
  generateLink,
}) {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-lg text-center ${borderColor} border-4
        transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col justify-between`}
    >
      <div>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-2">
          Grade {gradeIndex + 1}
        </h3>
        <h4 className="text-lg font-semibold text-gray-800 mb-4">{gradeLabel}</h4>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {subjectColors.map((subject, index) => (
          <Link
            key={index}
            href={generateLink(gradeIndex + 1, subject.subject)}
            passHref
          >
            <button
              className={`${subject.color} ${subject.textColor} font-bold py-2 px-4 rounded-full shadow-lg hover:opacity-90 transform hover:scale-105 transition-transform duration-300 w-full`}
            >
              {subject.subject}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}