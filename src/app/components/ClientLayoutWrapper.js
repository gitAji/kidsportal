// app/components/ClientLayoutWrapper.jsx
"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { auth } from "../../firebase/auth"; // Import auth
import FloatingChatButton from "./ui/FloatingChatButton";
import Chat from "./ui/Chat";
import Header from "./layout/header/Header";
import Footer from "./layout/footer/Footer";
import AuthModal from "./ui/AuthModal"; // Import the AuthModal
import RightSidePanel from "./RightSidePanel";
import HowItWorksContent from "./HowItWorksContent";
import AboutUsContent from "./AboutUsContent";
import OurTeamContent from "./OurTeamContent";
import ExitIntentModal from "./ui/ExitIntentModal"; // Import the new ExitIntentModal

export default function ClientLayoutWrapper({ children }) {
  const [user, setUser] = useState(null); // State to hold user session
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isOurTeamOpen, setIsOurTeamOpen] = useState(false);
  const [showExitIntentModal, setShowExitIntentModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleMouseLeave = (event) => {
      // If user is logged in, don't show the modal
      if (user) {
        return;
      }

      // Check if the mouse is moving towards the top of the viewport
      if (event.clientY < 50) {
        // Adjust 50px threshold as needed
        setShowExitIntentModal(true);
      }
    };

    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [user]); // Add user to dependency array

  console.log('ClientLayoutWrapper state (before render):', {
    isHowItWorksOpen,
    isAboutUsOpen,
    isOurTeamOpen,
  });

  return (
    <>
      <Header
        setIsModalOpen={setIsModalOpen}
        setIsRegister={setIsRegister}
        setIsHowItWorksOpen={(value) => {
          console.log(`Attempting to set isHowItWorksOpen from ${isHowItWorksOpen} to ${value}`);
          setIsHowItWorksOpen(value);
        }}
        setIsAboutUsOpen={(value) => {
          console.log(`Attempting to set isAboutUsOpen from ${isAboutUsOpen} to ${value}`);
          setIsAboutUsOpen(value);
        }}
        setIsOurTeamOpen={(value) => {
          console.log(`Attempting to set isOurTeamOpen from ${isOurTeamOpen} to ${value}`);
          setIsOurTeamOpen(value);
        }}
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
      <RightSidePanel panelName="How It Works" isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)}>
        <HowItWorksContent />
      </RightSidePanel>
      <RightSidePanel panelName="About Us" isOpen={isAboutUsOpen} onClose={() => setIsAboutUsOpen(false)}>
        <AboutUsContent />
      </RightSidePanel>
      <RightSidePanel panelName="Our Team" isOpen={isOurTeamOpen} onClose={() => setIsOurTeamOpen(false)}>
        <OurTeamContent />
      </RightSidePanel>
      {showExitIntentModal && (
        <ExitIntentModal
          isOpen={showExitIntentModal}
          onClose={() => setShowExitIntentModal(false)}
          setIsModalOpen={setIsModalOpen}
          setIsRegister={setIsRegister}
        />
      )}
    </>
  );
}