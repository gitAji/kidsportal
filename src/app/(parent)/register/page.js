"use client";
import { useState } from "react";
import { signUpWithEmail, signInWithGoogle } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }

    try {
      await signUpWithEmail(email, password, name);
      router.push("/"); // Redirect to home after successful registration
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    try {
      await signInWithGoogle();
      router.push("/"); // Redirect to home after successful registration
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVippsRegister = () => {
    console.log("Vipps registration triggered");
    // Add Vipps registration logic here later
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto w-full sm:w-96 relative">
          <h3 className="page-heading mb-4 text-center">Register</h3>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleEmailRegister}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="border border-gray-300 rounded w-full py-2 px-3 text-gray-900"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
                className="border border-gray-300 rounded w-full py-2 px-3 text-gray-900"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                className="border border-gray-300 rounded w-full py-2 px-3 text-gray-900"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="border border-gray-300 rounded w-full py-2 px-3 text-gray-900"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                <span className="ml-2 text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 w-full"
              >
                Register
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
              onClick={handleGoogleRegister}
            >
              <FontAwesomeIcon icon={faGoogle} className="mr-2" />
              Sign Up with Google
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              className="bg-orange-500 text-white py-2 px-4 rounded w-full flex items-center justify-center"
              onClick={handleVippsRegister} // Placeholder for Vipps integration
            >
              Sign Up with Vipps
            </button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
