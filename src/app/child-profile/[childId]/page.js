"use client";
import { useEffect, useState, Suspense } from "react";
import { doc, getDoc, setDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../../firebase/config";
import { useRouter } from "next/navigation";
import Header from "../../components/layout/header/Header";
import Footer from "../../components/layout/footer/Footer";
import SkeletonLoader from "../../../components/ui/SkeletonLoader";
import AddChildForm from "../../../components/dashboard/AddChildForm"; // Re-use for editing
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function ChildProfilePage({ params }) {
  const { childId } = params;
  const router = useRouter();
  const [childData, setChildData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("details"); // 'details', 'insights', 'settings'
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
      return;
    }

    if (!childId) {
      setLoading(false);
      return;
    }

    const childDocRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "children",
      childId
    );
    const unsubscribe = onSnapshot(
      childDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setChildData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setMessage("Child not found.");
          setChildData(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching child data:", error);
        setMessage("Error loading child data.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [childId, router]);

  const handleSaveSuccess = () => {
    setIsEditing(false);
    setMessage("Child details updated successfully!");
  };

  const handleDeleteChild = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this child's profile? This action cannot be undone."
      )
    ) {
      try {
        const childDocRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "children",
          childId
        );
        await deleteDoc(childDocRef);
        setMessage("Child profile deleted successfully!");
        router.push("/dashboard"); // Redirect to dashboard after deletion
      } catch (error) {
        setMessage(`Error deleting child: ${error.message}`);
        console.error("Error deleting child:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--background)]">
        <Header />
        <main className="flex-grow p-4">
          <SkeletonLoader />
        </main>
        <Footer />
      </div>
    );
  }

  if (!childData) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--background)]">
        <Header />
        <main className="flex-grow p-4 flex items-center justify-center text-red-500 text-xl">
          {message || "Child data could not be loaded."}
        </main>
        <Footer />
      </div>
    );
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
          <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg flex flex-col md:flex-row">
            {/* Left Sidebar for Tabs */}
            <div className="md:w-1/4 border-r border-gray-200 pr-8 mb-6 md:mb-0">
              <h2 className="text-3xl font-bold text-[var(--text-dark)] mb-4">
                {childData.name}
              </h2>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("details");
                      setIsEditing(false);
                    }}
                    className={`w-full text-left py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                      activeTab === "details"
                        ? "bg-[var(--primary-blue)] text-white"
                        : "text-[var(--foreground)] hover:bg-gray-100"
                    }`}
                  >
                    Details
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("insights");
                      setIsEditing(false);
                    }}
                    className={`w-full text-left py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                      activeTab === "insights"
                        ? "bg-[var(--primary-blue)] text-white"
                        : "text-[var(--foreground)] hover:bg-gray-100"
                    }`}
                  >
                    Insights
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("settings");
                      setIsEditing(true);
                    }}
                    className={`w-full text-left py-2 px-4 rounded-lg font-semibold transition-colors duration-200 ${
                      activeTab === "settings"
                        ? "bg-[var(--primary-blue)] text-white"
                        : "text-[var(--foreground)] hover:bg-gray-100"
                    }`}
                  >
                    Settings
                  </button>
                </li>
              </ul>
            </div>

            {/* Right Content Area */}
            <div className="md:w-3/4 md:pl-8">
              {message && (
                <div
                  className={`p-3 mb-4 rounded text-center text-lg ${
                    message.includes("Error")
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {message}
                </div>
              )}
              <AnimatePresence mode="wait">
                {activeTab === "details" && (
                  <motion.div
                    key="details"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold text-[var(--text-dark)] mb-4">
                      Child Details
                    </h2>
                    <div className="mb-4 text-center">
                      {childData.photoURL ? (
                        <Image
                          src={childData.photoURL}
                          alt={childData.name}
                          width={128}
                          height={128}
                          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-[var(--primary-blue)] shadow-lg"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-gray-500 text-5xl font-bold">
                          {childData.name
                            ? childData.name.charAt(0).toUpperCase()
                            : "C"}
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-[var(--foreground)] mb-2">
                      <strong>Name:</strong> {childData.name}
                    </p>
                    <p className="text-lg text-[var(--foreground)] mb-2">
                      <strong>Age:</strong> {childData.age}
                    </p>
                    <p className="text-lg text-[var(--foreground)] mb-2">
                      <strong>Grade:</strong> {childData.grade}
                    </p>
                    <p className="text-lg text-[var(--foreground)] mb-2">
                      <strong>Phone Number:</strong>{" "}
                      {childData.phoneNumber || "N/A"}
                    </p>
                  </motion.div>
                )}

                {activeTab === "insights" && (
                  <motion.div
                    key="insights"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold text-[var(--text-dark)] mb-4">
                      Learning Insights
                    </h2>
                    <p className="text-lg text-[var(--foreground)] mb-2">
                      <strong>Assigned Tasks:</strong>{" "}
                      {childData.assignedTasks?.length || 0}
                    </p>
                    <p className="text-lg text-[var(--foreground)] mb-2">
                      <strong>Completed Tasks:</strong>{" "}
                      {childData.assignedTasks?.filter(
                        (task) => task.status === "completed"
                      ).length || 0}
                    </p>
                    <p className="text-lg text-[var(--foreground)] mb-2">
                      <strong>Overall Progress:</strong>{" "}
                      {childData.progress?.overall || 0}%
                    </p>
                    {/* Add more detailed insights here */}
                  </motion.div>
                )}

                {activeTab === "settings" && (
                  <motion.div
                    key="settings"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold text-[var(--text-dark)] mb-4">
                      Child Settings
                    </h2>
                    <AddChildForm
                      onClose={() => setIsEditing(false)}
                      childToEdit={childData}
                      onSaveSuccess={handleSaveSuccess}
                    />
                    <button
                      onClick={handleDeleteChild}
                      className="mt-6 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
                    >
                      Delete Child Profile
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
