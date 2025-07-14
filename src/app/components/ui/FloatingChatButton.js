"use client";

import { useState } from 'react';
import { FaCommentDots } from 'react-icons/fa';
import Chat from './Chat';

const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isChatOpen && (
        <div className="mb-4">
          <Chat onClose={() => setIsChatOpen(false)} />
        </div>
      )}
      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        aria-label="Open chat"
      >
        <FaCommentDots className="text-2xl" />
      </button>
    </div>
  );
};

export default FloatingChatButton;
