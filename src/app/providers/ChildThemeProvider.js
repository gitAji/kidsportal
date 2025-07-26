"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

const ChildThemeContext = createContext(null);

export const useChildTheme = () => useContext(ChildThemeContext);

const themes = [
  { id: 'default', name: 'Default', colors: { primary: '#3B82F6', background: '#DBEAFE' } },
  { id: 'green', name: 'Forest Green', colors: { primary: '#10B981', background: '#D1FAE5' } },
  { id: 'purple', name: 'Royal Purple', colors: { primary: '#8B5CF6', background: '#EDE9FE' } },
  { id: 'orange', name: 'Sunset Orange', colors: { primary: '#F97316', background: '#FFEDD5' } },
];

export const ChildThemeProvider = ({ children, childThemeId }) => {
  const [currentTheme, setCurrentTheme] = useState(themes[0]); // Default to first theme

  useEffect(() => {
    const theme = themes.find(t => t.id === childThemeId) || themes[0];
    setCurrentTheme(theme);

    // Apply CSS variables to the document root
    document.documentElement.style.setProperty('--child-primary', theme.colors.primary);
    document.documentElement.style.setProperty('--child-background', theme.colors.background);
  }, [childThemeId]);

  const value = { currentTheme, themes };

  return (
    <ChildThemeContext.Provider value={value}>
      {children}
    </ChildThemeContext.Provider>
  );
};
