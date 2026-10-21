"use client";
import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db, auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { FaCheckCircle, FaStar, FaCalendarAlt, FaUsers, FaCreditCard, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SubscriptionManagementPage = () => {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [childCount, setChildCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch User Data
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          const sub = data.subscription || {};
          if (!sub.plan || !sub.status) {
            setSubscription({ plan: 'Free', status: 'active', ...sub });
          } else {
            setSubscription(sub);
          }
        }

        // Fetch Child Count
        const childrenRef = collection(db, 'users', currentUser.uid, 'children');
        const childrenSnap = await getDocs(childrenRef);
        setChildCount(childrenSnap.size);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenPortal = async () => {
    if (!user) return;
    setPortalLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ uid: user.uid }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to open billing portal.');
      }
    } catch (error) {
      console.error("Error opening billing portal:", error);
      alert('Failed to connect to billing server.');
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-bold">Loading billing details...</p>
        </div>
      </div>
    );
  }

  const isPremium = subscription?.plan?.toLowerCase().includes('premium');
  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd.seconds * 1000).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
    : 'N/A';

  return (
    <div className="bg-slate-50/50 min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Billing & Subscription</h1>
          <p className="text-slate-500 font-medium">Manage your plan and payment methods.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Plan Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Current Plan</h2>
                  <div className="flex items-center gap-3">
                    <span className={`text-3xl font-black tracking-tight ${isPremium ? 'text-blue-600' : 'text-slate-700'}`}>
                      {isPremium ? (subscription.plan === 'premium_yearly' ? 'Premium Yearly' : 'Premium Monthly') : 'Free Plan'}
                    </span>
                    {['active', 'trialing'].includes(subscription?.status) && (
                      <span className="bg-emerald-100 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Active
                      </span>
                    )}
                  </div>
                </div>
                <div className={`p-4 rounded-2xl ${isPremium ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                  {isPremium ? <FaStar className="text-2xl" /> : <FaCheckCircle className="text-2xl" />}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-50 pt-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Renewal</p>
                    <p className="text-slate-700 font-bold">{isPremium ? renewalDate : 'Never'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-xl" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Children Accounts</p>
                    <p className="text-slate-700 font-bold">{childCount} Children</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {subscription?.stripeCustomerId ? (
                  <button
                    onClick={handleOpenPortal}
                    disabled={portalLoading}
                    className="flex-grow bg-slate-900 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {portalLoading ? <FaSpinner className="animate-spin" /> : <FaCreditCard />}
                    Manage Payments & Billing
                    <FaExternalLinkAlt className="text-[10px] opacity-50" />
                  </button>
                ) : (
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="flex-grow bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-500/10 hover:bg-blue-700 transition-all"
                  >
                    Upgrade to Premium
                  </button>
                )}
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-white text-slate-700 font-bold py-4 px-8 rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

            {isPremium && (
              <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 flex items-start gap-4">
                <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm border border-blue-50">
                  <FaStar className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-blue-900 font-bold mb-1">Premium Perks Active</h3>
                  <p className="text-blue-700/80 text-sm leading-relaxed">
                    You currently have full access to all subjects, unlimited practice sessions, and comprehensive analytics for up to 4 children.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Right Column / FAQ or Plan Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 sticky top-8">
              <h3 className="font-black text-slate-800 mb-6">Subscription Help</h3>
              <ul className="space-y-4">
                <li className="text-sm text-slate-600">
                  <p className="font-bold text-slate-800 mb-1">How can I cancel?</p>
                  <p>You can cancel anytime via the Billing Portal. Your benefits will continue until the end of your period.</p>
                </li>
                <li className="text-sm text-slate-600">
                  <p className="font-bold text-slate-800 mb-1">Change payment method?</p>
                  <p>Update your credit card or view past invoices through our secure Stripe portal.</p>
                </li>
                <li className="text-sm text-slate-600">
                  <p className="font-bold text-slate-800 mb-1">Switch plans?</p>
                  <p>Want to switch between Monthly and Yearly? You can do this in the Billing Portal.</p>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagementPage;
