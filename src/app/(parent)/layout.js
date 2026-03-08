"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { PageLoader, DashboardSkeleton } from "@/app/components/ui/SkeletonLoader";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import Header from "@/app/components/layout/header/Header";
import Footer from "@/app/components/layout/footer/Footer";
import DashboardFooter from "@/app/components/layout/footer/DashboardFooter";
import { useUI } from "@/app/providers/UIProvider";


import ParentGuard from "./ParentGuard";

// Dynamic imports for optimized loading
const Chat = dynamic(() => import("@/app/components/ui/Chat"), { ssr: false });
const AuthModal = dynamic(() => import("@/app/components/ui/AuthModal"), { ssr: false });
const ExitIntentModal = dynamic(() => import("@/app/components/ui/ExitIntentModal"), { ssr: false });
const RightSidePanel = dynamic(() => import("@/app/components/RightSidePanel"), { ssr: false });
const ParentSidebar = dynamic(() => import("@/app/components/layout/ParentSidebar"), { ssr: false });
const HowItWorksContent = dynamic(() => import("@/app/components/HowItWorksContent"));
const AboutUsContent = dynamic(() => import("@/app/components/AboutUsContent"));
const OurTeamContent = dynamic(() => import("@/app/components/OurTeamContent"));

export default function ParentLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [showExitIntentModal, setShowExitIntentModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Routes that should use the Workspace (Sidebar) Layout
  const workspacePaths = [
    '/dashboard', '/analytics', '/child-dashboard', '/profile',
    '/billing', '/pricing', '/child-profile', '/child-settings',
    '/subscription-management', '/avatar-customizer', '/avatar-shop',
    '/sticker-book', '/payment', '/grades'
  ];
  const isWorkspace = workspacePaths.some(path => pathname?.startsWith(path));

  const { panelState, modalState, closeModal, closePanel, openModal, openPanel } = useUI();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (user || sessionStorage.getItem('exitIntentShown') || loadingAuth) {
        return;
      }
      if (event.clientY < 50) {
        setShowExitIntentModal(true);
        sessionStorage.setItem('exitIntentShown', 'true');
      }
    };
    document.body.addEventListener("mouseleave", handleMouseLeave);
    return () => document.body.removeEventListener("mouseleave", handleMouseLeave);
  }, [user, loadingAuth]);

  // If we are on a workspace route and auth is still loading, show a clean spinner
  if (loadingAuth && isWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <PageLoader message="Loading KidsPortal..." />
      </div>
    );
  }

  // Final decision: Should we show the Sidebar Workspace?
  const showSidebar = user && isWorkspace;

  return (
    <ParentGuard>
      {showSidebar ? (
        <div className="flex bg-slate-50 h-screen overflow-hidden">
          <ParentSidebar />
          <div className="flex-grow flex flex-col h-full overflow-hidden min-w-0">
            <main className="flex-grow overflow-y-auto bg-slate-50/50 flex flex-col">
              <div className="flex-grow">
                <Suspense fallback={<DashboardSkeleton />}>
                  {children}
                </Suspense>
              </div>
              <DashboardFooter />
            </main>
          </div>
          <Chat />
          <AuthModal
            isModalOpen={modalState.auth}
            setIsModalOpen={closeModal}
            isRegister={modalState.isRegister}
            setIsRegister={openModal}
          />
        </div>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Header
            setIsModalOpen={openModal}
            setIsRegister={(isRegister) => openModal(isRegister)}
            setIsHowItWorksOpen={() => openPanel('howItWorks')}
            setIsAboutUsOpen={() => openPanel('about')}
            setIsOurTeamOpen={() => openPanel('team')}
          />
          <main className="flex-grow">
            <Suspense fallback={<PageLoader message="Initializing your workspace..." />}>
              {children}
            </Suspense>
          </main>
          <Chat />
          <Footer />
          <AuthModal
            isModalOpen={modalState.auth}
            setIsModalOpen={closeModal}
            isRegister={modalState.isRegister}
            setIsRegister={openModal}
          />
          <RightSidePanel panelName="How It Works" isOpen={panelState.howItWorks} onClose={() => closePanel('howItWorks')}>
            <HowItWorksContent onClose={() => closePanel('howItWorks')} />
          </RightSidePanel>
          <RightSidePanel panelName="About Us" isOpen={panelState.about} onClose={() => closePanel('about')}>
            <AboutUsContent onClose={() => closePanel('about')} />
          </RightSidePanel>
          <RightSidePanel panelName="Our Team" isOpen={panelState.team} onClose={() => closePanel('team')}>
            <OurTeamContent onClose={() => closePanel('team')} />
          </RightSidePanel>
          {showExitIntentModal && (
            <ExitIntentModal
              isOpen={showExitIntentModal}
              onClose={() => setShowExitIntentModal(false)}
              setIsModalOpen={() => openModal(false)}
              setIsRegister={() => openModal(true)}
              isLoggedIn={!!user}
            />
          )}
        </div>
      )}
    </ParentGuard>
  );
}
