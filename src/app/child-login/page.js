"use client";
import { Suspense } from 'react';
import ChildLoginForm from "../components/child/ChildLoginForm";

export default function ChildLoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChildLoginForm />
    </Suspense>
  );
}