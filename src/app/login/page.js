// src/app/login/page.js
"use client";
import { useState } from "react";
import { signInWithEmail, signInWithGoogle } from "../../firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmail(email, password);
      router.push("/"); // Redirect to home after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithGoogle();
      router.push("/"); // Redirect to home after successful login
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto w-full sm:w-80">
          <h2 className="page-heading mb-4 text-center">Login</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleEmailLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-4"
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded w-full mb-2"
            >
              Sign In with Email
            </button>
          </form>
          <button
            onClick={handleGoogleLogin}
            className="bg-red-600 text-white py-2 px-4 rounded w-full mb-2"
          >
            Sign In with Google
          </button>
          {/* Add Vipps login button here if needed */}
          <p className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
