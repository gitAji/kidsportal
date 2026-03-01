"use client";

import Link from "next/link";
import Image from "next/image";
import { FaCompass, FaArrowLeft, FaHome, FaQuestionCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      {/* Logo in top left */}
      <div className="absolute top-8 left-8 z-50">
        <Link href="/">
          <div className="relative w-[200px] h-[60px] transition-transform hover:scale-105 active:scale-95">
            <Image
              src="/logo.png"
              alt="KidsPortal"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-50/50 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10 pt-20 lg:pt-0">
        {/* Left Column: Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-6"
          >
            <FaQuestionCircle className="w-3 h-3" />
            <span>Path Not Found</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-none mb-6">
            Oops! <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Lost?</span>
          </h1>

          <p className="text-slate-500 text-xl font-medium mb-10 leading-relaxed max-w-md mx-auto lg:mx-0">
            It looks like this page took a wrong turn at the learning adventure! Don't worry, even explorers get lost sometimes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="/"
              className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.3)] hover:-translate-y-1 transition-all duration-300"
            >
              <FaHome className="text-lg" />
              Back to Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-100 text-slate-600 font-bold rounded-2xl shadow-lg shadow-slate-200/50 hover:bg-slate-50 transition-all duration-300 group"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Right Column: Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 p-4">
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative rounded-[60px] overflow-hidden shadow-2xl shadow-blue-500/20 group"
            >
              <Image
                src="/images/exit-intent.png"
                alt="Lost Mascot"
                width={500}
                height={500}
                className="w-full h-auto transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none" />
            </motion.div>

            {/* Floating Decorations */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full blur-2xl opacity-50"
            />
            <motion.div
              animate={{ y: [0, 30, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-cyan-100 to-blue-200 rounded-full blur-3xl opacity-40"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
