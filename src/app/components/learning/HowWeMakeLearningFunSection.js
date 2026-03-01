"use client";
import React from 'react';
import { motion } from "framer-motion";
import { FaGamepad, FaTrophy, FaPalette, FaMagic } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

const features = [
  {
    icon: <FaGamepad size={32} />,
    title: 'Game-Like Adventures',
    description: 'We turn learning into a journey with visual paths and interactive challenges that feel like playing a game.',
    color: 'from-blue-500/20 to-blue-600/20',
    iconColor: 'text-blue-600'
  },
  {
    icon: <FaTrophy size={32} />,
    title: 'Rewards & Collectibles',
    description: "Children earn points and unlock cool stickers for completing tasks, giving them a sense of accomplishment.",
    color: 'from-amber-500/20 to-amber-600/20',
    iconColor: 'text-amber-600'
  },
  {
    icon: <FaPalette size={32} />,
    title: 'Avatar Customization',
    description: "Kids can spend their points in the Avatar Shop to personalize their character and express their creativity.",
    color: 'from-purple-500/20 to-purple-600/20',
    iconColor: 'text-purple-600'
  }
];

const HowWeMakeLearningFunSection = () => {
  return (
    <section className="relative">
      <div className="text-center mb-16 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-6"
        >
          <HiSparkles className="w-3 h-3" />
          <span>The KidsPortal Magic</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
          How We Make <br className="md:hidden" />
          <span className="text-blue-600">Learning Fun</span>
        </h2>
        <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
          Our platform is more than just lessons; it's an immersive experience designed to keep kids engaged and excited.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="bg-white border border-slate-100 p-10 rounded-[40px] shadow-xl shadow-slate-200/50 h-full transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 relative overflow-hidden">
              {/* Decorative Background Blob */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${feature.color} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${feature.color} ${feature.iconColor} transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                {feature.icon}
              </div>

              <h3 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
                {feature.title}
              </h3>

              <p className="text-slate-500 font-medium leading-relaxed">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowWeMakeLearningFunSection;