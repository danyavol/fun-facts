/* RUSSIAN */

type RuPluralForms = 'one' | 'few' | 'many';

type RuPluralMapping = {
    [key in RuPluralForms]: string;
};

export function ruPluralText(number: number, textMapping: RuPluralMapping): string {
    const pluralRules = new Intl.PluralRules('ru');
    const category = pluralRules.select(number) as RuPluralForms;
    return textMapping[category];
}

/* ENGLISH */

type EnPluralForms = 'one' | 'other';

type EnPluralMapping = {
    [key in EnPluralForms]: string;
};

export function enPluralText(number: number, textMapping: EnPluralMapping): string {
    const pluralRules = new Intl.PluralRules('en-US');
    const category = pluralRules.select(number) as EnPluralForms;
    return textMapping[category];
}
