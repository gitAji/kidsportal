"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useChild } from './ChildProvider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

const LanguageContext = createContext();

// Map parent's learningLanguage setting to our language codes
const LANGUAGE_CODE_MAP = {
    English: 'en',
    Tamil: 'ta',
    Norwegian: 'no',
    French: 'fr',
    Spanish: 'es',
    German: 'de',
    Arabic: 'ar',
    Mandarin: 'zh',
    Hindi: 'hi',
    Sinhala: 'si',
    Malay: 'ms',
    Swedish: 'sv',
    Danish: 'da',
    Finnish: 'fi',
    Portuguese: 'pt',
    Japanese: 'ja',
    Korean: 'ko',
};

// ══════════════════════════════════════════════════════════════════
// Comprehensive translations for the learning zone
// ══════════════════════════════════════════════════════════════════
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
        switch_lang: "தமிழ்",

        // Task Content Page
        listenToLesson: "Listen to Lesson",
        lessonMastery: "Lesson Mastery",
        quizMastery: "Quiz Mastery",
        examMastery: "Exam Mastery",
        proceedToNext: "Proceed to Next",
        backToLevels: "Back to Levels",
        yourAnswer: "Your Answer",
        correctText: "Correct!",
        wrongText: "Wrong!",
        tryAgain: "Try Again",
        checkAnswer: "Check Answer",
        selectOption: "Select Option",
        typeAnswer: "Type Answer",
        feedbackGood: "Awesome! 🌟 +10 pts",
        feedbackBad: "Oops! Try again 💪",
        lessonComplete: "Lesson Complete!",
        pointsAdded: "Points Added",
        myRewards: "My Rewards",
        backToMap: "Back to Map 🗺️",
        detailedRecap: "Full Detailed Recap",
        question: "Question",
        skipped: "Skipped",
        correctAnswer: "Correct Answer",
        timeTaken: "Time Taken",
        scoreLabel: "Score",
        incorrectText: "Incorrect!",
        time_left: "Time Left",
        one_min_left: "One minute left! You can do it! ⏰",
        thirty_sec_left: "30 seconds left! Almost there! 🚀",
        ten_sec_left: "Quick! Only 10 seconds remaining! 🏁",
        thinking: "Thinking...",
        finish: "Finish! 🎉",
        next: "Next ➡️",
        skip: "Skip ⏭️",
        recentActivity: "Recent Activity",
        thinking_msg: "Hmm, let me look at that...",
        hi: "Hi",
        explorer: "Explorer",
        imCharacter: "I'm",
        keep_practicing: "Keep Practicing! 💪",
        perfect_medal: "Perfect! Gold Medal 🏆",
        great_medal: "Great! Silver Medal 🥈",
        good_medal: "Good Effort! Bronze 🥉",
        owl_name: "Professor Owl",
        panda_name: "Smart Panda",
        owl_default_msg: "Read carefully and give it your best shot!",
        panda_default_msg: "Let's learn together!",
        writing_instruction: "Draw clearly and click 'Done!' when finished",
        counting_instruction: "Try clicking on each one!",
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
        switch_lang: "English",

        // Task Content Page
        listenToLesson: "பாடத்தைக் கவனிக்கவும்",
        lessonMastery: "பாடத் தேர்ச்சி",
        quizMastery: "வினாடி வினா தேர்ச்சி",
        examMastery: "தேர்வுத் தேர்ச்சி",
        proceedToNext: "அடுத்த நிலைக்குச் செல்க",
        backToLevels: "நிலைகளுக்குத் திரும்பு",
        yourAnswer: "உமது பதில்",
        correctText: "சரி!",
        wrongText: "தவறு!",
        tryAgain: "மீண்டும் முயற்சி செய்",
        checkAnswer: "பதிலைச் சரிபார்க்கவும்",
        selectOption: "விருப்பத்தைத் தேர்ந்தெடுக்கவும்",
        typeAnswer: "பதிலைத் தட்டச்சு செய்க",
        feedbackGood: "அருமை! 🌟 +10 புள்ளிகள்",
        feedbackBad: "அய்யோ! மீண்டும் முயற்சி செய் 💪",
        lessonComplete: "பாடம் முடிந்தது!",
        pointsAdded: "புள்ளிகள் சேர்க்கப்பட்டன",
        myRewards: "எனது பரிசுகள்",
        backToMap: "வரைபடத்திற்குத் திரும்பு 🗺️",
        detailedRecap: "விரிவான மீள்பார்வை",
        question: "கேள்வி",
        skipped: "தவிர்க்கப்பட்டது",
        correctAnswer: "சரியான பதில்",
        timeTaken: "எடுத்த நேரம்",
        scoreLabel: "மதிப்பெண்",
        incorrectText: "தவறு!",
        time_left: "மீதமுள்ள நேரம்",
        one_min_left: "ஒரு நிமிடம் மீதமுள்ளது! உங்களால் முடியும்! ⏰",
        thirty_sec_left: "30 வினாடிகள் மீதமுள்ளன! இதோ முடிந்துவிடும்! 🚀",
        ten_sec_left: "விரைந்து செயல்படுங்கள்! 10 வினாடிகள் மட்டுமே உள்ளன! 🏁",
        thinking: "யோசிக்கிறேன்...",
        finish: "முடிந்தது! 🎉",
        next: "அடுத்து ➡️",
        skip: "தவிர் ⏭️",
        recentActivity: "சமீபத்திய செயல்பாடு",
        thinking_msg: "ம்ம், அதைச் சரிபார்க்கிறேன்...",
        hi: "வணக்கம்",
        explorer: "பயணி",
        imCharacter: "நான்",
        keep_practicing: "தொடர்ந்து பயிற்சி செய்யுங்கள்! 💪",
        perfect_medal: "அருமை! தங்கப் பதக்கம் 🏆",
        great_medal: "மிக நன்று! வெள்ளிப் பதக்கம் 🥈",
        good_medal: "நல்ல முயற்சி! வெண்கலப் பதக்கம் 🥉",
        owl_name: "பேராசிரியர் ஆந்தை",
        panda_name: "சமர்த்த Panda",
        owl_default_msg: "கவனமாகப் படித்து உங்கள் சிறந்த முயற்சியைக் கொடுங்கள்!",
        panda_default_msg: "ஒன்றாகக் கற்றுக்கொள்வோம்!",
        writing_instruction: "தெளிவாக வரையவும், முடிந்ததும் 'நன்று!' என்பதைக் கிளிக் செய்யவும்",
        counting_instruction: "ஒவ்வொன்றையும் கிளிக் செய்ய முயற்சிக்கவும்!",
    },

    no: {
        // Header
        stars_earned: "Stjerner opptjent",
        current_level: "Nåværende nivå",
        achievements: "Prestasjoner",
        settings: "Innstillinger",
        logout: "Logg ut",
        next_level: "Neste nivå",
        explorer_rank: "Utforsker-rang",
        see_you_soon: "Vi sees snart, Utforsker!",
        preparing_logout: "Forbereder utlogging...",

        // Main page
        explorer: "Utforsker",
        welcome: "Velkommen tilbake,",
        ready_adventure: "Klar for dagens eventyr? Velg et fag nedenfor for å utforske nye nivåer og tjene stjerner!",
        play_now: "Spill nå",
        adventure_on_hold: "Eventyret er satt på pause!",
        trial_ended: "Prøveperioden din er over. Be foreldrene dine om å fornye planen din slik at du kan fortsette!",
        log_out: "LOGG UT",

        // Subjects page
        select_level: "Velg et nivå",
        locked: "Låst",
        ready_to_play: "Klar til å spille!",
        no_levels: "Ingen nivåer funnet for dette faget ennå. Kom tilbake senere!",
        subject_not_found: "Fag ikke funnet.",
        back_to_dashboard: "Tilbake til dashbord",
        your_subjects: "Dine fag",
        no_subjects: "Ingen fag funnet for din klasse.",

        // Subject names
        subjects: {
            "English": "Engelsk",
            "Math": "Matematikk",
            "Tamil": "Tamil",
            "Science": "Naturfag",
            "Ariviyal": "Naturfag"
        },

        // Footer
        crafted: "Laget for kvalitet",
        inspiring: "Inspirerer neste generasjon",
        safety: "Sikkerhet og personvern garantert",

        // Language toggle
        switch_lang: "English"
    },

    fr: {
        stars_earned: "Étoiles gagnées",
        current_level: "Niveau actuel",
        achievements: "Réalisations",
        settings: "Paramètres",
        logout: "Déconnexion",
        next_level: "Niveau suivant",
        explorer_rank: "Rang Explorateur",
        see_you_soon: "À bientôt, Explorateur !",
        preparing_logout: "Préparation de la déconnexion...",
        explorer: "Explorateur",
        welcome: "Bienvenue,",
        ready_adventure: "Prêt pour l'aventure d'aujourd'hui ? Choisis une matière ci-dessous pour explorer de nouveaux niveaux et gagner des étoiles !",
        play_now: "Jouer",
        adventure_on_hold: "Aventure en pause !",
        trial_ended: "Votre période d'essai est terminée. Demandez à vos parents de renouveler votre plan !",
        log_out: "DÉCONNEXION",
        select_level: "Choisir un niveau",
        locked: "Verrouillé",
        ready_to_play: "Prêt à jouer !",
        no_levels: "Aucun niveau trouvé pour cette matière. Revenez plus tard !",
        subject_not_found: "Matière introuvable.",
        back_to_dashboard: "Retour au tableau de bord",
        your_subjects: "Vos matières",
        no_subjects: "Aucune matière trouvée pour votre classe.",
        subjects: { "English": "Anglais", "Math": "Mathématiques", "Tamil": "Tamoul", "Science": "Sciences", "Ariviyal": "Sciences" },
        crafted: "Conçu pour l'excellence",
        inspiring: "Inspirer la prochaine génération",
        safety: "Sécurité et confidentialité garanties",
        switch_lang: "English"
    },

    es: {
        stars_earned: "Estrellas ganadas",
        current_level: "Nivel actual",
        achievements: "Logros",
        settings: "Configuración",
        logout: "Cerrar sesión",
        next_level: "Siguiente nivel",
        explorer_rank: "Rango Explorador",
        see_you_soon: "¡Hasta pronto, Explorador!",
        preparing_logout: "Preparando cierre de sesión...",
        explorer: "Explorador",
        welcome: "Bienvenido de nuevo,",
        ready_adventure: "¿Listo para la aventura de hoy? ¡Elige una materia para explorar nuevos niveles y ganar estrellas!",
        play_now: "Jugar",
        adventure_on_hold: "¡Aventura en pausa!",
        trial_ended: "Tu periodo de prueba ha terminado. ¡Pide a tus padres que renueven tu plan!",
        log_out: "CERRAR SESIÓN",
        select_level: "Selecciona un nivel",
        locked: "Bloqueado",
        ready_to_play: "¡Listo para jugar!",
        no_levels: "No se encontraron niveles para esta materia. ¡Vuelve más tarde!",
        subject_not_found: "Materia no encontrada.",
        back_to_dashboard: "Volver al panel",
        your_subjects: "Tus materias",
        no_subjects: "No se encontraron materias para tu grado.",
        subjects: { "English": "Inglés", "Math": "Matemáticas", "Tamil": "Tamil", "Science": "Ciencias", "Ariviyal": "Ciencias" },
        crafted: "Hecho con excelencia",
        inspiring: "Inspirando a la próxima generación",
        safety: "Seguridad y privacidad garantizadas",
        switch_lang: "English"
    },

    de: {
        stars_earned: "Verdiente Sterne",
        current_level: "Aktuelles Level",
        achievements: "Erfolge",
        settings: "Einstellungen",
        logout: "Abmelden",
        next_level: "Nächstes Level",
        explorer_rank: "Entdecker-Rang",
        see_you_soon: "Bis bald, Entdecker!",
        preparing_logout: "Abmeldung wird vorbereitet...",
        explorer: "Entdecker",
        welcome: "Willkommen zurück,",
        ready_adventure: "Bereit für das heutige Abenteuer? Wähle ein Fach, um neue Level zu entdecken und Sterne zu sammeln!",
        play_now: "Jetzt spielen",
        adventure_on_hold: "Abenteuer pausiert!",
        trial_ended: "Deine Testphase ist abgelaufen. Bitte deine Eltern, deinen Plan zu verlängern!",
        log_out: "ABMELDEN",
        select_level: "Wähle ein Level",
        locked: "Gesperrt",
        ready_to_play: "Bereit zum Spielen!",
        no_levels: "Noch keine Level für dieses Fach gefunden. Komm später wieder!",
        subject_not_found: "Fach nicht gefunden.",
        back_to_dashboard: "Zurück zum Dashboard",
        your_subjects: "Deine Fächer",
        no_subjects: "Keine Fächer für deine Klasse gefunden.",
        subjects: { "English": "Englisch", "Math": "Mathematik", "Tamil": "Tamil", "Science": "Naturwissenschaften", "Ariviyal": "Naturwissenschaften" },
        crafted: "Für Spitzenleistung gemacht",
        inspiring: "Die nächste Generation inspirieren",
        safety: "Sicherheit und Datenschutz garantiert",
        switch_lang: "English"
    },
};

// ══════════════════════════════════════════════════════════════════
// Provider Component
// ══════════════════════════════════════════════════════════════════
export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');
    const [languageLoaded, setLanguageLoaded] = useState(false);
    const { childUser } = useChild();

    // Auto-detect language from parent's learningLanguage setting
    useEffect(() => {
        const loadLanguage = async () => {
            if (!childUser?.parentUid) {
                setLanguageLoaded(true);
                return;
            }

            try {
                const parentSnap = await getDoc(doc(db, 'users', childUser.parentUid));
                if (parentSnap.exists()) {
                    const parentLang = parentSnap.data().learningLanguage || 'English';
                    const code = LANGUAGE_CODE_MAP[parentLang] || 'en';
                    // Only set if we have translations for it, otherwise fallback to 'en'
                    setLanguage(translations[code] ? code : 'en');
                }
            } catch (err) {
                console.error('Error loading parent language preference:', err);
            }
            setLanguageLoaded(true);
        };

        loadLanguage();
    }, [childUser]);

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
        <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage, languageLoaded }}>
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
