import { create } from 'zustand';
import { LanguageKey } from './use-translate.ts';
import { persist } from 'zustand/middleware';

interface LanguageState {
    language: LanguageKey;
    setLanguage: (lang: LanguageKey) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'ru',
            setLanguage: (language: LanguageKey) => {
                set(() => ({ language }));
            },
        }),
        { name: 'language' }
    )
);
