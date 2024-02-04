import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const languagesData = [
  {
    id: 1,
    lang: "us",
    label: "us",
  },
  // {
  //   id: 2,
  //   lang: "hi-IN",
  //   label: "hi",
  // },
  {
    id: 2,
    lang: "us",
    label: "us",
  },
];

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(languagesData[1]); // Default language is English

  const changeLanguage = (newLanguage) => {
    setLanguage(languagesData[newLanguage]);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
