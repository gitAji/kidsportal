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
import OurTeamContent from "./OurTeamContent";

export default function ClientLayoutWrapper({ children }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isOurTeamOpen, setIsOurTeamOpen] = useState(false);

  const handleSetIsHowItWorksOpen = (value) => {
    console.log(`Setting isHowItWorksOpen to ${value}`);
    setIsHowItWorksOpen(value);
  };

  const handleSetIsAboutUsOpen = (value) => {
    console.log(`Setting isAboutUsOpen to ${value}`);
    setIsAboutUsOpen(value);
  };

  const handleSetIsOurTeamOpen = (value) => {
    console.log(`Setting isOurTeamOpen to ${value}`);
    setIsOurTeamOpen(value);
  };

  return (
    <>
      <Header
        setIsModalOpen={setIsModalOpen}
        setIsRegister={setIsRegister}
        setIsHowItWorksOpen={handleSetIsHowItWorksOpen}
        setIsAboutUsOpen={handleSetIsAboutUsOpen}
        setIsOurTeamOpen={handleSetIsOurTeamOpen}
      />
      {children}
      <FloatingChatButton onClick={() => setIsChatOpen(true)} />
      <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <Footer />
      <AuthModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isRegister={isRegister}
        setIsRegister={isRegister}
      />
      <RightSidePanel isOpen={isHowItWorksOpen} onClose={() => handleSetIsHowItWorksOpen(false)}>
        <HowItWorksContent />
      </RightSidePanel>
      <RightSidePanel isOpen={isAboutUsOpen} onClose={() => handleSetIsAboutUsOpen(false)}>
        <AboutUsContent />
      </RightSidePanel>
      <RightSidePanel isOpen={isOurTeamOpen} onClose={() => handleSetIsOurTeamOpen(false)}>
        <OurTeamContent />
      </RightSidePanel>
    </>
  );
}