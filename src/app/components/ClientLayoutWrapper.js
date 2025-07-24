"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"; // Import onAuthStateChanged
import { auth } from "../../firebase/auth"; // Import auth
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
      // If user is logged in, or modal has been shown, don't show it
      if (user || sessionStorage.getItem('exitIntentShown')) {
        return;
      }

      // Check if the mouse is moving towards the top of the viewport
      if (event.clientY < 50) {
        // Adjust 50px threshold as needed
        setShowExitIntentModal(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };

    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.body.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [user]); // Add user to dependency array

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        setIsModalOpen={setIsModalOpen}
        setIsRegister={setIsRegister}
        setIsHowItWorksOpen={setIsHowItWorksOpen}
        setIsAboutUsOpen={setIsAboutUsOpen}
        setIsOurTeamOpen={setIsOurTeamOpen}
      />
      <main className="flex-grow">{children}</main>
      <Chat />
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
    </div>
  );
}
