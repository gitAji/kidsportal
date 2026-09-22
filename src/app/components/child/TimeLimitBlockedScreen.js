"use client";
import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useChild } from '../../providers/ChildProvider';
import { FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function TimeLimitBlockedScreen({ status }) {
  const { childUser, setChildUser } = useChild();
  const [sending, setSending] = useState(false);

  const requestStatus = childUser?.timeExtensionRequest?.status || null;

  // Live-watch the child's own profile doc while this screen is up, so an
  // approval from the parent's dashboard clears the block right away —
  // no refresh needed.
  useEffect(() => {
    if (!childUser?.parentUid || !childUser?.id) return;
    const ref = doc(db, 'users', childUser.parentUid, 'children', childUser.id);
    const unsubscribe = onSnapshot(ref, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      setChildUser((prev) => (prev ? { ...prev, timeExtensionRequest: data.timeExtensionRequest ?? null } : prev));
    });
    return () => unsubscribe();
  }, [childUser?.parentUid, childUser?.id, setChildUser]);

  const handleRequestMoreTime = async () => {
    if (!childUser?.parentUid || !childUser?.id || sending) return;
    setSending(true);
    try {
      const ref = doc(db, 'users', childUser.parentUid, 'children', childUser.id);
      await updateDoc(ref, {
        timeExtensionRequest: { status: 'pending', requestedAt: serverTimestamp() },
      });
      setChildUser((prev) => (prev ? { ...prev, timeExtensionRequest: { status: 'pending' } } : prev));
    } catch (err) {
      console.error('Failed to send time request', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-200 max-w-md w-full"
      >
        <div className="text-6xl mb-4">⏰</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">
          Time&apos;s Up For {status.limitType === 'weekly' ? 'This Week' : 'Today'}!
        </h2>
        <p className="text-slate-500 font-medium mb-6">
          You&apos;ve used all your learning time. Ask a grown-up for more, or come back {status.limitType === 'weekly' ? 'next week' : 'tomorrow'}!
        </p>

        {requestStatus === 'pending' ? (
          <div className="flex items-center justify-center gap-2 text-amber-600 font-bold bg-amber-50 border border-amber-200 rounded-2xl py-4 px-6">
            <FaCheckCircle /> Request sent — waiting for a grown-up!
          </div>
        ) : (
          <button
            onClick={handleRequestMoreTime}
            disabled={sending}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black uppercase tracking-widest text-sm rounded-2xl shadow-lg hover:shadow-blue-400/40 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <FaPaperPlane /> {sending ? 'Sending...' : 'Ask For More Time'}
          </button>
        )}
      </motion.div>
    </div>
  );
}
