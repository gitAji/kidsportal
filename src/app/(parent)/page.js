import { lazy, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaRobot, FaClock, FaCertificate, FaChartLine,
  FaShieldAlt, FaBookOpen, FaSmile,
} from "react-icons/fa";

import BackToTop from "../components/ui/BackToTop";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import HomePageClient from "../components/HomePageClient";
const CurriculumShowcase = lazy(() => import("../components/ui/CurriculumShowcase"));
import db from '../data/db.json'; // Import from src/app/data/db.json

import HeroSection from "../components/ui/HeroSection";

// Real, verified capabilities only — nothing here that isn't actually
// shipped in the product.
const FEATURES = [
  {
    icon: FaRobot,
    title: "AI Learning Assistant",
    description: "A built-in AI tutor guides every lesson, quiz, and exam — explaining concepts and answering questions in real time, whenever your child gets stuck.",
    color: "indigo",
    size: "hero",
  },
  {
    icon: FaClock,
    title: "Parental Time Controls",
    description: "Set daily and weekly time limits per child. Once time's up, they can ask for more — and you decide.",
    color: "blue",
    size: "tall",
  },
  {
    icon: FaCertificate,
    title: "Certificates of Achievement",
    description: "Downloadable Gold, Silver & Bronze certificates once real progress is made.",
    color: "amber",
    size: "tall",
  },
  {
    icon: FaChartLine,
    title: "Real Progress Analytics",
    description: "See exactly what's been completed, when, and how well — tasks, levels, XP, and weekly trends, all from real activity.",
    color: "violet",
    size: "wide",
  },
  {
    icon: FaShieldAlt,
    title: "Zero Ads, Zero Distractions",
    description: "No ads. No third-party links. Nothing on screen except learning.",
    color: "emerald",
    size: "wide",
  },
  {
    icon: FaBookOpen,
    title: "Ever-Growing Curriculum",
    description: "10 grades and multiple subjects — from English and Math to Coding — regularly expanded by our curriculum team.",
    color: "cyan",
    size: "wide",
  },
  {
    icon: FaSmile,
    title: "Built for Kids",
    description: "Playful, gamified, and safe by design — stickers, XP, avatars, and a friendly professor guide.",
    color: "rose",
    size: "wide",
  },
];

const FEATURE_COLORS = {
  indigo: { bg: "bg-indigo-50", iconBg: "bg-indigo-100", text: "text-indigo-600", groupHoverText: "group-hover:text-indigo-600", border: "hover:border-indigo-100 hover:border-b-indigo-500" },
  blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", text: "text-blue-600", groupHoverText: "group-hover:text-blue-600", border: "hover:border-blue-100 hover:border-b-blue-500" },
  amber: { bg: "bg-amber-50", iconBg: "bg-amber-100", text: "text-amber-600", groupHoverText: "group-hover:text-amber-600", border: "hover:border-amber-100 hover:border-b-amber-500" },
  violet: { bg: "bg-violet-50", iconBg: "bg-violet-100", text: "text-violet-600", groupHoverText: "group-hover:text-violet-600", border: "hover:border-violet-100 hover:border-b-violet-500" },
  emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", text: "text-emerald-600", groupHoverText: "group-hover:text-emerald-600", border: "hover:border-emerald-100 hover:border-b-emerald-500" },
  cyan: { bg: "bg-cyan-50", iconBg: "bg-cyan-100", text: "text-cyan-600", groupHoverText: "group-hover:text-cyan-600", border: "hover:border-cyan-100 hover:border-b-cyan-500" },
  rose: { bg: "bg-rose-50", iconBg: "bg-rose-100", text: "text-rose-600", groupHoverText: "group-hover:text-rose-600", border: "hover:border-rose-100 hover:border-b-rose-500" },
};

// Bento sizing on a 6-col grid: the AI hero tile spans 4 cols x 2 rows,
// the two "tall" tiles fill the remaining 2 cols (1 row each), and the
// four "wide" tiles pair up into two more rows of 3+3.
const FEATURE_SIZE_CLASSES = {
  hero: "md:col-span-4 md:row-span-2",
  tall: "md:col-span-2",
  wide: "md:col-span-3",
};

function FeatureTile({ feature }) {
  const c = FEATURE_COLORS[feature.color];
  const Icon = feature.icon;
  const isHero = feature.size === "hero";
  return (
    <div
      className={`group bg-white p-8 ${isHero ? "md:p-10" : ""} rounded-[2rem] border-2 border-slate-100 border-b-[6px] ${c.border} hover:-translate-y-1 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden flex flex-col justify-center ${FEATURE_SIZE_CLASSES[feature.size]}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${c.bg} rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700 opacity-50`} />
      <div className={`${isHero ? "w-20 h-20 text-4xl" : "w-14 h-14 text-2xl"} ${c.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 relative z-10`}>
        <Icon className={c.text} />
      </div>
      <h3 className={`${isHero ? "text-3xl" : "text-xl"} font-black text-slate-800 mb-3 ${c.groupHoverText} transition-colors relative z-10`}>{feature.title}</h3>
      <p className={`text-slate-500 ${isHero ? "text-lg" : "text-sm"} leading-relaxed relative z-10 font-medium`}>{feature.description}</p>
    </div>
  );
}

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
      <section className="py-16 bg-white border-y border-slate-100 relative overflow-hidden">
        {/* Soft decorative blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-50/50 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center group p-6 rounded-3xl bg-white border-2 border-slate-50 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-500 mb-2 group-hover:scale-105 transition-transform">1-8</div>
              <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Active Grades</div>
            </div>
            <div className="text-center group p-6 rounded-3xl bg-white border-2 border-slate-50 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-cyan-100 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-teal-400 mb-2 group-hover:scale-105 transition-transform">360+</div>
              <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Learning Levels</div>
            </div>
            <div className="text-center group p-6 rounded-3xl bg-white border-2 border-slate-50 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-purple-100 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-fuchsia-500 mb-2 group-hover:scale-105 transition-transform">10k+</div>
              <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Happy Kids</div>
            </div>
            <div className="text-center group p-6 rounded-3xl bg-white border-2 border-slate-50 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-orange-100 hover:-translate-y-1 transition-all duration-300">
              <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-amber-500 mb-2 group-hover:scale-105 transition-transform">4.9/5</div>
              <div className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Avg. Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-32 bg-slate-50 relative border-t border-slate-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-sm font-bold uppercase tracking-wider">
              <span>🚀</span> For Parents & Kids
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 tracking-tight leading-tight">
              Master Every Subject <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">With Absolute Joy</span>
            </h2>
            <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
              Our portal is designed by educators to ensure your child stays engaged, motivated, and ahead of the curve.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 md:auto-rows-[minmax(220px,auto)] gap-6 px-2 md:px-0">
            {FEATURES.map((feature) => (
              <FeatureTile key={feature.title} feature={feature} />
            ))}
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
            Pick a grade to explore its subjects and preview the levels waiting for your child!
          </p>
          <Suspense fallback={<SkeletonLoader variant="grid" />}>
            <CurriculumShowcase grades={grades} themeColors={gradeColors} />
          </Suspense>
        </div>
      </section>

      <BackToTop />
    </HomePageClient>
  );
}
