import { Button, Flex, TextArea, Text } from '@radix-ui/themes';
import { FactFormData } from './default-fact-form-value.ts';
import { useEffect, useState } from 'react';

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
    const [touched, setTouched] = useState(false);

    const hasChanges = text !== value.text;
    const isValid = text.length && text.length < 250;

    const isSubmitDisabled = !isValid || !hasChanges || disabled;

    const showTextError = !isValid && touched;

    useEffect(() => {
        setText(value.text);
    }, [value]);

    function submit() {
        onSubmit({ text });
    }

    return (
        <Flex direction="column">
            <TextArea
                color={showTextError ? 'red' : undefined}
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    setTouched(true);
                }}
                placeholder="Напиши что-нибудь о себе"
                readOnly={readonlyForm}
            />
            {showTextError && <Text color="red">Факт должен быть больше 0 и меньше 250 символов</Text>}
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
