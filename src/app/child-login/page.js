"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useModal } from "../providers/ModalProvider";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";

export default function ChildLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const { setIsModalOpen, setIsRegister } = useModal();

  const handleChildLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Query all parent documents to find the child
      const usersRef = collection(db, "users");
      const userSnapshot = await getDocs(usersRef);

      let foundChild = null;
      let parentUid = null;

      for (const userDoc of userSnapshot.docs) {
        const childrenRef = collection(db, "users", userDoc.id, "children");
        const q = query(
          childrenRef,
          where("username", "==", username),
          where("password", "==", password) // In a real app, hash passwords!
        );
        const childSnapshot = await getDocs(q);

        if (!childSnapshot.empty) {
          foundChild = childSnapshot.docs[0].data();
          parentUid = userDoc.id;
          break;
        }
      }

      if (foundChild) {
        // For demonstration, store child data in session storage
        // In a real app, use a more secure token-based authentication
        sessionStorage.setItem("childUser", JSON.stringify({ ...foundChild, parentUid }));
        router.push("/child-dashboard"); // Redirect to the child's dashboard
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      console.error("Error during child login:", err);
      setError("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md w-full">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Child Login
          </h1>
          {error && (
            <div className="p-3 mb-4 rounded text-center bg-red-100 text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleChildLogin}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Username:
              </label>
              <input
                type="text"
                id="username"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Password:
              </label>
              <input
                type="password"
                id="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Login
              </button>
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Are you a parent?{" "}
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(true); setIsRegister(false); }}
                  className="text-blue-600 hover:underline"
                >
                  Sign In/Sign Up here
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
