type RuPluralForms = 'one' | 'few' | 'many';

type PluralMapping = {
    [key in RuPluralForms]: string;
};

export function ruPluralText(number: number, textMapping: PluralMapping): string {
    const pluralRules = new Intl.PluralRules('ru');
    const category = pluralRules.select(number) as RuPluralForms;
    return textMapping[category];
}
