"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const Breadcrumb = ({ path, text }) => {
  const router = useRouter();

  const handleClick = (e) => {
    e.preventDefault();
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };

  return (
    <div className="mb-4">
      <a 
        href={path || '#'} 
        onClick={handleClick} 
        className="text-sm font-semibold text-gray-600 hover:text-blue-600 flex items-center"
      >
        <FaArrowLeft className="mr-2" />
        {text}
      </a>
    </div>
  );
};

export default Breadcrumb;
