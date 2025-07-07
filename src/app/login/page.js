// src/app/login/page.js
"use client";
import { useState } from "react";
import { signInWithEmail, signInWithGoogle } from "../../firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmail(email, password);
      router.push("/"); // Redirect to home after successful login
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push("/"); // Redirect to home after successful login
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
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
    </div>
  );
}
