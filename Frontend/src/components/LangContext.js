import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();
export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('en');
    const toggleLanguage = (choice) => {
        setLang(choice);
    };
    return (
        <LanguageContext.Provider value=
            {{ lang, toggleLanguage }}>{
                children}</LanguageContext.Provider>
    )
};

export const useLanguage = () => useContext(LanguageContext);