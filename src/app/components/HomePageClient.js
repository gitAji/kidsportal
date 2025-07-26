"use client";

import { useUI } from "../providers/UIProvider";
import AuthModal from "./ui/AuthModal";
import RightSidePanel from "./RightSidePanel";
import OurTeamContent from "./OurTeamContent";
import HowItWorksContent from "./HowItWorksContent";
import AboutUsContent from "./AboutUsContent";

export default function HomePageClient({ children }) {
  const { panelState, closeModal, closePanel, modalState } = useUI();

  return (
    <>
      {children}

      <AuthModal
        isModalOpen={modalState.auth}
        setIsModalOpen={(isOpen) => {
          if (!isOpen) closeModal();
        }}
        isRegister={modalState.isRegister}
        setIsRegister={() => {}} // The context now handles this
      />

      <RightSidePanel isOpen={panelState.team} onClose={() => closePanel('team')} panelName="Our Team">
        <OurTeamContent />
      </RightSidePanel>
      
      <RightSidePanel isOpen={panelState.howItWorks} onClose={() => closePanel('howItWorks')} panelName="How It Works">
        <HowItWorksContent />
      </RightSidePanel>

      <RightSidePanel isOpen={panelState.about} onClose={() => closePanel('about')} panelName="About Us">
        <AboutUsContent />
      </RightSidePanel>
    </>
  );
}
