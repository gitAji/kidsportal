"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function ChildLoginPage() {
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
    console.log(`Attempting to log in with username: "${username}"`);

    if (!username || !password) {
        setError("Please enter both username and password.");
        setLoading(false);
        return;
    }

    try {
      // Step 1: Look up the username in the global directory
      console.log(`Step 1: Looking up username "${username}" in 'child_usernames' collection.`);
      const usernameDocRef = doc(db, 'child_usernames', username);
      const usernameDoc = await getDoc(usernameDocRef);

      if (!usernameDoc.exists()) {
        console.error("Login Error: Username document not found in 'child_usernames'.");
        setError("Invalid username or password. Please try again.");
        setLoading(false);
        return;
      }
      console.log("Step 1 Success: Username document found.");

      // Step 2: Get the parent and child IDs from the directory
      const { parentUid, childId } = usernameDoc.data();
      console.log(`Step 2: Retrieved parentUid: ${parentUid}, childId: ${childId}`);

      // Step 3: Fetch the actual child document
      console.log(`Step 3: Fetching child document from path: /users/${parentUid}/children/${childId}`);
      const childDocRef = doc(db, 'users', parentUid, 'children', childId);
      const childDoc = await getDoc(childDocRef);

      if (!childDoc.exists()) {
        console.error("Login Error: Child document not found at the specified path.");
        setError("An unexpected error occurred. Child profile not found.");
        setLoading(false);
        return;
      }
      console.log("Step 3 Success: Child document found.");

      const childData = childDoc.data();

      // Step 4: Verify the password and account status
      console.log("Step 4: Verifying password and account status.");
      if (childData.password !== password) {
        console.error(`Login Error: Password mismatch. Entered: "${password}", Stored: "${childData.password}"`);
        setError("Invalid username or password. Please try again.");
        setLoading(false);
        return;
      }
      console.log("Password match success.");

      if (childData.loginEnabled === false) {
        console.error("Login Error: Account is disabled.");
        setError("Your account is currently disabled. Please ask your parent to enable it.");
        setLoading(false);
        return;
      }
      console.log("Account is enabled.");

      // Step 5: Success! Store session and redirect.
      console.log("Step 5: Login successful! Redirecting to /learning-zone.");
      const foundChild = { id: childDoc.id, ...childData, parentUid };
      sessionStorage.setItem("childUser", JSON.stringify(foundChild));
      router.push("/learning-zone");

    } catch (err) {
      console.error("A critical error occurred during the login process:", err);
      setError("An error occurred during login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600">Enter your username and password to log in.</p>
        
        {error && (
          <div className="p-3 rounded text-center bg-red-100 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleChildLogin} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-bold text-gray-700"
            >
              Username
            </label>
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
            <label
              htmlFor="password"
              className="text-sm font-bold text-gray-700"
            >
              Password
            </label>
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
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Are you a parent?{" "}
            <a href="/login" className="font-medium text-blue-600 hover:underline">
              Click here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}