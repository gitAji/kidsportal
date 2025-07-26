"use client";
import React from 'react';
import Image from 'next/image';
import { FaUserCircle, FaPaw, FaRocket, FaCar, FaTree, FaSmile } from 'react-icons/fa';

const avatarIcons = {
  paw: <FaPaw />,
  rocket: <FaRocket />,
  car: <FaCar />,
  tree: <FaTree />,
  smile: <FaSmile />,
  default: <FaUserCircle />,
};

const CustomAvatar = ({ child, size }) => {
  if (child.photoURL) {
    return <Image src={child.photoURL} alt={child.name} width={64} height={64} className="rounded-full object-cover" />;
  }

  const Icon = avatarIcons[child.avatar] || avatarIcons.default;
  return <div className={`w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center ${size}`}>{Icon}</div>;
};

export default CustomAvatar;