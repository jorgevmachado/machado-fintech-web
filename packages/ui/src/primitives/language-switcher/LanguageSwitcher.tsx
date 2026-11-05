'use client';
import React ,{ useEffect ,useState } from 'react';

import { useAppTranslation, LOCALE_OPTIONS } from '@fintech/i18n';

export type TLanguageSwitcherVariant = 'dark' | 'light';

type LanguageSwitcherTheme = {
  option?: string;
  trigger?: string;
  dropdown?: string;
  activeOption?: string;
}

type LanguageSwitcherProps = {
  variant: TLanguageSwitcherVariant;
}

const variants: Record<TLanguageSwitcherVariant, LanguageSwitcherTheme> = {
  dark: {
    option: 'border-white/20 bg-slate-900/25 hover:bg-white/15 hover:border-white/30',
    trigger: 'border-white/20 bg-slate-900/25 text-white hover:bg-white/15 hover:border-white/30',
    dropdown: 'border-white/15 bg-slate-900/95 text-white shadow-[0_20px_32px_rgba(15,23,42,0.34)]',
    activeOption: 'bg-yellow-400/20 border-yellow-400/60 shadow-[inset_0_0_0_1px_rgba(250,204,21,0.16)]',
  },

  light: {
    option: 'border-slate-200 bg-white hover:bg-slate-100',
    trigger: 'border-slate-300 bg-white text-slate-900 hover:bg-slate-100',
    dropdown: 'border-slate-200 bg-white text-slate-900 shadow-lg',
    activeOption: 'bg-blue-100 border-blue-500',
  },
};

export default function LanguageSwitcher({ variant }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useAppTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const activeOption = LOCALE_OPTIONS.find((option) => option.value === locale) ?? LOCALE_OPTIONS[0];

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const styles = {
    ...variants[variant],
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={`
          inline-flex
          items-center
          justify-center
          gap-2
          min-w-[58px]
          rounded-full
          border
          px-2.5
          py-[7px]
          cursor-pointer
          transition-all
          duration-200
          ease-in-out
          hover:-translate-y-px
          focus-visible:outline-2
          focus-visible:outline-yellow-400
          focus-visible:outline-offset-2,
          ${styles.trigger}
        `}
        aria-label={t('language.selector')}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((current) => !current);
        }}
      >
        <span aria-hidden="true" className="text-[1.1rem] leading-none">
          {activeOption.flag}
        </span>
        <span aria-hidden="true" className="text-[0.7rem] opacity-80">
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={t('language.selector')}
          className={`
            absolute
            right-0
            top-[calc(100%+8px)]
            z-20
            grid
            gap-2
            min-w-[58px]
            rounded-[18px]
            border                      
            p-2
            
            backdrop-blur-2xl,
            ${styles.dropdown}
          `}
        >
          {LOCALE_OPTIONS.map((option) => {
            const label = t(option.labelKey);
            const isActive = locale === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={`
                  inline-flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  px-[9px]
                  py-[7px]
                  cursor-pointer
                  text-white
                  transition-all
                  duration-200
                  ease-in-out
                  hover:-translate-y-px
                  hover:bg-white/15
                  hover:border-white/30
                  focus-visible:outline-2
                  focus-visible:outline-yellow-400
                  focus-visible:outline-offset-2
                  ${
                  isActive
                    ? styles.activeOption
                    : styles.option
                }
                `}
                role='option'
                aria-selected={isActive}
                aria-label={t('language.changeTo', { language: label })}
                title={label}
                onClick={() => {
                  setLocale(option.value);
                  setIsOpen(false);
                }}
              >
                <span aria-hidden="true" className="text-[1.1rem] leading-none">{option.flag}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};