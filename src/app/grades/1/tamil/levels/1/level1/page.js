"use client"; // Ensure this component is treated as a client component

import dynamic from 'next/dynamic';

const Level1Content = dynamic(() => import('./Level1Content'), { ssr: false });

export default function Level1() {
  return <Level1Content />;
}