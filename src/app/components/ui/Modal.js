"use client";
import React from 'react';

const Modal = ({ children, onClose, unstyled = false }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/60 backdrop-blur-sm overflow-y-auto h-full w-full flex justify-center items-center p-4">
      {unstyled ? (
        <div className="relative w-full max-w-xl mx-auto z-[101]">
          {/* We omit the built-in close button for unstyled to let the child manage its own or let it exist behind transparently if needed, 
              but actually it's good to keep an X button just in case. */}
          <div className="relative">
            {children}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors z-[102] text-3xl leading-none"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full relative z-[101]">
          <button
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
          {children}
        </div>
      )}
    </div>
  );
};

export default Modal;
