"use client";

import { ChildProvider, useChild } from "../providers/ChildProvider";
import ChildLearningZoneHeader from "../components/child/ChildLearningZoneHeader";
import ChildLearningZoneFooter from "../components/child/ChildLearningZoneFooter";
import { ChildThemeProvider } from "../providers/ChildThemeProvider";
import { LanguageProvider } from "../providers/LanguageProvider";
import LearningZonePageNavigation from "../components/child/LearningZonePageNavigation";
import TimeTracker from "../components/child/TimeTracker";

function LearningZoneCore({ children }) {
    const { childUser } = useChild(); // Now gets user from context

    if (!childUser) {
        return null; // Or a loading spinner, as the provider handles the main loading state
    }

    return (
        <ChildThemeProvider childThemeId={childUser.theme}>
            <div className="flex flex-col min-h-screen bg-[var(--child-background)]">
                <TimeTracker />
                <ChildLearningZoneHeader />
                <main className="flex-grow p-4 sm:p-6 md:p-8">
                    <LearningZonePageNavigation />
                    {children}
                </main>
                <ChildLearningZoneFooter />
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
