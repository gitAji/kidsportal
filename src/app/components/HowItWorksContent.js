"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaUserPlus,
  FaChild,
  FaRocket,
  FaTrophy,
  FaArrowRight,
  FaCheckCircle
} from "react-icons/fa";

const steps = [
  {
    title: "Parents Register",
    description: "Create your parent account in seconds. Access your secure dashboard to manage everything from one place.",
    icon: <FaUserPlus />,
    color: "bg-blue-500",
    shadow: "shadow-blue-200"
  },
  {
    title: "Add Children",
    description: "Create custom profiles for each child. Each profile gets its own unique learning path and fun avatar!",
    icon: <FaChild />,
    color: "bg-purple-500",
    shadow: "shadow-purple-200"
  },
  {
    title: "Start Learning",
    description: "Children log in to their fun Learning Zone. They explore subjects through interactive lessons and games.",
    icon: <FaRocket />,
    color: "bg-cyan-500",
    shadow: "shadow-cyan-200"
  },
  {
    title: "Level Up!",
    description: "As they complete tasks, they earn XP, collect badges, and unlock new exciting levels automatically.",
    icon: <FaTrophy />,
    color: "bg-yellow-500",
    shadow: "shadow-yellow-200"
  }
];

export default function HowItWorksContent({ onClose }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="relative h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 flex items-center justify-between backdrop-blur-md">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">How it Works</h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">Your child&apos;s journey to mastery in 4 easy steps</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-8 py-10 custom-scrollbar">
        <div className="max-w-xl mx-auto space-y-12 relative">
          {/* Vertical Line Connector */}
          <div className="absolute left-[27px] top-6 bottom-6 w-0.5 bg-slate-100" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative flex gap-8 group"
            >
              {/* Step Icon */}
              <div className={`relative z-10 w-14 h-14 rounded-[22px] flex-shrink-0 flex items-center justify-center text-white text-xl transition-transform duration-300 group-hover:scale-110 shadow-lg ${step.color} ${step.shadow}`}>
                {step.icon}
                {index < activeStep && (
                  <div className="absolute -right-2 -bottom-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-[10px]">
                    <FaCheckCircle />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="pt-2">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Step 0{index + 1}</span>
                  <div className="h-px w-8 bg-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bonus Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2.5rem] p-8 text-center border border-blue-100/50"
        >
          <div className="bg-white w-16 h-16 rounded-3xl flex items-center justify-center text-blue-500 text-2xl mx-auto mb-6 shadow-sm">
            <FaCheckCircle className="text-green-500" />
          </div>
          <h4 className="text-xl font-black text-slate-800 mb-3">Ready to transform learning?</h4>
          <p className="text-slate-600 font-medium mb-8 max-w-sm mx-auto">
            Join thousands of happy families who make learning an adventure every single day.
          </p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] transition-all flex items-center gap-2 mx-auto"
          >
            Let&apos;s Get Started <FaArrowRight />
          </button>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e2e8f0;
        }
      `}</style>
    </div>
  );
}
