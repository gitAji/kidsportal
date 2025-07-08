"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // New state for phone number
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
        setPhotoURL(currentUser.photoURL || "");

        // Fetch phone number from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setPhoneNumber(userDocSnap.data().phoneNumber || "");
          }
        } catch (error) {
          console.error("Error fetching phone number:", error);
        }

      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      if (user) {
        // Update display name and photo URL
        await updateProfile(user, {
          displayName: displayName,
          photoURL: photoURL,
        });

        // Update email if changed
        if (email !== user.email) {
          await updateEmail(user, email);
        }

        // Update password if provided
        if (password) {
          await updatePassword(user, password);
        }

        // Update phone number in Firestore
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { phoneNumber: phoneNumber }, { merge: true });

        setMessage("Profile updated successfully!");
        // Refresh user object to reflect changes
        const updatedUser = auth.currentUser;
        setUser(updatedUser);
      }
    } catch (error) {
      setMessage(`Error updating profile: ${error.message}`);
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return null; // Should redirect to login
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
            User Profile
          </h1>
          {message && (
            <div
              className={`p-3 mb-4 rounded text-center ${
                message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
              }`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Display Name:
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Password (leave blank to keep current):
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="********"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Photo URL:
                </label>
                <input
                  type="text"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              {/* Phone Number Field */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Phone Number:
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </main>
        </main>
      <Footer />
    </div>
  );