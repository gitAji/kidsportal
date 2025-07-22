import React from "react";
import Link from "next/link";

export default function GradeCard({
  grade,
  gradeIndex,
  borderColor,
  subjectColorMapping,
  generateLink,
}) {
  return (
    <div
      id={`grade-${grade.gradeId}`}
      className={`bg-white p-6 rounded-lg shadow-lg text-center ${borderColor} border-4
        transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col justify-between`}
    >
      <div>
        <h3 className="text-3xl font-extrabold text-blue-700 mb-2">
          {grade.gradeName}
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {grade.subjects.map((subject, index) => {
          const colorInfo = subjectColorMapping[subject.subjectName] || { color: 'bg-gray-500', textColor: 'text-white' };
          return (
            <Link key={index} href={generateLink(grade.gradeId, subject.subjectId)} passHref>
              <button
                className={`${colorInfo.color} ${colorInfo.textColor} font-bold py-2 px-4 rounded-full shadow-lg hover:opacity-90 transform hover:scale-105 transition-transform duration-300 w-full`}
              >
                {subject.subjectName}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}