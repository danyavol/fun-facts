import { en } from './languages/en.ts';
import { ru, Translation } from './languages/ru.ts';
import { useCallback } from 'react';
import { useLanguageStore } from './language.store.ts';

const translations = {
    ru: ru,
    en: en,
};

export type LanguageKey = keyof typeof translations;

export const languages: { key: LanguageKey; name: string; label: string }[] = [
    { key: 'ru', name: 'Русский', label: 'RU' },
    { key: 'en', name: 'English', label: 'EN' },
];

export function useTranslate() {
    const { language } = useLanguageStore();

    const t = useCallback(
        <K extends keyof Translation>(
            key: K,
            ...args: Translation[K] extends (...args: infer P) => unknown ? P : []
        ): string => {
            const translation = translations[language];
            if (typeof translation[key] === 'function') {
                // Type-safe casting for function translations
                const translationFn = translation[key] as (...args: unknown[]) => string;
                return translationFn(...args);
            } else {
                return translation[key] as string;
            }
        },
        [language]
    );

    return { t };
}

export function t<K extends keyof Translation>(
    key: K,
    ...args: Translation[K] extends (...args: infer P) => unknown ? P : []
): string {
    const { language } = useLanguageStore.getState();

    const translation = translations[language];
    if (typeof translation[key] === 'function') {
        // Type-safe casting for function translations
        const translationFn = translation[key] as (...args: unknown[]) => string;
        return translationFn(...args);
    } else {
        return translation[key] as string;
    }
}

export type TranslateFn = ReturnType<typeof useTranslate>['t'];
