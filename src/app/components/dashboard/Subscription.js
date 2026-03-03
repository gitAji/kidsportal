"use client";
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import Link from 'next/link';
import { FaCrown, FaCalendarAlt, FaArrowRight, FaExclamationTriangle } from 'react-icons/fa';

function formatDate(ts) {
  if (!ts) return "—";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function daysLeft(ts) {
  if (!ts) return null;
  const end = ts.toDate ? ts.toDate() : new Date(ts);
  return Math.ceil((end - new Date()) / (1000 * 60 * 60 * 24));
}

function getPlanLabel(plan) {
  switch (plan) {
    case 'premium_monthly': return "Premium Monthly";
    case 'premium_yearly': return "Premium Yearly";
    case 'trial': return "Free Trial";
    default: return "Free";
  }
}

const Subscription = () => {
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = auth.onAuthStateChanged(user => {
      if (!user) { setSub(null); setLoading(false); return; }
      const ref = doc(db, 'users', user.uid);
      const unsubSnap = onSnapshot(ref, (snap) => {
        const data = snap.data() || {};
        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : data.createdAt ? new Date(data.createdAt) : null;

        if (data.planType === 'paid') {
          // Paid plan from Stripe
          setSub({
            ...(data.subscription || {}),
            status: data.subscriptionStatus || data.subscription?.status || 'inactive',
            plan: data.subscriptionPlan || data.subscription?.plan,
            currentPeriodEnd: data.subscriptionExpiresAt || data.subscription?.currentPeriodEnd
          });
        } else if (data.planType === 'free_trial' || (!data.subscription && data.createdAt)) {
          // Application-level free trial
          const trialEnd = data.trialEndDate?.toDate ? data.trialEndDate.toDate() : (data.trialEndDate ? new Date(data.trialEndDate) : null);

          let finalTrialEnd = trialEnd;
          if (!finalTrialEnd) {
            const base = createdAt || new Date();
            finalTrialEnd = new Date(base);
            finalTrialEnd.setMonth(finalTrialEnd.getMonth() + 1);
          }

          setSub({
            plan: 'trial',
            status: finalTrialEnd > new Date() ? 'active' : 'expired',
            currentPeriodEnd: finalTrialEnd,
            ...(data.subscription || {}) // Keep customerId if it exists
          });
        } else if (data.subscription) {
          setSub(data.subscription);
        }
        setLoading(false);
      });
      return () => unsubSnap();
    });
    return () => unsubAuth();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 rounded-xl" />
          <div className="space-y-1.5 flex-grow">
            <div className="h-3 bg-slate-100 rounded w-1/2" />
            <div className="h-2 bg-slate-50 rounded w-1/3" />
          </div>
        </div>
        <div className="h-8 bg-slate-50 rounded-xl" />
        <div className="h-8 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  const isPaid = ['premium_monthly', 'premium_yearly'].includes(sub?.plan);
  const isStripeSubscription = !!sub?.stripeSubscriptionId;
  const isTrial = sub?.plan === 'trial';
  const isActive = sub?.status === 'active' || sub?.status === 'trialing';
  const isExpired = sub?.status === 'expired';
  const days = daysLeft(sub?.currentPeriodEnd);

  // Label logic
  let statusLabel = sub?.status || '—';
  if (isExpired) statusLabel = 'Expired';
  else if (isActive) statusLabel = 'Active';

  return (
    <div className="space-y-3">
      {/* Plan row */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${isPaid && isActive ? 'bg-blue-600 text-white shadow shadow-blue-200' : 'bg-slate-100 text-slate-400'
          }`}>
          <FaCrown />
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-base font-black text-slate-800 leading-tight">
            {isPaid ? getPlanLabel(sub?.plan) : (isStripeSubscription ? 'Premium Trial' : 'Free Trial')}
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1">
            <FaCalendarAlt className="text-[10px]" />
            {isActive
              ? `${isPaid ? 'Renews' : 'Expires'} ${formatDate(sub?.currentPeriodEnd)}`
              : `Expired ${formatDate(sub?.currentPeriodEnd)}`}
          </p>
        </div>

        {/* Status pill */}
        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex-shrink-0 ${isPaid && isActive ? 'bg-green-100 text-green-600' :
          isActive ? 'bg-blue-100 text-blue-600' :
            isExpired ? 'bg-red-100 text-red-500' :
              'bg-slate-100 text-slate-400'
          }`}>
          {statusLabel}
        </span>
      </div>

      {/* Trial warning */}
      {isTrial && isActive && days !== null && (
        <div className={`p-4 rounded-xl border flex flex-col gap-2.5 ${days <= 7 ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex items-center gap-2.5">
            <FaExclamationTriangle className={`flex-shrink-0 text-sm ${days <= 7 ? 'text-red-500' : 'text-amber-600'}`} />
            <p className={`text-sm font-black ${days <= 7 ? 'text-red-600' : 'text-amber-700'}`}>
              Trial Expiry Looming!
            </p>
          </div>
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            Your free trial has <span className="font-black text-slate-700">{days} day{days !== 1 ? 's' : ''}</span> left.
            Upgrade now to ensure your children don&apos;t lose their progress!
          </p>
          <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${days <= 7 ? 'bg-red-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, (days / 30) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {isExpired && (
        <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-xl text-[10px] font-bold text-red-500">
          <FaExclamationTriangle className="flex-shrink-0 text-[9px]" />
          Plan expired
        </div>
      )}

      {/* CTA → Billing page */}
      <Link
        href="/billing"
        className="w-full py-2.5 flex items-center justify-center gap-2 text-xs font-black rounded-xl border border-slate-100 bg-slate-50 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all"
      >
        {isExpired ? 'Renew Plan' : isPaid ? 'Manage Billing' : 'View Plans'}
        <FaArrowRight className="text-[10px]" />
      </Link>
    </div>
  );
};

export default Subscription;