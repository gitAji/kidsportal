"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTicketAlt, FaPaperPlane, FaEnvelope, FaPhone, FaChevronDown,
  FaInbox, FaClock, FaCheckCircle, FaQuestionCircle, FaArrowRight, FaReply
} from "react-icons/fa";
import { DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";

const QUICK_HELP = [
  {
    question: "How do I add or remove a learner profile?",
    answer: "From your Parent Dashboard, click \"Add Child\" to create a new learner profile, or open a child's card to edit their details or remove them.",
  },
  {
    question: "What's the difference between Free and Premium?",
    answer: "Free includes the first two Missions of every subject. Premium unlocks every level, advanced analytics, and deeper student insights.",
  },
  {
    question: "My child forgot their login — what do I do?",
    answer: "Open the child's card on your dashboard to see or reset their username and password, or share the permanent login link shown there.",
  },
  {
    question: "How do I control which levels my child can access?",
    answer: "In a child's settings, toggle \"Finish to Unlock\" to require levels be completed in order, or switch to \"Free Access\" to let them play any level.",
  },
];

const STATUS_STYLES = {
  open: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", label: "Open" },
  in_progress: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", label: "In Progress" },
  resolved: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", label: "Resolved" },
  closed: { bg: "bg-slate-100", text: "text-slate-500", border: "border-slate-200", label: "Closed" },
};

const CONTACT_CHANNELS = [
  {
    icon: <FaEnvelope />,
    color: "bg-blue-50 text-blue-600",
    label: "Email Us",
    value: "support@kidsportal.com",
    href: "mailto:support@kidsportal.com",
    desc: "We typically reply within one business day.",
  },
  {
    icon: <FaPhone />,
    color: "bg-purple-50 text-purple-600",
    label: "Call Us",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
    desc: "Monday to Friday, 9am–6pm EST.",
  },
];

function formatTicketDate(createdAt) {
  const date = createdAt?.toDate?.();
  return date ? date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Just now";
}

export default function SupportPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [formStatus, setFormStatus] = useState("idle");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState(null);

  const loadTickets = async (uid) => {
    setTicketsLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "tickets"), where("parentUid", "==", uid)));
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      rows.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setTickets(rows);
    } catch (err) {
      console.error("Error loading tickets:", err);
    }
    setTicketsLoading(false);
  };

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

      await loadTickets(u.uid);
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
      loadTickets(user.uid);
    } catch (error) {
      console.error("Error opening ticket:", error);
      setFormStatus("error");
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 md:py-14">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl flex-shrink-0">
          <FaTicketAlt />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Support</h1>
          <p className="text-slate-500 font-medium text-sm">Find a quick answer below, or open a ticket and our team will follow up by email.</p>
        </div>
      </div>

      {/* Quick help — a chance to self-serve before opening a ticket */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Quick Help</h2>
          <Link href="/help" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            See all FAQs <FaArrowRight size={10} />
          </Link>
        </div>
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm divide-y divide-slate-100">
          {QUICK_HELP.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-4 hover:bg-slate-50/80 transition-colors rounded-[2rem]"
                >
                  <span className="flex items-center gap-3 font-bold text-slate-700 text-sm">
                    <FaQuestionCircle className="text-blue-400 flex-shrink-0" /> {faq.question}
                  </span>
                  <FaChevronDown className={`text-slate-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} size={12} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 pl-12 text-slate-500 text-sm font-medium leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Ticket form */}
        <div className="lg:col-span-3 bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
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
              <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Open a Ticket</h2>
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

        {/* Past tickets */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-5">Your Tickets</h2>
          {ticketsLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10">
              <FaInbox className="text-3xl text-slate-300 mx-auto mb-3" />
              <p className="text-slate-400 font-bold text-sm">No tickets yet</p>
              <p className="text-slate-400 text-xs font-medium mt-1">Anything you submit will show up here.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {tickets.map((ticket) => {
                const status = STATUS_STYLES[ticket.status || "open"] || STATUS_STYLES.open;
                const replyCount = ticket.responses?.length || 0;
                return (
                  <div key={ticket.id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-slate-700 text-sm truncate">{ticket.subject}</p>
                      <span className={`flex-shrink-0 px-2.5 py-1 rounded-lg ${status.bg} ${status.border} border ${status.text} text-[9px] font-black uppercase tracking-widest`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs font-medium mt-1 line-clamp-2">{ticket.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400 font-bold">
                      <span className="flex items-center gap-1"><FaClock size={9} /> {formatTicketDate(ticket.createdAt)}</span>
                      {replyCount > 0 && (
                        <span className="flex items-center gap-1 text-blue-500"><FaReply size={9} /> {replyCount} {replyCount === 1 ? "reply" : "replies"}</span>
                      )}
                      {ticket.status === "resolved" && (
                        <span className="flex items-center gap-1 text-emerald-500"><FaCheckCircle size={9} /> Resolved</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Other ways to reach us */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONTACT_CHANNELS.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${channel.color}`}>
              {channel.icon}
            </div>
            <div>
              <p className="font-black text-slate-700 text-sm">{channel.label}</p>
              <p className="text-slate-500 text-sm font-bold">{channel.value}</p>
              <p className="text-slate-400 text-xs font-medium mt-0.5">{channel.desc}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
