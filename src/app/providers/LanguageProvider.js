"use client";
import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

// Comprehensive Tamil translations for the entire learning zone
export const translations = {
    en: {
        // Header
        stars_earned: "Stars Earned",
        current_level: "Current Level",
        achievements: "Achievements",
        settings: "Settings",
        logout: "Logout Profile",
        next_level: "Next Level",
        explorer_rank: "Explorer Rank",
        see_you_soon: "See you soon, Explorer!",
        preparing_logout: "Preparing your logout...",

        // Main page
        explorer: "Explorer",
        welcome: "Welcome back,",
        ready_adventure: "Ready for today's adventure? Choose a subject below to explore new levels and earn stars!",
        play_now: "Play Now",
        adventure_on_hold: "Adventure on Hold!",
        trial_ended: "Your learning trial has come to an end. Ask your parents to renew your plan so you can continue your quest!",
        log_out: "LOG OUT",

        // Subjects page
        select_level: "Select a Level",
        locked: "Locked",
        ready_to_play: "Ready to play!",
        no_levels: "No levels found for this subject yet. Come back later!",
        subject_not_found: "Subject not found.",
        back_to_dashboard: "Back to Dashboard",
        your_subjects: "Your Subjects",
        no_subjects: "No subjects found for your grade.",

        // Subject names
        subjects: {
            "English": "English",
            "Math": "Math",
            "Tamil": "Tamil",
            "Science": "Science",
            "Ariviyal": "Science"
        },

        // Footer
        crafted: "Crafted for Excellence",
        inspiring: "Inspiring the next generation",
        safety: "Safety & Privacy Guaranteed",

        // Language toggle
        switch_lang: "தமிழ்"
    },
    ta: {
        // Header
        stars_earned: "பெற்ற நட்சத்திரங்கள்",
        current_level: "தற்போதைய நிலை",
        achievements: "சாதனைகள்",
        settings: "அமைப்புகள்",
        logout: "வெளியேறு",
        next_level: "அடுத்த நிலை",
        explorer_rank: "ஆராய்ச்சியாளர் நிலை",
        see_you_soon: "மீண்டும் சந்திப்போம், ஆராய்ச்சியாளரே!",
        preparing_logout: "வெளியேறத் தயாராகிறது...",

        // Main page
        explorer: "ஆராய்ச்சியாளர்",
        welcome: "மீண்டும் வருக,",
        ready_adventure: "இன்றைய சாகசத்திற்கு தயாரா? புதிய நிலைகளை ஆராய கீழே ஒரு பாடத்தைத் தேர்ந்தெடுக்கவும்!",
        play_now: "இப்போது விளையாடு",
        adventure_on_hold: "சாகசம் நிறுத்தப்பட்டது!",
        trial_ended: "உங்கள் கற்றல் சோதனை முடிந்துவிட்டது. உங்கள் திட்டத்தைப் புதுப்பிக்க பெற்றோரிடம் கேளுங்கள்!",
        log_out: "வெளியேறு",

        // Subjects page
        select_level: "ஒரு நிலையைத் தேர்ந்தெடுக்கவும்",
        locked: "பூட்டப்பட்டது",
        ready_to_play: "விளையாடத் தயார்!",
        no_levels: "இந்த பாடத்திற்கு இன்னும் நிலைகள் இல்லை. பிறகு வாருங்கள்!",
        subject_not_found: "பாடம் கிடைக்கவில்லை.",
        back_to_dashboard: "டாஷ்போர்டுக்கு திரும்பு",
        your_subjects: "உங்கள் பாடங்கள்",
        no_subjects: "உங்கள் வகுப்பிற்கான பாடங்கள் இல்லை.",

        // Subject names
        subjects: {
            "English": "ஆங்கிலம்",
            "Math": "கணிதம்",
            "Tamil": "தமிழ்",
            "Science": "அறிவியல்",
            "Ariviyal": "அறிவியல்"
        },

        // Footer
        crafted: "சிறந்ததாக உருவாக்கப்பட்டது",
        inspiring: "அடுத்த தலைமுறையை ஊக்கப்படுத்துகிறது",
        safety: "பாதுகாப்பு மற்றும் தனியுரிமை உத்தரவாதம்",

        // Language toggle
        switch_lang: "English"
    }
};

export function LanguageProvider({ children }) {
    // Default to Tamil (ta) as requested
    const [language, setLanguage] = useState('ta');

    const t = (key) => {
        const keys = key.split('.');
        let result = translations[language];
        for (const k of keys) {
            if (result && result[k] !== undefined) {
                result = result[k];
            } else {
                // Fallback to English
                let fallback = translations['en'];
                for (const fk of keys) {
                    if (fallback && fallback[fk] !== undefined) {
                        fallback = fallback[fk];
                    } else {
                        return key;
                    }
                }
                return fallback;
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
