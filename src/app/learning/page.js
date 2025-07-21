"use client"; // Ensure this component is treated as a client component

import React from "react";
import dynamic from "next/dynamic";

const SubjectsSection = dynamic(() => import("../components/learning/SubjectsSection"), { ssr: false });
const HowWeMakeLearningFunSection = dynamic(() => import("../components/learning/HowWeMakeLearningFunSection"), { ssr: false });
const BackToTop = dynamic(() => import("../components/ui/BackToTop"), {
  ssr: false,
});
const Timeline = dynamic(() => import("../components/ui/Timeline"), {
  ssr: false,
});

export default function LearningPage() {
  return (
    <>
      <Timeline />
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto text-center px-4">
          <h1 className="page-heading mb-6 animate-fade-in-down">
            Discover a World of Knowledge!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 animate-fade-in-up">
            Engaging and interactive learning experiences across a variety of
            subjects, designed for young minds.
          </p>
        </div>
        <SubjectsSection />
        <HowWeMakeLearningFunSection />
      </section>
      <BackToTop />
    </>
  );
}
