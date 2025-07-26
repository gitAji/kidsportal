"use client";
import React from 'react';
import Modal from '../ui/Modal';
import { FaTrophy, FaStar } from 'react-icons/fa';
import Lottie from "lottie-react";
import celebrationAnimation from '/public/animations/celebration.json';

const CompletionModal = ({ isOpen, onClose, results }) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-6 text-center relative">
        <Lottie 
          animationData={celebrationAnimation}
          loop={false}
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '200px',
          }}
        />
        <h2 className="text-3xl font-bold text-green-500 mt-20">Great Job!</h2>
        <p className="text-lg text-gray-600 mt-4">You&apos;ve completed the task!</p>
        
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <div className="flex items-center justify-center text-2xl font-bold text-yellow-500">
            <FaTrophy className="mr-2" />
            <span>+{results.pointsEarned} Points Earned</span>
          </div>
          {results.stickerAwarded && (
            <div className="flex items-center justify-center text-xl font-semibold text-purple-500 mt-2">
              <FaStar className="mr-2" />
              <span>New Sticker Unlocked!</span>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </Modal>
  );
};

export default CompletionModal;
