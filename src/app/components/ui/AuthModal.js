"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLock, faUser, faTimes, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "../../../firebase/auth";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthModal({
  isModalOpen,
  setIsModalOpen,
  isRegister,
  setIsRegister,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isModalOpen]);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isRegister) {
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
          setError("All fields are required.");
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setIsLoading(false);
          return;
        }
        await signUpWithEmail(email, password, `${firstName} ${lastName}`.trim(), () => setIsModalOpen(false));
      } else {
        await signInWithEmail(email, password);
        setIsModalOpen(false);
      }
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle(() => setIsModalOpen(false));
      router.push("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-[9999] p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
          >
            {/* Header with Background Gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white relative">
              <button
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                onClick={() => setIsModalOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} className="text-xl" />
              </button>

              <h3 className="text-3xl font-black mb-2">
                {isRegister ? "Start Your Journey" : "Welcome Back!"}
              </h3>
              <p className="text-blue-100 text-sm font-medium">
                {isRegister
                  ? "Join the smartest learning community for kids."
                  : "Pick up where you left off and keep learning."}
              </p>
            </div>

            <div className="p-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100 font-medium text-center"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleEmailAuth} className="space-y-4">
                <AnimatePresence mode="wait">
                  {isRegister && (
                    <motion.div
                      key="register-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">First Name</label>
                        <div className="relative">
                          <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                          <input
                            type="text"
                            className="bg-slate-50 border-2 border-slate-100 rounded-2xl w-full py-3.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                            placeholder="Alex"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Last Name</label>
                        <div className="relative">
                          <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                          <input
                            type="text"
                            className="bg-slate-50 border-2 border-slate-100 rounded-2xl w-full py-3.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                            placeholder="Smith"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email Address</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="email"
                      className="bg-slate-50 border-2 border-slate-100 rounded-2xl w-full py-3.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
                  <div className="relative">
                    <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="password"
                      className="bg-slate-50 border-2 border-slate-100 rounded-2xl w-full py-3.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {isRegister && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirm Password</label>
                    <div className="relative">
                      <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input
                        type="password"
                        className="bg-slate-50 border-2 border-slate-100 rounded-2xl w-full py-3.5 pl-10 pr-4 text-sm focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 rounded-2xl font-bold w-full transition-all hover:shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 mt-2 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isRegister ? "Create Account" : "Sign In"}</span>
                      <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-8 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100"></div>
                </div>
                <span className="relative px-4 bg-white text-xs font-bold text-slate-400 uppercase">Or continue with</span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={handleGoogleAuth}
                  disabled={isLoading}
                  className="bg-white text-slate-700 border-2 border-slate-100 py-3.5 rounded-2xl font-bold w-full flex items-center justify-center transition-all hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98]"
                >
                  <FontAwesomeIcon icon={faGoogle} className="text-red-500 mr-3 text-lg" />
                  Google
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-slate-500 font-medium">
                {isRegister
                  ? "Already have an account?"
                  : "New to KidsPortal?"}{" "}
                <button
                  className="text-blue-600 font-bold hover:underline"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister ? "Sign In" : "Register Now"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
