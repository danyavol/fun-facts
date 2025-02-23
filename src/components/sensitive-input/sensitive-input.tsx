import { IconButton, TextField } from '@radix-ui/themes';
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons';
import { ComponentProps, useState } from 'react';

export function SensitiveInput(props: ComponentProps<typeof TextField.Root>) {
    const [isHidden, setIsHidden] = useState(true);

    return (
        <TextField.Root {...props} placeholder={isHidden ? '******' : ''} type={isHidden ? 'password' : 'text'}>
            <TextField.Slot slot="end" side="right">
                <IconButton size="2" variant="ghost" onClick={() => setIsHidden((prev) => !prev)}>
                    {isHidden ? (
                        <EyeClosedIcon height="16" width="16" color="gray" />
                    ) : (
                        <EyeOpenIcon height="16" width="16" color="gray" />
                    )}
                </IconButton>
            </TextField.Slot>
        </TextField.Root>
    );
}
