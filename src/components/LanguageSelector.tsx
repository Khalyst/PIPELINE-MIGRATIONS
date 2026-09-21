import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import { SupportedLanguage } from '../i18n/types';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, supportedLanguages, currentLangMeta, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        id="language-selector-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="px-2.5 py-1.5 text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors flex items-center gap-2 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        title={t.nav.language}
      >
        <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <span className="text-base leading-none">{currentLangMeta.flag}</span>
        <span className="hidden sm:inline font-medium">{currentLangMeta.nativeName}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          id="language-dropdown-menu"
          className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
          role="menu"
        >
          <div className="px-3 py-2 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>{t.nav.language}</span>
            <span className="text-[10px] text-slate-500 font-mono">i18n</span>
          </div>

          <div className="py-1 max-h-72 overflow-y-auto">
            {supportedLanguages.map((lang) => {
              const isSelected = lang.code === language;
              return (
                <button
                  key={lang.code}
                  id={`language-option-${lang.code}`}
                  onClick={() => handleSelect(lang.code)}
                  role="menuitem"
                  className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 font-semibold border-l-2 border-blue-500'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-xs leading-snug">{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400">{lang.name}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
