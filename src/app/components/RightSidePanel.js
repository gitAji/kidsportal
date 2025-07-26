'use client';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

export default function RightSidePanel({ children, isOpen, onClose, panelName }) {
  const panelRef = useRef(null);

  

  console.log(`RightSidePanel (${panelName}) rendering. isOpen:`, isOpen);
  return (
    <div
      ref={panelRef}
      className="info-box fixed top-0 right-0 w-full md:w-1/3 h-full bg-white p-6 pb-12 shadow-lg transform transition-all duration-300 ease-in-out overflow-y-auto"
      style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
    >
      <div className="relative h-full flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl p-2 rounded-full hover:bg-gray-100 bg-white z-50"
          onClick={onClose}
          aria-label="Close Panel"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        {children}
      </div>
    </div>
  );
}
