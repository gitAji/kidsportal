"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaUserGraduate, FaUsers, FaArrowRight, FaLock, FaEnvelope, FaKey, FaHome
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import {
    signInWithEmail, signInWithGoogle
} from "@/firebase/auth";
import { auth, db } from "@/firebase/config";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collectionGroup, query, where, getDocs, limit } from "firebase/firestore";
import CustomAvatar from "@/app/components/ui/CustomAvatar";

export default function UnifiedLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeRole, setActiveRole] = useState("parent"); // parent, student
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // For students
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(true);

    // Student Lookup State
    const [studentSearchName, setStudentSearchName] = useState("");
    const [matchingStudents, setMatchingStudents] = useState([]);
    const [lookupStep, setLookupStep] = useState("search"); // search, pick, login
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Roles Configuration
    const roles = [
        { id: 'parent', title: 'Parent Portal', icon: <FaUsers />, color: 'blue', desc: 'Family Dashboard' },
        { id: 'student', title: 'Student Zone', icon: <FaUserGraduate />, color: 'emerald', desc: 'Learning Area' },
    ];

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // If logged in, redirect to dashboard (actual routing handled by layout/guards)
            }
            setVerifying(false);
        });
        const role = searchParams.get('role');
        if (role && roles.map(r => r.id).includes(role)) {
            setActiveRole(role);
        }
        return () => unsub();
    }, [searchParams]);

    const handleAuth = async (e) => {
        if (e) e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (activeRole === 'student') {
                await loginAsStudent();
            } else {
                await signInWithEmail(email, password);
                router.push("/dashboard");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStudentSearch = async (e) => {
        e.preventDefault();
        if (!studentSearchName.trim()) return;

        setLoading(true);
        setError("");
        try {
            // Collection group query to find children by name
            const childrenQuery = query(
                collectionGroup(db, 'children'),
                where('name', '==', studentSearchName.trim()),
                limit(10)
            );

            const querySnapshot = await getDocs(childrenQuery);
            const found = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            if (found.length === 0) {
                throw new Error("No students found with that name. Please check the spelling or ask your parent.");
            }

            setMatchingStudents(found);
            setLookupStep("pick");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectStudent = (student) => {
        setSelectedStudent(student);
        setUsername(student.username);
        setLookupStep("login");
        setError("");
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            router.push("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loginAsStudent = async () => {
        try {
            const usernameDoc = await getDoc(doc(db, 'child_usernames', username.toLowerCase()));
            if (!usernameDoc.exists()) throw new Error("Student username not found.");

            const { parentUid, childId } = usernameDoc.data();
            const childDoc = await getDoc(doc(db, 'users', parentUid, 'children', childId));

            if (!childDoc.exists()) throw new Error("Student profile error.");

            const childData = childDoc.data();
            if (childData.password !== password) throw new Error("Invalid PIN. Please check with your parent.");
            if (childData.loginEnabled === false) throw new Error("Account disabled.");
            if (!childData.grade) throw new Error("Grade not assigned to profile.");

            localStorage.setItem("childUser", JSON.stringify({ id: childId, ...childData, parentUid }));
            router.push("/learning-zone");
        } catch (err) {
            console.error("Student Login Error Chain:", err);
            if (err.code === 'permission-denied') {
                throw new Error("Learning Zone access restricted. Please contact support.");
            }
            throw err;
        }
    };

    if (verifying) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-8">
                <div className="w-full max-w-4xl">
                    <SkeletonLoader variant="page" message="Checking your session..." />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Logo in top left */}
            <div className="absolute top-8 left-8 z-50">
                <Link href="/">
                    <div className="relative w-[200px] h-[60px] transition-transform hover:scale-105 active:scale-95">
                        <Image
                            src="/logo.png"
                            alt="KidsPortal"
                            fill
                            className="object-contain object-left"
                            priority
                        />
                    </div>
                </Link>
            </div>

            {/* Background Decorations - Light Theme */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-50/50 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
                {/* ── Left Side: Identity Selector ── */}
                <div className="space-y-8">
                    <div>
                        <motion.button
                            onClick={() => router.push("/")}
                            whileHover={{ x: -5 }}
                            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold uppercase tracking-widest text-[11px] mb-12 transition-colors"
                        >
                            <FaHome /> Back to home
                        </motion.button>
                        <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight mb-6">
                            Pick your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">destination.</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-md">
                            Welcome back! Choose your account type to continue your learning journey.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => { setActiveRole(role.id); setError(""); }}
                                className={`p-8 rounded-[2.5rem] border-2 transition-all duration-300 text-left group relative overflow-hidden ${activeRole === role.id
                                    ? `bg-white border-blue-500 shadow-2xl shadow-blue-500/10`
                                    : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                    }`}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 transition-all duration-300 ${activeRole === role.id
                                    ? `bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg`
                                    : `bg-white text-slate-400 group-hover:text-blue-500`
                                    }`}>
                                    {role.icon}
                                </div>
                                <h3 className={`font-black text-xl mb-1 transition-colors ${activeRole === role.id ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                    {role.title}
                                </h3>
                                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 group-hover:text-slate-500 transition-colors">
                                    {role.desc}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Right Side: Premium Unified Form ── */}
                <motion.div
                    key={activeRole}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] relative"
                >
                    <div className="mb-10 flex items-center justify-between">
                        <div>
                            <span className="text-blue-500 font-black uppercase tracking-[3px] text-[10px] mb-2 block">Authenticating as</span>
                            <h2 className="text-3xl font-black text-slate-900 capitalize">{activeRole}</h2>
                        </div>
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl text-blue-600">
                            {roles.find(r => r.id === activeRole)?.icon}
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-red-50 border border-red-100 p-4 rounded-2xl flex gap-3 items-center text-red-600 font-bold text-sm mb-8"
                        >
                            <FaLock className="flex-shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={activeRole === 'student' && lookupStep === 'search' ? handleStudentSearch : handleAuth} className="space-y-6">
                        {activeRole === 'student' ? (
                            <AnimatePresence mode="wait">
                                {lookupStep === 'search' && (
                                    <motion.div
                                        key="search"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-6"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Type your first name</label>
                                            <div className="relative">
                                                <FaUserGraduate className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-500" />
                                                <input
                                                    type="text"
                                                    value={studentSearchName}
                                                    onChange={(e) => setStudentSearchName(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold placeholder:text-slate-300"
                                                    placeholder="e.g. Leo"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 hover:bg-blue-700 transition-all"
                                        >
                                            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Find My Account 🚀"}
                                        </button>
                                    </motion.div>
                                )}

                                {lookupStep === 'pick' && (
                                    <motion.div
                                        key="pick"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Which one is you?</label>
                                            <button type="button" onClick={() => setLookupStep('search')} className="text-[10px] font-bold text-blue-600 hover:underline">Try another name</button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                            {matchingStudents.map((child) => (
                                                <button
                                                    key={child.id}
                                                    type="button"
                                                    onClick={() => handleSelectStudent(child)}
                                                    className="flex items-center gap-4 p-4 bg-slate-50 border-2 border-transparent hover:border-blue-500 hover:bg-white rounded-2xl transition-all text-left group"
                                                >
                                                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">
                                                        <CustomAvatar child={child} />
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className="font-black text-slate-800">{child.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Username: <span className="text-blue-500">{child.username}</span></p>
                                                    </div>
                                                    <FaArrowRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {lookupStep === 'login' && (
                                    <motion.div
                                        key="login"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                                                <CustomAvatar child={selectedStudent} />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Welcome back,</p>
                                                <p className="text-xl font-black text-slate-800">{selectedStudent?.name}!</p>
                                            </div>
                                            <button type="button" onClick={() => setLookupStep('pick')} className="text-xs font-bold text-slate-400 hover:text-blue-600">Change</button>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Your Secret PIN</label>
                                            <div className="relative">
                                                <FaKey className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold placeholder:text-slate-300"
                                                    placeholder="••••"
                                                    required
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full h-16 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                        >
                                            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Start Learning! ✨"}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Email Address</label>
                                    <div className="relative">
                                        <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold placeholder:text-slate-300"
                                            placeholder="parent@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black uppercase tracking-[2px] text-slate-400 ml-1">Secure Password</label>
                                    <div className="relative">
                                        <FaKey className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl pl-14 pr-6 py-4 text-slate-800 focus:border-blue-500 focus:bg-white outline-none transition-all font-semibold placeholder:text-slate-300"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="pt-4 space-y-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl font-black text-white shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-[0.98]"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign in to {activeRole === 'student' ? 'Learning Zone' : 'Parent Portal'}</span>
                                        <FaArrowRight className="text-sm" />
                                    </>
                                )}
                            </button>

                            {activeRole === 'parent' && (
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="w-full h-16 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-700 shadow-sm transition-all flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 active:scale-[0.98] disabled:opacity-50"
                                >
                                    <FcGoogle className="text-2xl" />
                                    Continue with Google
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                        <p className="text-sm text-slate-400 font-bold">
                            {activeRole === 'parent' ? "New to the portal?" : "Having trouble logging in?"}
                            {activeRole === 'parent' ? (
                                <button onClick={() => router.push("/register")} className="text-blue-600 ml-2 hover:underline">Create an account</button>
                            ) : (
                                <a href="mailto:support@kidsportal.com" className="text-blue-600 ml-2 hover:underline">Get help</a>
                            )}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
