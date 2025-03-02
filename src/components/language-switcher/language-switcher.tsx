import { Flex, Select } from '@radix-ui/themes';
import Language from '../../icons/langauge.svg?react';
import { LanguageKey, languages } from '../../translate/use-translate.ts';
import { useLanguageStore } from '../../translate/language.store.ts';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
    const { language, setLanguage } = useLanguageStore();

    const selectedLanguage = languages.find((l) => l.key === language)!;

    return (
        <Flex align="stretch" direction="column">
            <Select.Root
                size="2"
                defaultValue="ru"
                value={language}
                onValueChange={(value) => setLanguage(value as LanguageKey)}
            >
                <Select.Trigger variant="ghost">
                    <Flex gap="2">
                        <Language />
                        {compact ? selectedLanguage.label : selectedLanguage.name}
                    </Flex>
                </Select.Trigger>
                <Select.Content>
                    {languages.map(({ key, name }) => (
                        <Select.Item key={key} value={key}>
                            {name}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </Flex>
    );
}
