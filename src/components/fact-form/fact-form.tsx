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
    readonlyForm?: boolean;
};

export function FactForm({
    type,
    value,
    onSubmit,
    isLoading = false,
    disabled = false,
    readonlyForm = false,
}: FactFormProps) {
    const [text, setText] = useState(value.text);

    const hasChanges = text !== value.text;
    const isValid = text.length && text.length < 250;
    const isSubmitDisabled = !isValid || !hasChanges || disabled;

    useEffect(() => {
        setText(value.text);
    }, [value]);

    function submit() {
        onSubmit({ text });
    }

    return (
        <Flex direction="column">
            <TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Напиши что-нибудь о себе"
                readOnly={readonlyForm}
            />
            <Flex justify="end" mt="2">
                {(hasChanges || type === 'new') && (
                    <Button onClick={submit} loading={isLoading} disabled={isSubmitDisabled}>
                        {type == 'new' ? 'Добавить факт' : 'Сохранить'}
                    </Button>
                )}
            </Flex>
        </Flex>
    );
}
