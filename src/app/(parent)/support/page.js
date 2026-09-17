"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaTicketAlt, FaPaperPlane, FaEnvelope, FaPhone } from "react-icons/fa";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";

export default function SupportPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [formStatus, setFormStatus] = useState("idle");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) { router.push("/login"); return; }
      setUser(u);
      setEmail(u.email || "");
      setName(u.displayName || "");

      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const d = snap.data();
          const fullName = [d.firstName, d.lastName].filter(Boolean).join(" ");
          if (fullName) setName(fullName);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }

      setLoading(false);
    });
    return () => unsub();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setFormStatus("sending");

    try {
      await addDoc(collection(db, "tickets"), {
        name,
        email,
        subject,
        message,
        parentUid: user.uid,
        type: "support",
        status: "open",
        createdAt: serverTimestamp(),
      });
      setFormStatus("success");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error opening ticket:", error);
      setFormStatus("error");
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl flex-shrink-0">
          <FaTicketAlt />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Support</h1>
          <p className="text-slate-500 font-medium text-sm">Open a ticket and our team will follow up by email.</p>
        </div>
      </div>

      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        {formStatus === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 text-center"
          >
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
              <FaPaperPlane />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Ticket Opened!</h3>
            <p className="text-slate-500 font-medium">We&apos;ll get back to you at {email} soon.</p>
            <button
              onClick={() => setFormStatus("idle")}
              className="mt-8 text-blue-600 font-bold hover:underline"
            >
              Open another ticket
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wide">Your Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wide">Email Address</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wide">Subject</label>
              <input
                required
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wide">Message</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all resize-none"
                placeholder="Write your message here..."
              />
            </div>
            <button
              disabled={formStatus === "sending"}
              className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl transition-all flex items-center justify-center gap-2 ${formStatus === "sending" ? "bg-slate-400" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200 active:scale-[0.98]"
                }`}
            >
              {formStatus === "sending" ? "Opening ticket..." : "Open Ticket"} <FaPaperPlane />
            </button>
            {formStatus === "error" && (
              <p className="text-red-500 text-sm font-bold text-center mt-2">Failed to open ticket. Please try again.</p>
            )}
          </form>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 text-sm">
        <a href="mailto:support@kidsportal.com" className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors">
          <FaEnvelope /> support@kidsportal.com
        </a>
        <span className="flex items-center gap-2 text-slate-500 font-bold">
          <FaPhone /> +1 (555) 123-4567
        </span>
      </div>
    </div>
  );
}
