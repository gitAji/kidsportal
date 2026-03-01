"use client";

import React from 'react';
import Image from 'next/image';

export default function KidFriendlyLoader({ message = "Loading fun stuff..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-cyan-100">
      <div className="animate-bounce mb-4">
        <Image src="/logo.png" alt="Loading" width={100} height={100} />
      </div>
      <p className="text-xl font-semibold text-gray-700">{message}</p>
    </div>
  );
}
