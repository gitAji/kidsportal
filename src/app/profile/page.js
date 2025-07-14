"use client";
import { useEffect, useState, Suspense } from "react";
import {
  onAuthStateChanged,
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, app } from "../../firebase/config";
import { useRouter } from "next/navigation";
import Header from "../components/layout/header/Header";
import Footer from "../components/layout/footer/Footer";
import SkeletonLoader from "../components/ui/SkeletonLoader";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
  const router = useRouter();

  const storage = getStorage(app); // Initialize Firebase Storage

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setDisplayName(currentUser.displayName || "");
        setEmail(currentUser.email || "");
        setPhotoURL(currentUser.photoURL || "");

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!user) {
      setMessage("Error: User not authenticated.");
      return;
    }

    setMessage("Uploading image...");
    try {
      const imageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
      await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(imageRef);

      await updateProfile(user, { photoURL: downloadURL });
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });

      setPhotoURL(downloadURL);
      setMessage("Profile picture updated successfully!");
    } catch (error) {
      setMessage(`Error uploading image: ${error.message}`);
      console.error("Error uploading image:", error);
    }
  };

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
          photoURL: photoURL,
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 flex items-center justify-center">
        <Suspense fallback={<SkeletonLoader />}>
          <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
              User Profile
            </h1>
            
            <div className="flex justify-center mb-6">
              <button
                className={`py-2 px-4 rounded-l-lg ${activeTab === 'profile' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </button>
              <button
                className={`py-2 px-4 rounded-r-lg ${activeTab === 'subscription' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
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
                      className={`p-3 mb-4 rounded text-center ${
                        message.includes("Error") || message.includes("match")
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {message}
                    </div>
                  )}
                  <form onSubmit={handleUpdateProfile}>
                    <div className="mb-4 text-center">
                      {photoURL ? (
                        <img
                          src={photoURL}
                          alt="Profile"
                          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-blue-300 shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500 text-5xl font-bold">
                          {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <input
                        type="file"
                        id="profilePictureInput"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <label
                        htmlFor="profilePictureInput"
                        className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-full cursor-pointer hover:bg-blue-600 transition-colors duration-200"
                      >
                        Upload Photo
                      </label>
                    </div>
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
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                          isGoogleSignIn ? "bg-gray-200" : ""
                        }`}
                        disabled={isGoogleSignIn}
                      />
                    </div>
                    {!isGoogleSignIn && (
                      <>
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
                            Confirm Password:
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="********"
                          />
                        </div>
                      </>
                    )}
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
