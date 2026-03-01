"use client";
import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function RightSidePanel({ children, isOpen, onClose, panelName }) {
  const panelRef = useRef(null);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[998]"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[450px] lg:w-[550px] h-full bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[999] overflow-hidden flex flex-col"
          >
            {/* Standard Close Button for all Panels */}
            <button
              className="absolute top-6 right-8 w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 hover:shadow-lg hover:scale-105 transition-all z-[1001] flex items-center justify-center shadow-sm"
              onClick={onClose}
              aria-label="Close Panel"
            >
              <FaTimes size={20} />
            </button>

            <div className="flex-grow overflow-y-auto custom-scrollbar h-full">
              {children}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
