import { Button, Flex, TextArea } from '@radix-ui/themes';
import { FactFormData } from './default-fact-form-value.ts';
import { useEffect, useState } from 'react';

import styles from './fact-form.module.scss';

type FactFormProps = {
    type: 'new' | 'edit';
    value: FactFormData;
    onSubmit(form: FactFormData): void;
    isLoading?: boolean;
    disabled?: boolean;
};

export function FactForm({ type, value, onSubmit, isLoading = false, disabled = false }: FactFormProps) {
    const [text, setText] = useState(value.text);

    const hasChanges = text !== value.text;
    const isValid = text.length && text.length < 250;
    const isSubmitDisabled = !isValid || !hasChanges || disabled;

    useEffect(() => {
        console.log(99);
        setText(value.text);
    }, [value]);

    function submit() {
        onSubmit({ text });
    }

    return (
        <Flex direction="column" className={type === 'new' ? styles.newFact : ''}>
            <TextArea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter some fact about you" />
            <Flex justify="end" mt="2">
                {(!isSubmitDisabled || type === 'new') && (
                    <Button onClick={submit} loading={isLoading} disabled={isSubmitDisabled}>
                        {type == 'new' ? 'Create fact' : 'Save fact'}
                    </Button>
                )}
            </Flex>
        </Flex>
    );
}
