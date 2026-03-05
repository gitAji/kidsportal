"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { app } from "../../../firebase/config";
import { getFirestore } from "firebase/firestore";
import Image from 'next/image';

export default function ChildLoginForm() {
  const db = getFirestore(app);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if the user is already logged in
    const storedChildUser = localStorage.getItem("childUser") || sessionStorage.getItem("childUser");
    if (storedChildUser) {
      router.push("/learning-zone");
      return;
    }

    const childUsername = searchParams.get('username');
    if (childUsername) {
      setUsername(childUsername);
    }
  }, [searchParams, router]);

  const handleChildLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username || !password) {
      setError("Please enter both username and password.");
      setLoading(false);
      return;
    }

    try {
      // Switch to Server-Side Login to bypass strict client-side Firestore rules (Insufficient Permissions)
      const res = await fetch("/api/child-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const foundChild = data.child;
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("childUser", JSON.stringify(foundChild));

      router.push("/learning-zone"); // Redirect to new learning zone dashboard


    } catch (err) {
      console.error("Child login error details:", err);
      setError("An error occurred during login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-cyan-200 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105">
        <div className="text-center mb-6">
          <Image src="/logo.png" alt="Logo" width={60} height={60} className="mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-center text-gray-800">
            Student Login
          </h1>
        </div>
        {error && (
          <div className="p-3 rounded-lg text-center bg-red-100 text-red-700 border border-red-300 animate-fade-in">
            {error}
          </div>
        )}
        <form onSubmit={handleChildLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Learning Zone"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
