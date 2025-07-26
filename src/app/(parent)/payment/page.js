"use client";
import { Suspense } from "react";
import Header from "@/app/components/layout/header/Header";
import Footer from "@/app/components/layout/footer/Footer";
import dynamic from 'next/dynamic';

const PaymentContent = dynamic(() => import('./PaymentContent'), { ssr: false });

export default function PaymentPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow p-4 flex flex-col items-center justify-center">
        <Suspense fallback={<div>Loading payment details...</div>}>
          <PaymentContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}