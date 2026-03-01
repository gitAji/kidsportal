"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaRocket, FaCompass } from "react-icons/fa";
import Image from "next/image";

export default function ExitIntentModal({
  isOpen,
  onClose,
  setIsModalOpen,
  setIsRegister,
  isLoggedIn,
}) {
  const router = useRouter();

  if (isLoggedIn) return null;

  const handleRegisterClick = () => {
    onClose();
    setIsRegister(true);
    setIsModalOpen(true);
  };

  const handleExploreClick = () => {
    onClose();
    router.push("/#gradesCard");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-[99999] p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col md:flex-row"
          >
            {/* Left Side: Visuals */}
            <div className="md:w-5/12 bg-gradient-to-br from-blue-600 to-cyan-500 relative min-h-[200px] md:min-h-full overflow-hidden">
              <div className="absolute inset-0 bg-[url('/images/exit-intent.png')] bg-cover bg-center mix-blend-overlay opacity-30" />
              <div className="relative h-full w-full flex items-center justify-center p-8">
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 2, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative z-10 w-full aspect-square"
                >
                  <Image
                    src="/images/exit-intent.png"
                    alt="Fun Mascot"
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </motion.div>

                {/* Floating elements for "Pop" */}
                <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
                <div className="absolute bottom-10 right-10 w-3 h-3 bg-white rounded-full animate-bounce" />
              </div>
            </div>

            {/* Right Side: Content */}
            <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center relative bg-white">
              <button
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2"
                onClick={onClose}
              >
                <FaTimes className="text-xl" />
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-blue-600 font-black uppercase tracking-[3px] text-xs mb-3 block">Wait a moment!</span>
                  <h2 className="text-4xl font-black text-slate-900 leading-tight">
                    Don't leave the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Adventure</span> just yet!
                  </h2>
                </div>

                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  Your child is just one click away from unlocking <span className="text-blue-600 font-bold">360+ interactive levels</span> and
                  certified curriculum.
                </p>

                <div className="space-y-4 pt-4">
                  <button
                    onClick={handleRegisterClick}
                    className="w-full h-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <FaRocket className="text-xl" />
                    <span>Join the Adventure Free</span>
                  </button>

                  <button
                    onClick={handleExploreClick}
                    className="w-full h-16 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl font-black text-lg hover:border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <FaCompass className="text-xl" />
                    <span>Explore Our Curriculum</span>
                  </button>
                </div>

                <p className="text-center text-slate-400 text-xs font-bold pt-4">
                  Trusted by 10,000+ happy families worldwide
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
