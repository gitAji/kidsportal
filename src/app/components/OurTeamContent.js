'use client';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserTie,
  faLightbulb,
  faCode,
  faPaintBrush,
} from '@fortawesome/free-solid-svg-icons';

const teamMembers = [
  {
    id: 'member1',
    name: 'Jane Doe',
    role: 'Lead Educator',
    icon: faUserTie,
    bio: 'Jane is passionate about early childhood education and has over 15 years of experience designing engaging learning programs for children.',
  },
  {
    id: 'member2',
    name: 'John Smith',
    role: 'Lead Developer',
    icon: faCode,
    bio: 'John is a software engineering wizard who loves building interactive and robust platforms. He ensures KidsPortal runs smoothly and efficiently.',
  },
  {
    id: 'member3',
    name: 'Emily White',
    role: 'Creative Designer',
    icon: faPaintBrush,
    bio: 'Emily brings KidsPortal to life with her vibrant designs and intuitive user interfaces. Her creativity makes learning a visual delight.',
  },
  {
    id: 'member4',
    name: 'David Green',
    role: 'Content Strategist',
    icon: faLightbulb,
    bio: 'David is responsible for curating and developing the rich educational content on KidsPortal, ensuring it aligns with learning objectives and keeps children curious.',
  },
];

export default function OurTeamContent({ onClose }) {
  return (
    <div className="relative h-full flex flex-col p-4">
      <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-800">Our Team</h2>
      <div className="space-y-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <FontAwesomeIcon
              icon={member.icon}
              className="text-purple-500 text-3xl mr-4"
            />
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
              <p className="text-md text-gray-600">{member.role}</p>
              <p className="text-sm text-gray-700 mt-1">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
