"use client";
import React, { createContext, useContext, useState, useCallback } from 'react';

const UnsavedChangesContext = createContext();

// Lets any page (like the Curriculum Builder) register that it has unsaved
// edits, so shared chrome (like the sidebar) can warn before navigating away
// and silently discarding them.
export function UnsavedChangesProvider({ children }) {
    const [isDirty, setIsDirty] = useState(false);

    const guardNavigation = useCallback(() => {
        if (!isDirty) return true;
        return window.confirm("You have unsaved changes that will be lost. Leave this page anyway?");
    }, [isDirty]);

    return (
        <UnsavedChangesContext.Provider value={{ isDirty, setIsDirty, guardNavigation }}>
            {children}
        </UnsavedChangesContext.Provider>
    );
}

export function useUnsavedChanges() {
    return useContext(UnsavedChangesContext) || { isDirty: false, setIsDirty: () => {}, guardNavigation: () => true };
}
