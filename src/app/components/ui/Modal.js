// app/src/components/ToggleModal.js

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from "../../../firebase/auth";
import { useRouter } from "next/navigation";

export default function ToggleModal({
  isModalOpen,
  setIsModalOpen,
  isRegister,
  setIsRegister,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await signUpWithEmail(email, password, () => setIsModalOpen(false));
      } else {
        await signInWithEmail(email, password, () => setIsModalOpen(false));
        setIsModalOpen(false);
      }
      router.push("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithGoogle(() => setIsModalOpen(false));
      setIsModalOpen(false);
      router.push("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVippsLogin = () => {
    console.log("Vipps login triggered");
    // Add Vipps login logic here later
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={() => setIsModalOpen(false)} // Close the modal on click
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-center">
              {isRegister ? "Register" : "Login"}
            </h3>
            <form onSubmit={handleEmailAuth}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="border border-gray-300 rounded w-full py-2 px-3"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="border border-gray-300 rounded w-full py-2 px-3"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
                >
                  {isRegister ? "Register" : "Login"}
                </button>
              </div>
            </form>

            <div className="flex items-center justify-center mt-4">
              <span className="bg-gray-300 h-px w-full"></span>
              <span className="text-gray-600 px-3">OR</span>
              <span className="bg-gray-300 h-px w-full"></span>
            </div>

            <div className="mt-4 text-center">
              <button
                className="bg-red-500 text-white py-2 px-4 rounded w-full flex items-center justify-center"
                onClick={handleGoogleAuth}
              >
                <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                Sign {isRegister ? "Up" : "In"} with Google
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                className="bg-orange-500 text-white py-2 px-4 rounded w-full flex items-center justify-center"
                onClick={handleVippsLogin} // Placeholder for Vipps integration
              >
                Sign {isRegister ? "Up" : "In"} with Vipps
              </button>
            </div>

            <p className="mt-4 text-center text-sm text-gray-600">
              {isRegister
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                className="text-blue-600 hover:underline"
                onClick={() => setIsRegister(!isRegister)} // Toggle between login and register
              >
                {isRegister ? "Login here" : "Register here"}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
