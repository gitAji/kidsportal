"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
    en: {
        welcome: "Welcome back",
        explorer: "Explorer",
        ready_adventure: "Ready for today's adventure?",
        choose_subject: "Choose a subject below to explore new levels and earn stars!",
        play_now: "Play Now",
        stars_earned: "Stars Earned",
        current_level: "Current Level",
        achievements: "Achievements",
        settings: "Settings",
        logout: "Logout Profile",
        next_level: "Next Level",
        see_you_soon: "See you soon, Explorer!",
        preparing_logout: "Preparing your logout...",
        subjects: {
            "English": "English",
            "Math": "Math",
            "Tamil": "Tamil",
            "Science": "Science",
            "Ariviyal": "Science"
        }
    },
    ta: {
        welcome: "மீண்டும் வருக",
        explorer: "ஆராய்ச்சியாளர்",
        ready_adventure: "இன்றைய சாகசத்திற்கு தயாரா?",
        choose_subject: "புதிய நிலைகளை ஆராய்ந்து நட்சத்திரங்களைப் பெற கீழே ஒரு பாடத்தைத் தேர்ந்தெடுக்கவும்!",
        play_now: "இப்போது விளையாடு",
        stars_earned: "ஈட்டிய நட்சத்திரங்கள்",
        current_level: "தற்போதைய நிலை",
        achievements: "சாதனைகள்",
        settings: "அமைப்புகள்",
        logout: "வெளியேறு",
        next_level: "அடுத்த நிலை",
        see_you_soon: "மீண்டும் சந்திப்போம், ஆராய்ச்சியாளரே!",
        preparing_logout: "வெளியேறத் தயாராகிறது...",
        subjects: {
            "English": "ஆங்கிலம்",
            "Math": "கணிதம்",
            "Tamil": "தமிழ்",
            "Science": "அறிவியல்",
            "Ariviyal": "அறிவியல்"
        }
    }
};

export function LanguageProvider({ children }) {
    // Default to Tamil (ta) as requested
    const [language, setLanguage] = useState('ta');

    const t = (key) => {
        const keys = key.split('.');
        let result = translations[language];
        for (const k of keys) {
            if (result[k]) {
                result = result[k];
            } else {
                return key;
            }
        }
        return result;
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ta' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
