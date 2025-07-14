"use client";
import { useEffect, useState, Suspense } from "react";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, app } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";
import Subscription from "../components/dashboard/Subscription";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, []);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");

        const isGoogle = currentUser.providerData.some(
          (provider) => provider.providerId === "google.com"
        );
        setIsGoogleSignIn(isGoogle);

        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setPhoneNumber(userDocSnap.data().phoneNumber || "");
          }
        } catch (error) {
          console.error("Error fetching phone number:", error);
        }
      } else {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      if (user) {
        await updateProfile(user, {
          displayName: displayName,
        });

        if (email !== user.email && !isGoogleSignIn) {
          await updateEmail(user, email);
        }

        if (password && !isGoogleSignIn) {
          await updatePassword(user, password);
        }

        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, { phoneNumber: phoneNumber }, { merge: true });

        setMessage("Profile updated successfully!");
        const updatedUser = auth.currentUser;
        setUser(updatedUser);
      }
    } catch (error) {
      setMessage(`Error updating profile: ${error.message}`);
      console.error("Error updating profile:", error);
    }
  };

  if (!user) {
    return null;
  }

  const tabVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--background)]">
      <Header />
      <main className="flex-grow p-4 flex items-center justify-center">
        <Suspense fallback={<SkeletonLoader />}>
          <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-center text-[var(--text-dark)]">
              User Profile
            </h1>
            
            <div className="flex justify-center mb-6">
              <button
                className={`py-2 px-4 rounded-l-lg text-lg font-semibold transition-colors duration-200 ${
                  activeTab === 'profile' ? 'bg-[var(--primary-blue)] text-white' : 'bg-gray-200 text-[var(--foreground)] hover:bg-gray-300'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`py-2 px-4 rounded-r-lg text-lg font-semibold transition-colors duration-200 ${
                  activeTab === 'subscription' ? 'bg-[var(--primary-blue)] text-white' : 'bg-gray-200 text-[var(--foreground)] hover:bg-gray-300'
                }`}
                onClick={() => setActiveTab('subscription')}
              >
                Subscription
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3 }}
                >
                  {message && (
                    <div
                      className={`p-3 mb-4 rounded text-center text-lg ${
                        message.includes("Error") || message.includes("match")
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {message}
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        Display Name:
                      </label>
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        Email:
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)] ${
                          isGoogleSignIn ? "bg-gray-200" : ""
                        }`}
                        disabled={isGoogleSignIn}
                      />
                    </div>
                    {!isGoogleSignIn && (
                      <>
                        <div className="mb-4">
                          <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                            Password (leave blank to keep current):
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                            placeholder="********"
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                            Confirm Password:
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                            placeholder="********"
                          />
                        </div>
                      </>
                    )}
                    <div className="mb-4">
                      <label className="block text-[var(--foreground)] text-base font-semibold mb-2">
                        Phone Number:
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-[var(--foreground)] leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary-blue)]"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <button
                        type="submit"
                        className="bg-[var(--primary-blue)] hover:bg-[var(--primary-blue)]/80 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {activeTab === 'subscription' && (
                <motion.div
                  key="subscription"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <Subscription />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
