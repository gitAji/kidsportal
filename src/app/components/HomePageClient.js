"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "./ui/AuthModal";

export default function HomePageClient({ children }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const toggleModal = (register = false) => {
    setIsRegister(register);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      {/* This is a placeholder for where the buttons to open the modal would be.
          Since the header is not provided, I'll assume they are there. */}
      {children}
      <AuthModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
    </>
  );
}
