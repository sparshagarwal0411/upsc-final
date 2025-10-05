import React, { createContext, useContext, useState } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'nav.exams': 'Exams',
    'nav.notifications': 'Notifications',
    'nav.pastPapers': 'Past Papers',
    'nav.applicationStatus': 'Application Status',
    'nav.resources': 'Resources',
    'nav.contact': 'Contact',
    'home.welcome': 'Welcome to UPSC Portal',
    'home.subtitle': 'Your gateway to civil services excellence',
    'dashboard.upcomingExams': 'Upcoming Exams',
    'dashboard.recentNotifications': 'Recent Notifications',
    'dashboard.quickLinks': 'Quick Links',
    'dashboard.examCalendar': 'Exam Calendar',
    'chatbot.title': 'UPSC Assistant',
    'chatbot.placeholder': 'Ask me about UPSC exams...',
    'accessibility.fontSize': 'Font Size',
    'accessibility.highContrast': 'High Contrast',
    'theme.toggle': 'Toggle Theme',
  },
  hi: {
    'nav.exams': 'परीक्षा',
    'nav.notifications': 'सूचनाएं',
    'nav.pastPapers': 'पुराने प्रश्न पत्र',
    'nav.applicationStatus': 'आवेदन स्थिति',
    'nav.resources': 'संसाधन',
    'nav.contact': 'संपर्क',
    'home.welcome': 'यूपीएससी पोर्टल में आपका स्वागत है',
    'home.subtitle': 'सिविल सेवा उत्कृष्टता का आपका प्रवेश द्वार',
    'dashboard.upcomingExams': 'आगामी परीक्षाएं',
    'dashboard.recentNotifications': 'हाल की सूचनाएं',
    'dashboard.quickLinks': 'त्वरित लिंक',
    'dashboard.examCalendar': 'परीक्षा कैलेंडर',
    'chatbot.title': 'यूपीएससी सहायक',
    'chatbot.placeholder': 'यूपीएससी परीक्षाओं के बारे में पूछें...',
    'accessibility.fontSize': 'फ़ॉन्ट का आकार',
    'accessibility.highContrast': 'उच्च कंट्रास्ट',
    'theme.toggle': 'थीम बदलें',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};