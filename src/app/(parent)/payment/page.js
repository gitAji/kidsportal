"use client";
import { Suspense } from "react";
import Header from "@/app/components/layout/header/Header";
import Footer from "@/app/components/layout/footer/Footer";
import dynamic from 'next/dynamic';

const PaymentContent = dynamic(() => import('./PaymentContent'), { ssr: false });

export default function PaymentPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      <Header />
      <main className="flex-grow p-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <Suspense fallback={<div className="animate-pulse text-indigo-500 font-bold">Loading secure checkout...</div>}>
          <PaymentContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}