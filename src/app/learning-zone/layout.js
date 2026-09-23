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
            <div className="flex flex-col min-h-screen bg-[var(--child-background)]">
                <TimeTracker />
                <ChildLearningZoneHeader />
                <main className="flex-grow p-2 sm:p-4 md:p-6">
                    {children}
                </main>
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
