import { lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import BackToTop from "../components/ui/BackToTop";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import HomePageClient from "../components/HomePageClient";
const GradeCard = lazy(() => import("../components/ui/GradeCard"));
import db from '../data/db.json'; // Import from src/app/data/db.json

export default async function HomePage() {
  const grades = db.grades;

  const borderColors = [
    "border-[#8B0000]", "border-[#FF8C00]", "border-[#FFD700]", "border-[#228B22]",
    "border-[#20B2AA]", "border-[#4682B4]", "border-[#6A5ACD]", "border-[#C71585]",
    "border-[#FF4500]", "border-[#B22222]", "border-[#8A2BE2]", "border-[#D2691E]",
  ];

  const subjectColorMapping = {
    "Math": { color: "bg-[#FF6347]", textColor: "text-white" },
    "Tamil": { color: "bg-[#32CD32]", textColor: "text-white" },
    "English": { color: "bg-[#1E90FF]", textColor: "text-white" },
    "Science": { color: "bg-[#FFD700]", textColor: "text-black" },
  };

  const generateLink = (gradeId, subjectId) => {
    return `/grades/${gradeId}/${subjectId}`;
  };

  return (
    <HomePageClient>
      <section className="relative bg-blue-100 py-20 h-[500px] overflow-hidden">
        <Image src="/images/intro.png" alt="Hero Background" fill className="object-cover opacity-30" priority />
        <div className="absolute top-10 left-10 w-24 h-24 animate-pulse">
          <Image src="/images/cloud.png" alt="Cloud" width={90} height={90} />
        </div>
        <div className="absolute top-20 right-10 w-32 h-32 animate-pulse delay-500">
          <Image src="/images/cloud.png" alt="Cloud" width={120} height={120} />
        </div>
        <div className="absolute bottom-10 left-1/4 w-48 h-24">
          <Image src="/images/rainbow.png" alt="Rainbow" width={192} height={96} />
        </div>
        <div className="container mx-auto text-center relative z-10 px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 drop-shadow-lg leading-tight">
            Welcome to a World of Fun Learning!
          </h1>
          <p className="mt-4 text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
            Explore exciting games and activities that make learning an adventure.
          </p>
          <div className="mt-8">
            <Link href="#gradesCard" scroll={true}>
              <button className="bg-yellow-400 text-white py-3 px-8 sm:py-4 sm:px-10 rounded-full shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-transform duration-300 text-base sm:text-lg">
                Let&apos;s Get Started!
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800">Key Features</h2>
          <p className="text-gray-600 mt-4">Unlock new opportunities with our platform.</p>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-[#E0E7FF] p-5 sm:p-6 rounded-lg shadow-lg text-gray-800">
              <h3 className="text-lg sm:text-xl font-semibold">Interactive Lessons</h3>
              <p className="mt-2 text-sm sm:text-base">Engage with interactive content designed to make learning fun.</p>
            </div>
            <div className="bg-[#D1FAE5] p-5 sm:p-6 rounded-lg shadow-lg text-gray-800">
              <h3 className="text-lg sm:text-xl font-semibold">Expert Teachers</h3>
              <p className="mt-2 text-sm sm:text-base">Learn from the best instructors with years of experience.</p>
            </div>
            <div className="bg-[#FFEDD5] p-5 sm:p-6 rounded-lg shadow-lg text-gray-800">
              <h3 className="text-lg sm:text-xl font-semibold">Progress Tracking</h3>
              <p className="mt-2 text-sm sm:text-base">Monitor your progress with detailed reports and feedback.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="gradesCard" className="py-16 bg-gray-50">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-4xl font-extrabold text-blue-600 drop-shadow-lg">Explore Our Grades</h2>
          <p className="text-gray-600 mt-4 text-lg">Choose a grade to start your learning adventure!</p>
          <Suspense fallback={<SkeletonLoader />}>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {grades.map((grade, gradeIndex) => (
                <GradeCard
                  key={grade.gradeId}
                  grade={grade}
                  gradeIndex={gradeIndex}
                  borderColor={borderColors[gradeIndex % borderColors.length]}
                  subjectColorMapping={subjectColorMapping}
                  generateLink={generateLink}
                />
              ))}
            </div>
          </Suspense>
        </div>
      </section>
      
      <BackToTop />
    </HomePageClient>
  );
}
