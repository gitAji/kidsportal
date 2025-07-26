"use client";

import { useState, useEffect, Suspense } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";
import Chat from "@/app/components/ui/Chat";
import Header from "@/app/components/layout/header/Header";
import Footer from "@/app/components/layout/footer/Footer";
import AuthModal from "@/app/components/ui/AuthModal";
import RightSidePanel from "@/app/components/RightSidePanel";
import HowItWorksContent from "@/app/components/HowItWorksContent";
import AboutUsContent from "@/app/components/AboutUsContent";
import OurTeamContent from "@/app/components/OurTeamContent";
import ExitIntentModal from "@/app/components/ui/ExitIntentModal";
import { useUI } from "@/app/providers/UIProvider"; // Import the context hook

export default function ParentLayout({ children }) {
  const [user, setUser] = useState(null);
  const [showExitIntentModal, setShowExitIntentModal] = useState(false);
  
  // Use the global state from our context
  const { panelState, modalState, closeModal, closePanel, openModal, openPanel } = useUI();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (user || sessionStorage.getItem('exitIntentShown')) {
        return;
      }
      if (event.clientY < 50) {
        setShowExitIntentModal(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };
    document.body.addEventListener("mouseleave", handleMouseLeave);
    return () => document.body.removeEventListener("mouseleave", handleMouseLeave);
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        setIsModalOpen={openModal}
        setIsRegister={(isRegister) => openModal(isRegister)}
        setIsHowItWorksOpen={() => openPanel('howItWorks')}
        setIsAboutUsOpen={() => openPanel('about')}
        setIsOurTeamOpen={() => openPanel('team')}
      />
      <main className="flex-grow">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </main>
      <Chat />
      <Footer />
      <AuthModal
        isModalOpen={modalState.auth}
        setIsModalOpen={closeModal}
        isRegister={modalState.isRegister}
        setIsRegister={() => {}} // Context handles this
      />
      <RightSidePanel panelName="How It Works" isOpen={panelState.howItWorks} onClose={() => closePanel('howItWorks')}>
        <HowItWorksContent />
      </RightSidePanel>
      <RightSidePanel panelName="About Us" isOpen={panelState.about} onClose={() => closePanel('about')}>
        <AboutUsContent />
      </RightSidePanel>
      <RightSidePanel panelName="Our Team" isOpen={panelState.team} onClose={() => closePanel('team')}>
        <OurTeamContent />
      </RightSidePanel>
      {showExitIntentModal && (
        <ExitIntentModal
          isOpen={showExitIntentModal}
          onClose={() => setShowExitIntentModal(false)}
          setIsModalOpen={() => openModal(false)}
          setIsRegister={() => openModal(true)}
        />
      )}
    </div>
  );
}
