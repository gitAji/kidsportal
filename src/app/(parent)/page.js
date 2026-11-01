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
import { SITE_URL, SITE_NAME } from "@/lib/seo";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
};

// Real, verified capabilities only — nothing here that isn't actually
// shipped in the product.
const FEATURES = [
  {
    icon: FaRobot,
    title: "AI Learning Assistant",
    description: "A built-in AI tutor guides every lesson, quiz, and exam — explaining concepts and answering questions in real time, whenever your child gets stuck.",
    color: "indigo",
  },
  {
    icon: FaClock,
    title: "Parental Time Controls",
    description: "Set daily and weekly time limits per child. Once time's up, they can ask for more — and you decide.",
    color: "blue",
  },
  {
    icon: FaCertificate,
    title: "Certificates of Achievement",
    description: "Downloadable Gold, Silver & Bronze certificates once real progress is made.",
    color: "amber",
  },
  {
    icon: FaChartLine,
    title: "Real Progress Analytics",
    description: "See exactly what's been completed, when, and how well — tasks, levels, XP, and weekly trends, all from real activity.",
    color: "violet",
  },
  {
    icon: FaShieldAlt,
    title: "Zero Ads, Zero Distractions",
    description: "No ads. No third-party links. Nothing on screen except learning.",
    color: "emerald",
  },
  {
    icon: FaBookOpen,
    title: "Ever-Growing Curriculum",
    description: "10 grades and multiple subjects — from English and Math to Coding — regularly expanded by our curriculum team.",
    color: "cyan",
  },
  {
    icon: FaSmile,
    title: "Built for Kids",
    description: "Playful, gamified, and safe by design — stickers, XP, avatars, and a friendly professor guide.",
    color: "rose",
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
  indigo: { bg: "bg-indigo-50", iconBg: "bg-indigo-100", text: "text-indigo-600", groupHoverText: "group-hover:text-indigo-600", border: "hover:border-indigo-200" },
  blue: { bg: "bg-blue-50", iconBg: "bg-blue-100", text: "text-blue-600", groupHoverText: "group-hover:text-blue-600", border: "hover:border-blue-200" },
  amber: { bg: "bg-amber-50", iconBg: "bg-amber-100", text: "text-amber-600", groupHoverText: "group-hover:text-amber-600", border: "hover:border-amber-200" },
  violet: { bg: "bg-violet-50", iconBg: "bg-violet-100", text: "text-violet-600", groupHoverText: "group-hover:text-violet-600", border: "hover:border-violet-200" },
  emerald: { bg: "bg-emerald-50", iconBg: "bg-emerald-100", text: "text-emerald-600", groupHoverText: "group-hover:text-emerald-600", border: "hover:border-emerald-200" },
  cyan: { bg: "bg-cyan-50", iconBg: "bg-cyan-100", text: "text-cyan-600", groupHoverText: "group-hover:text-cyan-600", border: "hover:border-cyan-200" },
  rose: { bg: "bg-rose-50", iconBg: "bg-rose-100", text: "text-rose-600", groupHoverText: "group-hover:text-rose-600", border: "hover:border-rose-200" },
};

function FeatureTile({ feature }) {
  const c = FEATURE_COLORS[feature.color];
  const Icon = feature.icon;
  return (
    <div className={`group flex gap-4 bg-white p-6 rounded-2xl border-2 border-slate-100 ${c.border} hover:-translate-y-0.5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgb(0,0,0,0.06)] transition-all duration-300`}>
      <div className={`flex-shrink-0 w-12 h-12 text-xl ${c.iconBg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={c.text} />
      </div>
      <div>
        <h3 className={`text-base font-black text-slate-800 mb-1.5 ${c.groupHoverText} transition-colors`}>{feature.title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.description}</p>
      </div>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
      />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
