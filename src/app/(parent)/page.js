import { lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

import BackToTop from "../components/ui/BackToTop";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import HomePageClient from "../components/HomePageClient";
const GradeCard = lazy(() => import("../components/ui/GradeCard"));
import db from '../data/db.json'; // Import from src/app/data/db.json

import HeroSection from "../components/ui/HeroSection";

export default async function HomePage() {
  const grades = db.grades;

  const gradeColors = [
    "#FF5722", // Deep Orange
    "#4CAF50", // Green
    "#2196F3", // Blue
    "#E91E63", // Pink
    "#9C27B0", // Purple
    "#FFC107", // Amber
    "#00BCD4", // Cyan
    "#8BC34A", // Light Green
  ];

  return (
    <HomePageClient>
      <HeroSection />

      {/* Stats Section / By the Numbers */}
      <section className="py-12 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-blue-600 mb-1">1-8</div>
              <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Active Grades</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-cyan-500 mb-1">360+</div>
              <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Learning Levels</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-purple-500 mb-1">10k+</div>
              <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Happy Kids</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-black text-orange-500 mb-1">4.9/5</div>
              <div className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest">Avg. Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Master Every Subject <span className="text-blue-600">With Joy</span></h2>
            <p className="text-slate-600 text-lg">Our portal is designed by educators to ensure your child stays engaged, motivated, and ahead of the curve.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-3xl border-2 border-slate-50 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Interactive Journey</h3>
              <p className="text-slate-600 leading-relaxed">Gamified lessons that turn complex concepts into fun adventures. Kids don't just learn; they play and grow.</p>
            </div>

            <div className="group bg-white p-8 rounded-3xl border-2 border-slate-50 hover:border-green-100 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">👩‍🏫</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Expert Curriculum</h3>
              <p className="text-slate-600 leading-relaxed">Aligned with national standards for grades 1-8, developed by top-tier educators with decades of experience.</p>
            </div>

            <div className="group bg-white p-8 rounded-3xl border-2 border-slate-50 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Real-time Insights</h3>
              <p className="text-slate-600 leading-relaxed">Track every milestone with a detailed parent dashboard. See exactly where your child excels and where they need a boost.</p>
            </div>
          </div>

          {/* Testimonial Snippet */}
          <div className="mt-20 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14C19.017 11.2386 16.7784 9 14.017 9V6C18.4353 6 22.017 9.58172 22.017 14V21H14.017ZM2.017 21L2.017 18C2.017 16.8954 2.91243 16 4.017 16H7.017V14C7.017 11.2386 4.77843 9 2.017 9V6C6.43528 6 10.017 9.58172 10.017 14V21H2.017Z" /></svg>
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xl">★</span>
                ))}
              </div>
              <p className="text-xl md:text-2xl font-medium mb-8 leading-relaxed italic">
                "My son used to struggle with math, but since joining KidsPortal, he asks to 'play math' every single day. The progress is night and day!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center font-bold text-lg mr-4">S</div>
                <div>
                  <div className="font-bold">Sarah Jenkins</div>
                  <div className="text-blue-300 text-sm">Parent of 3rd Grader</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gradesCard" className="py-24 bg-gradient-to-b from-blue-50/50 to-white relative overflow-hidden">
        {/* Playful background blobs (framer motion alternative via CSS) */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 -left-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>

        <div className="container mx-auto text-center px-4 relative z-10">
          <div className="inline-block mb-4 px-6 py-2 bg-white rounded-full shadow-sm border border-slate-100">
            <span className="text-xl">🎒</span> <span className="font-bold text-slate-600 tracking-wide uppercase text-sm ml-2">Learning Path</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Curriculum</span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-16">
            Click on a grade below to dive into our interactive subjects and preview the fun challenges waiting for your child!
          </p>
          <Suspense fallback={<SkeletonLoader variant="grid" />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {grades.map((grade, gradeIndex) => (
                <GradeCard
                  key={grade.gradeId}
                  grade={grade}
                  gradeIndex={gradeIndex}
                  themeColor={gradeColors[gradeIndex % gradeColors.length]}
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
