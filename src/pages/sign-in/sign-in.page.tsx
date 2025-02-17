import { useSignInAnonymously, useSignInViaGoogle } from '../../services/auth.service.ts';
import { Button, Container, Flex, Heading, Spinner } from '@radix-ui/themes';
import Incognito from '../../icons/incognito.svg?react';
import Google from '../../icons/google.svg?react';
import { useMemo } from 'react';

export function SignInPage() {
    const { signInAnonymous, isLoading: guestIsLoading } = useSignInAnonymously();
    const { signInViaGoogle, isLoading: googleIsLoading } = useSignInViaGoogle();

    const isDisabled = useMemo(() => guestIsLoading || googleIsLoading, [guestIsLoading, googleIsLoading]);

    return (
        <Container size="1" p="4">
            <Flex className="main-container" p="5" direction="column" gap="3">
                <Flex gap="3" align="center" justify="center" mb="3">
                    <img height="32" src="public/favicon/android-chrome-192x192.png" />
                    <Heading color="indigo">Fun Facts</Heading>
                </Flex>
                <Button onClick={signInAnonymous} disabled={isDisabled} size="3">
                    {guestIsLoading ? <Spinner /> : <Incognito />}
                    Войти как Гость
                </Button>
                <Button
                    onClick={signInViaGoogle}
                    variant="outline"
                    color="gray"
                    highContrast
                    disabled={isDisabled}
                    size="3"
                >
                    {googleIsLoading ? <Spinner /> : <Google />}
                    Войти через Google
                </Button>
            </Flex>
        </Container>
    );
}
