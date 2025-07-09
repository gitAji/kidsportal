// app/src/components/ui/GradeCard.js

import React from "react";
import Link from "next/link";

export default function GradeCard({
  gradeIndex,
  gradeLabel,
  borderColor,
  subjectColors,
  generateLink,
}) {
  const gradeOverviewLink = `/grades/${gradeIndex + 1}`;

  return (
    <Link href={gradeOverviewLink} passHref>
      <div
        className={`bg-white p-6 rounded-lg shadow-lg text-center ${borderColor} border-2
          transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
      >
        {/* Optional: Add an icon or image here for visual appeal */}
        {/* <img src="/path/to/grade-icon.png" alt="Grade Icon" className="mx-auto mb-4 w-16 h-16" /> */}

        <h3 className="text-3xl font-extrabold text-blue-700 mb-2">
          Grade {gradeIndex + 1}
        </h3>
        <h4 className="text-lg font-semibold text-gray-800">{gradeLabel}</h4>
        <p className="mt-4 text-gray-600 font-medium">Explore Subjects:</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {subjectColors.map((subject) => (
            <Link
              key={subject.subject}
              href={generateLink(gradeIndex + 1, subject.subject)}
              passHref
            >
              <span
                className={`rounded-full py-2 px-4 text-sm font-bold 
                  ${subject.color} ${subject.textColor} 
                  transform transition-transform duration-200 hover:scale-110 hover:brightness-90`}
              >
                {subject.subject}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </Link>
  );
}