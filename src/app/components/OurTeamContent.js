"use client";
import React from 'react';
import { FaUserTie, FaCode, FaPaintBrush, FaGraduationCap, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    id: 'member1',
    name: 'Jane Doe',
    role: 'Lead Educator',
    icon: <FaGraduationCap />,
    color: "bg-orange-500",
    bio: 'Jane has over 15 years of experience in early child education and curriculum design.',
  },
  {
    id: 'member2',
    name: 'John Smith',
    role: 'Lead Developer',
    icon: <FaCode />,
    color: "bg-blue-500",
    bio: 'John is a full-stack architect passionate about building safe and fast educational tools.',
  },
  {
    id: 'member3',
    name: 'Emily White',
    role: 'Creative Designer',
    icon: <FaPaintBrush />,
    color: "bg-purple-500",
    bio: 'Emily creates the vibrant, child-friendly visuals that make KidsPortal so inviting.',
  },
  {
    id: 'member4',
    name: 'David Green',
    role: 'Product Lead',
    icon: <FaUserTie />,
    color: "bg-green-500",
    bio: 'David ensures our learning paths align with global education standards.',
  },
];

export default function OurTeamContent({ onClose }) {
  return (
    <div className="relative h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 sticky top-0 z-10 flex items-center justify-between backdrop-blur-md">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Meet the Team</h2>
          <p className="text-slate-500 font-medium text-sm md:text-base">The passionate minds behind the magic</p>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-8 py-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-[2.5rem] p-6 border border-slate-100 hover:border-blue-400 hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-5">
                  <div className={`w-16 h-16 rounded-3xl ${member.color} flex items-center justify-center text-white text-2xl shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                    {member.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-black text-slate-800">{member.name}</h3>
                    <p className="text-blue-600 font-bold text-sm mb-3 tracking-wide uppercase">{member.role}</p>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                      {member.bio}
                    </p>
                    <div className="flex gap-3">
                      <button className="text-slate-300 hover:text-blue-600 transition-colors"><FaLinkedin /></button>
                      <button className="text-slate-300 hover:text-blue-400 transition-colors"><FaTwitter /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Join Us CTA */}
          <div className="mt-12 text-center py-10 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-300">
            <h4 className="text-lg font-black text-slate-800 mb-2">Want to join us?</h4>
            <p className="text-slate-500 text-sm mb-6">We&apos;re always looking for brilliant minds in education and tech.</p>
            <button className="text-blue-600 font-bold hover:underline">View open positions →</button>
          </div>
        </div>
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
      `}</style>
    </div>
  );
}
