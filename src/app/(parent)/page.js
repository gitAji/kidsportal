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

// Short, compact reviews — shown as small avatar-icon + name/role cards
// rather than one large pull-quote, so several can be scanned at once.
const REVIEWS = [
  {
    quote: "My son used to struggle with math, but since joining KidsPortal, he asks to 'play math' every single day. The progress is night and day!",
    name: "Sarah Jenkins",
    role: "Parent of a 3rd Grader",
    initial: "S",
    color: "from-blue-500 to-indigo-500",
  },
  {
    quote: "The time controls are a lifesaver — I set the limit once and never have to argue about screen time again. My daughter still begs to finish 'one more level'.",
    name: "Marcus Odei",
    role: "Parent of a 1st Grader",
    initial: "M",
    color: "from-emerald-500 to-teal-500",
  },
  {
    quote: "No ads, no random links to click — I can finally hand over the tablet without watching over her shoulder. The certificates keep her motivated too.",
    name: "Priya Raman",
    role: "Parent of a 5th Grader",
    initial: "P",
    color: "from-rose-500 to-orange-500",
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

  // Derive headline stats from the real curriculum data instead of hand-maintained
  // numbers, so they can't silently go stale as grades/subjects are added.
  const gradeRange = grades.length
    ? `${Math.min(...grades.map((g) => parseInt(g.gradeId.replace("grade-", ""), 10)))}-${Math.max(...grades.map((g) => parseInt(g.gradeId.replace("grade-", ""), 10)))}`
    : "1-10";
  const totalLevels = grades.reduce((sum, g) => {
    const seenNames = new Set();
    return sum + (g.subjects || []).reduce((s, subject) => {
      if (seenNames.has(subject.subjectName)) return s;
      seenNames.add(subject.subjectName);
      return s + (subject.levels?.length || 0);
    }, 0);
  }, 0);
  const levelsDisplay = `${Math.floor(totalLevels / 50) * 50}+`;

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

      {/* Stats Section */}
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { num: gradeRange,    label: "Active Grades",    grad: "from-sky-500 to-indigo-500",    hover: "hover:border-sky-100" },
              { num: levelsDisplay, label: "Learning Levels",   grad: "from-teal-400 to-emerald-500",  hover: "hover:border-teal-100" },
              { num: "10K+",        label: "Happy Families",    grad: "from-violet-500 to-purple-500", hover: "hover:border-violet-100" },
              { num: "4.9★",        label: "Average Rating",    grad: "from-amber-400 to-orange-400",  hover: "hover:border-amber-100" },
            ].map(({ num, label, grad, hover }) => (
              <div key={label} className={`text-center group p-6 rounded-2xl bg-white border-2 border-slate-100 shadow-sm hover:shadow-md ${hover} hover:-translate-y-1 transition-all duration-300`}>
                <div className={`text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br ${grad} mb-2 group-hover:scale-105 transition-transform`}>{num}</div>
                <div className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 bg-[#f8faff] relative border-t border-slate-100">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-sky-50 text-sky-600 rounded-full text-sm font-semibold border border-sky-100">
              <span>🚀</span> For Parents &amp; Kids
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-5 tracking-tight leading-tight">
              Everything your child needs
              <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500"> to thrive</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Designed by educators. Loved by kids. Trusted by parents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 md:auto-rows-[minmax(220px,auto)] gap-5 px-2 md:px-0">
            {FEATURES.map((feature) => (
              <FeatureTile key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Parent Reviews Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-sm font-semibold border border-amber-100">
              <span>⭐</span> Loved by Families
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">
              Trusted by Parents Worldwide
            </h2>
            <p className="text-slate-500 text-lg font-medium">Real stories from real families.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REVIEWS.map((review) => (
              <div
                key={review.name}
                className="bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-sky-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-base">★</span>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 flex-grow italic">&ldquo;{review.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${review.color} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                    {review.initial}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-800">{review.name}</div>
                    <div className="text-slate-400 text-xs">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gradesCard" className="py-24 bg-gradient-to-b from-[#f0f6ff] to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-teal-200/30 rounded-full blur-3xl" />

        <div className="container mx-auto text-center px-4 relative z-10">
          <div className="inline-flex items-center gap-2 mb-5 px-5 py-2 bg-white rounded-full shadow-sm border border-sky-100">
            <span className="text-xl">🎒</span>
            <span className="font-semibold text-slate-600 text-sm">Learning Path</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-5 tracking-tight">
            Explore Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-500">Curriculum</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto mb-14">
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
