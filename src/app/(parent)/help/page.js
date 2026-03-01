"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaQuestionCircle,
  FaUserCog,
  FaShieldAlt,
  FaCreditCard,
  FaEnvelope,
  FaChevronDown,
  FaLightbulb,
  FaRocket,
  FaUserPlus,
  FaChild,
  FaTrophy,
  FaLaptopCode,
  FaChalkboardTeacher
} from "react-icons/fa";
import BackToTop from "@/app/components/ui/BackToTop";

const categories = [
  { id: "getting-started", name: "Journey Start", icon: <FaRocket />, color: "bg-blue-500", shadow: "shadow-blue-200" },
  { id: "account", name: "Family Settings", icon: <FaUserCog />, color: "bg-purple-500", shadow: "shadow-purple-200" },
  { id: "billing", name: "Plans & Rewards", icon: <FaCreditCard />, color: "bg-green-500", shadow: "shadow-green-200" },
  { id: "safety", name: "Safety Harbor", icon: <FaShieldAlt />, color: "bg-red-500", shadow: "shadow-red-200" },
];

const steps = [
  {
    title: "1. Create Account",
    desc: "Parents sign up and set up the secure learning environment.",
    icon: <FaUserPlus />,
    color: "from-blue-500 to-indigo-600"
  },
  {
    title: "2. Add Learners",
    desc: "Create unique profiles for each child with fun avatars and custom paths.",
    icon: <FaChild />,
    color: "from-purple-500 to-pink-600"
  },
  {
    title: "3. Dive into Lessons",
    desc: "Children explore interactive curriculum tailored to their level.",
    icon: <FaLaptopCode />,
    color: "from-cyan-500 to-blue-600"
  },
  {
    title: "4. Earn Rewards",
    desc: "Watch them grow as they collect stickers, XP, and real mastery!",
    icon: <FaTrophy />,
    color: "from-yellow-500 to-orange-600"
  }
];

const faqs = [
  {
    category: "getting-started",
    question: "How do I start my child's learning journey?",
    answer: "It's easy! First, register your parent account. From your dashboard, click 'Add Child' to create a learner profile. Your child can then log in using the unique credentials you set for them."
  },
  {
    category: "account",
    question: "How can I manage my child's account?",
    answer: "Everything is controlled from your secure Parent Dashboard. You can update their mission credentials, customize their avatar, and see their learning progress in real-time."
  },
  {
    category: "billing",
    question: "What's the difference between Free and Premium?",
    answer: "The Free plan includes the first two 'Missions' of every subject. Premium unlocks the full world of learning—hundreds of lessons, advanced analytics, and deeper student insights."
  },
  {
    category: "getting-started",
    question: "Which devices are supported for learning?",
    answer: "KidsPortal is built for the modern world. It works beautifully on tablets (iPad/Android), laptops, and desktop computers. Progress is saved automatically regardless of the device used."
  },
  {
    category: "safety",
    question: "Is the learning environment secure?",
    answer: "Yes, 100%. KidsPortal is a digital safe-haven. There are no ads, no external chat, and no tracking. We focus entirely on providing a pure, distracted-free learning experience."
  }
];

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className="mb-4">
      <button
        onClick={onClick}
        className={`w-full p-6 text-left rounded-3xl transition-all flex items-center justify-between group ${isOpen ? "bg-blue-50 ring-2 ring-blue-500" : "bg-slate-50 hover:bg-white hover:shadow-lg border border-transparent hover:border-slate-100"
          }`}
      >
        <span className={`text-lg font-black tracking-tight ${isOpen ? "text-blue-700" : "text-slate-800"}`}>
          {faq.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className={isOpen ? "text-blue-500" : "text-slate-400"}
        >
          <FaChevronDown />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-4">
              <p className="text-slate-600 leading-relaxed font-medium text-lg">
                {faq.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-blue-600 rounded-full blur-[160px] opacity-20" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-purple-600 rounded-full blur-[160px] opacity-20" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-black tracking-widest uppercase mb-8"
          >
            <FaQuestionCircle /> Help Center
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight"
          >
            How can we <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">help you today?</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-y-0 left-6 flex items-center text-slate-500 group-focus-within:text-blue-500 transition-colors">
              <FaSearch className="text-xl" />
            </div>
            <input
              type="text"
              placeholder="Search for articles, guides, or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-6 pl-16 pr-8 rounded-[2.5rem] bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all text-xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">How KidsPortal Works</h2>
            <p className="text-slate-500 font-medium max-w-lg mx-auto">Discover how we make learning an adventure for your children in 4 simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-[3rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all group"
              >
                <div className={`w-16 h-16 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">{step.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{step.desc}</p>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-slate-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedCategory(cat.id === selectedCategory ? "all" : cat.id)}
                className={`p-8 rounded-[3rem] text-center transition-all ${selectedCategory === cat.id
                  ? "bg-white shadow-2xl ring-4 ring-blue-500 scale-105"
                  : "bg-white shadow-xl hover:shadow-2xl border border-slate-100"
                  }`}
              >
                <div className={`${cat.color} w-16 h-16 rounded-[2rem] flex items-center justify-center text-white text-2xl mx-auto mb-6 shadow-xl ${cat.shadow}`}>
                  {cat.icon}
                </div>
                <h3 className="font-black text-slate-800 text-lg tracking-tight">{cat.name}</h3>
              </motion.button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto mt-24">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Common Questions</h2>
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-bold hover:bg-blue-100 transition-colors"
                >
                  Show All Questions
                </button>
              )}
            </div>

            <div className="space-y-4">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => (
                  <FAQItem
                    key={index}
                    faq={faq}
                    isOpen={activeFaq === index}
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  />
                ))
              ) : (
                <div className="py-24 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <span className="text-6xl mb-6 block">🔎</span>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Subject mission not found</h3>
                  <p className="text-slate-500 font-medium">Try different keywords or check out another category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-5xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <FaChalkboardTeacher size={300} />
            </div>

            <div className="relative z-10">
              <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center text-slate-900 text-2xl mx-auto mb-8 shadow-lg shadow-yellow-400/20">
                <FaChalkboardTeacher />
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Need a helping hand?</h2>
              <p className="text-slate-400 text-xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                Connect with our education success team. Whether it&apos;s a technical hurdle or a learning path question, we&apos;re here for your family.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href="mailto:help@kidsportal.com"
                  className="w-full sm:w-auto bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-50 transition-all shadow-xl"
                >
                  <FaEnvelope className="text-blue-500" /> Ask a Teacher
                </a>
                <button className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-12 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all">
                  Open Support Portal
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BackToTop />
    </div>
  );
}
