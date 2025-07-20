"use client";

import dynamic from 'next/dynamic';

const Level2Content = dynamic(() => import('./Level2Content'), { ssr: false });

export default function Level2() {
  return <Level2Content />;
}
