"use client";

import React from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const BackToTop = dynamic(() => import("../../../components/ui/BackToTop"), {
  ssr: false,
});
const Timeline = dynamic(() => import("../../../components/ui/Timeline"), {
  ssr: false,
});

export default function SubjectLevelsPage({ params }) {
  const router = useRouter();
  const { gradeId, subjectId } = params;

  // Static levels data for demonstration (will be replaced with dynamic data later)
  const levels = [
    {
      id: "level1",
      name: "Level 1",
      description: "Introduction to basic concepts.",
    },
    {
      id: "level2",
      name: "Level 2",
      description: "Building on foundational knowledge.",
    },
    {
      id: "level3",
      name: "Level 3",
      description: "Intermediate topics and challenges.",
    },
  ];

  return (
    <>
      <Timeline />
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold text-blue-600">
            {subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} -{" "}
            {gradeId.replace("grade", "Grade ")}
          </h1>
          <p className="mt-4 text-gray-600">
            Select a level to explore lessons, practices, and exams.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {levels.map((level) => (
              <div
                key={level.id}
                className="bg-white p-6 rounded-lg shadow-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                onClick={() =>
                  router.push(`/learning/${gradeId}/${subjectId}/${level.id}`)
                }
              >
                <h3 className="text-2xl font-bold text-blue-600 mt-4">
                  {level.name}
                </h3>
                <p className="mt-2 text-gray-600">{level.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BackToTop />
    </>
  );
}
