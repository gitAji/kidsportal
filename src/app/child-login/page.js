"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { app } from "../../firebase/config";
import { getFirestore } from "firebase/firestore";

export default function ChildLoginPage() {
  const db = getFirestore(app);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const childUsername = searchParams.get('username');
    if (childUsername) {
      setUsername(childUsername);
    }
  }, [searchParams]);

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
      const usernameDocRef = doc(db, 'child_usernames', username);
      const usernameDoc = await getDoc(usernameDocRef);

      if (!usernameDoc.exists()) {
        setError("Invalid username or password. Please try again.");
        setLoading(false);
        return;
      }

      const { parentUid, childId } = usernameDoc.data();
      const childDocRef = doc(db, 'users', parentUid, 'children', childId);
      const childDoc = await getDoc(childDocRef);

      if (!childDoc.exists()) {
        setError("An unexpected error occurred. Child profile not found.");
        setLoading(false);
        return;
      }

      const childData = childDoc.data();

      if (childData.password !== password) {
        setError("Invalid username or password. Please try again.");
        setLoading(false);
        return;
      }

      if (childData.loginEnabled === false) {
        setError("Your account is currently disabled. Please ask your parent to enable it.");
        setLoading(false);
        return;
      }

      const foundChild = { id: childDoc.id, ...childData, parentUid };
      sessionStorage.setItem("childUser", JSON.stringify(foundChild));
      router.push("/learning-zone/dashboard");

    } catch (err) {
      console.error("Error during child login:", err);
      setError("An error occurred during login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Child Login
        </h1>
        {error && (
          <div className="p-3 rounded text-center bg-red-100 text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleChildLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="text-sm font-bold text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
