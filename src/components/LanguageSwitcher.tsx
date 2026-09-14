import React, { useEffect, useState } from 'react';
import { Globe, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const languages = [
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ar', name: 'Bahasa Arab', flag: '🇸🇦' },
  { code: 'de', name: 'Bahasa Jerman', flag: '🇩🇪' },
  { code: 'ja', name: 'Bahasa Jepang', flag: '🇯🇵' },
  { code: 'en', name: 'Bahasa Inggris', flag: '🇬🇧' },
  { code: 'zh-CN', name: 'Bahasa Mandarin', flag: '🇨🇳' },
  { code: 'ru', name: 'Bahasa Rusia', flag: '🇷🇺' },
  { code: 'es', name: 'Bahasa Spanyol', flag: '🇪🇸' },
  { code: 'ko', name: 'Bahasa Korea', flag: '🇰🇷' },
  { code: 'fr', name: 'Bahasa Prancis', flag: '🇫🇷' },
];

export const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLang, setActiveLang] = useState('id');

  useEffect(() => {
    // Add Google Translate script if not exists
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'id',
            includedLanguages: 'id,ar,de,ja,en,zh-CN,ru,es,ko,fr',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };
    }
  }, []);

  const handleLanguageChange = (code: string) => {
    setActiveLang(code);
    setIsOpen(false);
    
    // Find the hidden Google Translate select and trigger change
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event('change'));
    }
  };

  const currentLang = languages.find(l => l.code === activeLang) || languages[0];

  return (
    <>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      <div className="fixed bottom-[5.5rem] md:bottom-6 left-6 z-50 print:hidden">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-16 left-0 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="py-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${activeLang === lang.code ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Ubah Bahasa"
        >
          <span className="text-xl">{currentLang.flag}</span>
          <ChevronUp className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </>
  );
};
