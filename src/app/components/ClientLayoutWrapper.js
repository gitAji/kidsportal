// app/components/ClientLayoutWrapper.jsx
"use client";

import { useState } from "react";
import FloatingChatButton from "./ui/FloatingChatButton";
import Chat from "./ui/Chat";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import AuthModal from "./ui/AuthModal"; // Import the AuthModal
import RightSidePanel from "./RightSidePanel";
import HowItWorksContent from "./HowItWorksContent";
import AboutUsContent from "./AboutUsContent";


export default function ClientLayoutWrapper({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);

  return (
    <>
      <Header
        setIsModalOpen={setIsModalOpen}
        setIsRegister={setIsRegister}
        setIsHowItWorksOpen={setIsHowItWorksOpen}
        setIsAboutUsOpen={setIsAboutUsOpen}
      />
      {children}
      <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <Footer />
      <AuthModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isRegister={isRegister}
        setIsRegister={setIsRegister}
      />
      <RightSidePanel isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)}>
        <HowItWorksContent />
      </RightSidePanel>
      <RightSidePanel isOpen={isAboutUsOpen} onClose={() => setIsAboutUsOpen(false)}>
        <AboutUsContent />
      </RightSidePanel>
    </>
  );
}
