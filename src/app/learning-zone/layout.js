"use client";

import { ChildProvider, useChild } from "../providers/ChildProvider";
import ChildLearningZoneHeader from "../components/child/ChildLearningZoneHeader";
import { ChildThemeProvider } from "../providers/ChildThemeProvider";
import { LanguageProvider } from "../providers/LanguageProvider";
import TimeTracker from "../components/child/TimeTracker";

function LearningZoneCore({ children }) {
    const { childUser } = useChild(); // Now gets user from context

    if (!childUser) {
        return null; // Or a loading spinner, as the provider handles the main loading state
    }

    return (
        <ChildThemeProvider childThemeId={childUser.theme}>
            <div className="flex flex-col min-h-screen bg-[var(--child-background)] relative overflow-hidden font-sans">
                {/* Playful Background Elements for all Learning Zone pages */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.15] z-0 fixed">
                   <div className="absolute top-[10%] left-[5%] w-32 sm:w-48 h-32 sm:h-48 bg-yellow-400 rounded-full blur-[60px]" />
                   <div className="absolute bottom-[20%] right-[10%] w-48 sm:w-64 h-48 sm:h-64 bg-pink-400 rounded-full blur-[80px]" />
                   <div className="absolute top-[40%] left-[60%] w-40 sm:w-56 h-40 sm:h-56 bg-teal-400 rounded-full blur-[70px]" />
                </div>
                
                <div className="relative z-10 flex flex-col min-h-screen w-full">
                  <TimeTracker />
                  <ChildLearningZoneHeader />
                  <main className="flex-grow p-2 sm:p-4 md:p-6">
                      {children}
                  </main>
                </div>
            </div>
        </ChildThemeProvider>
    );
}

export default function LearningZoneLayout({ children }) {
    return (
        <ChildProvider>
            <LanguageProvider>
                <LearningZoneCore>{children}</LearningZoneCore>
            </LanguageProvider>
        </ChildProvider>
    );
}
