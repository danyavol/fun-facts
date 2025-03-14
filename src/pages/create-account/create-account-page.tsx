import { Button, Container, Flex, Link, Spinner, Text, TextField } from '@radix-ui/themes';
import { useMemo, useState } from 'react';
import { SensitiveInput } from '../../components/sensitive-input/sensitive-input.tsx';
import { Logo } from '../../components/logo/logo.tsx';
import { NavLink } from 'react-router';
import { useCreateNewPasswordAccount } from '../../services/auth.service.ts';
import { LanguageSwitcher } from '../../components/language-switcher/language-switcher.tsx';
import { useTranslate } from '../../translate/use-translate.ts';

export function CreateAccountPage() {
    const { createNewPasswordAccount, isLoading, error } = useCreateNewPasswordAccount();
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [email, setEmail] = useState('');
    const [createClicked, setCreateClicked] = useState(false);
    const { t } = useTranslate();

    const isValid = useMemo(() => {
        return password === repeatPassword && !!password && !!email;
    }, [password, repeatPassword, email]);

    return (
        <Container size="1" p="4">
            <Flex className="main-container" p="5" direction="column" gap="3">
                <Flex justify="center" mb="3">
                    <Logo />
                </Flex>
                <Flex justify="end">
                    <LanguageSwitcher compact={true} />
                </Flex>

                <Flex direction="column" gap="3" mb="2">
                    <Flex direction="column">
                        <label>
                            <Text
                                as="div"
                                size="2"
                                mb="1"
                                weight="bold"
                                color={createClicked && !email ? 'red' : undefined}
                            >
                                {t('auth.email')}
                            </Text>
                            <TextField.Root
                                variant={createClicked && !email ? 'soft' : 'surface'}
                                color={createClicked && !email ? 'red' : undefined}
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
                                color={createClicked && !password ? 'red' : undefined}
                            >
                                {t('auth.password')}
                            </Text>
                            <SensitiveInput
                                variant={createClicked && !password ? 'soft' : 'surface'}
                                color={createClicked && !password ? 'red' : undefined}
                                value={password}
                                onInput={(ev) => setPassword(ev.currentTarget.value)}
                                size="2"
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
                                color={createClicked && password != repeatPassword ? 'red' : undefined}
                            >
                                {t('auth.password.confirm')}
                            </Text>
                            <SensitiveInput
                                variant={createClicked && password != repeatPassword ? 'soft' : 'surface'}
                                color={createClicked && password != repeatPassword ? 'red' : undefined}
                                value={repeatPassword}
                                onInput={(ev) => setRepeatPassword(ev.currentTarget.value)}
                                size="2"
                            />
                        </label>
                    </Flex>
                </Flex>
                {error && <Text color="red">{error}</Text>}
                <Button
                    onClick={() => {
                        setCreateClicked(true);
                        if (isValid) createNewPasswordAccount(email, password);
                    }}
                    disabled={isLoading}
                    size="3"
                >
                    {isLoading ? <Spinner /> : null}
                    {t('auth.create-account')}
                </Button>
                <Flex gap="2">
                    <Text as="span">{t('auth.already-have-account')}</Text>
                    <Link asChild>
                        <NavLink to="/login">{t('auth.log-in')}</NavLink>
                    </Link>
                </Flex>
            </Flex>
        </Container>
    );
}
