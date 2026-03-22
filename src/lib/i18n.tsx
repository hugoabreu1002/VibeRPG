import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Language = "en" | "pt-BR" | "es";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Import translations
import en from "../locales/en.json";
import ptBR from "../locales/pt-BR.json";
import es from "../locales/es.json";

const translations: Record<Language, Record<string, string>> = {
  en,
  "pt-BR": ptBR,
  es,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("viberpg-language");
    return (saved as Language) || "en";
  });

  useEffect(() => {
    localStorage.setItem("viberpg-language", language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export const languageNames: Record<Language, string> = {
  en: "English",
  "pt-BR": "Português",
  es: "Español",
};

export const languageFlags: Record<Language, string> = {
  en: "🇺🇸",
  "pt-BR": "🇧🇷",
  es: "🇪🇸",
};