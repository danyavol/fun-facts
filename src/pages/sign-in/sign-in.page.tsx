import { useSignInAnonymously, useSignInViaGoogle, useSignInWithPassword } from '../../services/auth.service.ts';
import { Box, Button, Container, Flex, Separator, Spinner, TextField, Text, Link } from '@radix-ui/themes';
import Incognito from '../../icons/incognito.svg?react';
import Google from '../../icons/google.svg?react';
import { useMemo, useState } from 'react';
import { Logo } from '../../components/logo/logo.tsx';
import { EnterIcon } from '@radix-ui/react-icons';
import { SensitiveInput } from '../../components/sensitive-input/sensitive-input.tsx';
import { NavLink } from 'react-router';

export function SignInPage() {
    const { signInAnonymous, isLoading: guestIsLoading, error: guestError } = useSignInAnonymously();
    const { signInViaGoogle, isLoading: googleIsLoading, error: gmailError } = useSignInViaGoogle();
    const { signInWithPassword, isLoading: passwordIsLoading, error: passwordError } = useSignInWithPassword();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loginClicked, setLoginClicked] = useState(false);

    const isValid = useMemo(() => {
        return !!email && !!password;
    }, [email, password]);

    const isDisabled = useMemo(
        () => guestIsLoading || googleIsLoading || passwordIsLoading,
        [guestIsLoading, googleIsLoading, passwordIsLoading]
    );

    const error = passwordError || gmailError || guestError;

    return (
        <Container size="1" p="4">
            <Flex className="main-container" p="5" direction="column" gap="3">
                <Flex justify="center" mb="3">
                    <Logo />
                </Flex>
                {/* TODO: Move to separate component. Display google and guest buttons on create page, too */}
                <Flex direction="column" gap="3" mb="2">
                    <Flex direction="column">
                        <label>
                            <Text
                                as="div"
                                size="2"
                                mb="1"
                                weight="bold"
                                color={loginClicked && !email ? 'red' : undefined}
                            >
                                Эл. почта
                            </Text>
                            <TextField.Root
                                variant={loginClicked && !email ? 'soft' : 'surface'}
                                color={loginClicked && !email ? 'red' : undefined}
                                value={email}
                                onInput={(ev) => setEmail(ev.currentTarget.value)}
                                size="2"
                                placeholder="example@email.com"
                                type="email"
                            />
                        </label>
                    </Flex>
                    <Flex direction="column">
                        <label>
                            <Text
                                as="div"
                                size="2"
                                mb="1"
                                weight="bold"
                                color={loginClicked && !password ? 'red' : undefined}
                            >
                                Пароль
                            </Text>
                            <SensitiveInput
                                variant={loginClicked && !password ? 'soft' : 'surface'}
                                color={loginClicked && !password ? 'red' : undefined}
                                value={password}
                                onInput={(ev) => setPassword(ev.currentTarget.value)}
                                size="2"
                            />
                        </label>
                    </Flex>
                    {error && <Text color="red">{error}</Text>}
                </Flex>
                <Flex justify="between" align="center">
                    <Link asChild>
                        <NavLink to="/create-account">Создать аккаунт</NavLink>
                    </Link>

                    <Button
                        onClick={() => {
                            setLoginClicked(true);
                            if (isValid) signInWithPassword(email, password);
                        }}
                        disabled={isDisabled}
                        size="3"
                    >
                        {passwordIsLoading ? <Spinner /> : <EnterIcon />}
                        Войти
                    </Button>
                </Flex>

                <Flex align="center">
                    <Box flexGrow="1">
                        <Separator size="4" />
                    </Box>
                    <Text mx="3" color="gray" size="1">
                        ИЛИ
                    </Text>
                    <Box flexGrow="1">
                        <Separator size="4" />
                    </Box>
                </Flex>

                <Button onClick={signInViaGoogle} variant="outline" color="gray" disabled={isDisabled} size="3">
                    {googleIsLoading ? <Spinner /> : <Google />}
                    Войти через Google
                </Button>
                <Button onClick={signInAnonymous} disabled={isDisabled} variant="outline" size="3" color="gray">
                    {guestIsLoading ? <Spinner /> : <Incognito />}
                    Войти как Гость
                </Button>
            </Flex>
        </Container>
    );
}
