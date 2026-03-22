import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n, type Language, languageNames, languageFlags } from "../../lib/i18n";

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = ["en", "pt-BR", "es"];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-slate-100 hover:bg-slate-700/60 transition-colors"
        title="Switch Language"
      >
        <span className="text-lg">{languageFlags[language]}</span>
        <span className="text-xs font-medium hidden sm:block">{languageNames[language]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-40 rounded-lg bg-slate-900/95 border border-slate-700/50 shadow-xl shadow-black/30 backdrop-blur-sm z-50 overflow-hidden"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                onClick={() => {
                  setLanguage(lang);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  language === lang
                    ? "bg-amber-900/30 text-amber-300"
                    : "text-slate-300 hover:text-slate-100"
                }`}
              >
                <span className="text-xl">{languageFlags[lang]}</span>
                <span className="text-sm font-medium">{languageNames[lang]}</span>
                {language === lang && (
                  <span className="ml-auto text-amber-400">✓</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}