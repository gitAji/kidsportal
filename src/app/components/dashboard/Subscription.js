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

        if (!data.subscription) {
          const base = createdAt || new Date();
          const trialEnd = new Date(base);
          trialEnd.setMonth(trialEnd.getMonth() + 1);
          setSub({ plan: 'trial', status: trialEnd > new Date() ? 'active' : 'expired', currentPeriodEnd: trialEnd });
        } else {
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
  const isTrial = sub?.plan === 'trial';
  const isActive = sub?.status === 'active';
  const isExpired = sub?.status === 'expired';
  const days = daysLeft(sub?.currentPeriodEnd);

  return (
    <div className="space-y-3">
      {/* Plan row */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${isPaid && isActive ? 'bg-blue-600 text-white shadow shadow-blue-200' : 'bg-slate-100 text-slate-400'
          }`}>
          <FaCrown />
        </div>
        <div className="flex-grow min-w-0">
          <p className="text-sm font-black text-slate-800 leading-tight">{getPlanLabel(sub?.plan)}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
            <FaCalendarAlt className="text-[8px]" />
            {isPaid && isActive
              ? `Renews ${formatDate(sub?.currentPeriodEnd)}`
              : `Expires ${formatDate(sub?.currentPeriodEnd)}`}
          </p>
        </div>

        {/* Status pill */}
        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ${isPaid && isActive ? 'bg-green-100 text-green-600' :
            isTrial && isActive ? 'bg-amber-100 text-amber-600' :
              isExpired ? 'bg-red-100 text-red-500' :
                'bg-slate-100 text-slate-400'
          }`}>
          {isExpired ? 'Expired' : isActive ? 'Active' : sub?.status || '—'}
        </span>
      </div>

      {/* Trial warning */}
      {isTrial && isActive && days !== null && days <= 10 && (
        <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-xl text-[10px] font-bold text-amber-600">
          <FaExclamationTriangle className="flex-shrink-0 text-[9px]" />
          Trial ends in {days} day{days !== 1 ? 's' : ''}
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