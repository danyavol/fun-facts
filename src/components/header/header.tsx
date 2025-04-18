import { Avatar, Badge, Box, Container, DropdownMenu, Flex, IconButton, Spinner, Text } from '@radix-ui/themes';
import Profile from '../../icons/profile.svg?react';
import Incognito from '../../icons/incognito.svg?react';
import { ExitIcon, PersonIcon } from '@radix-ui/react-icons';
import { useCurrentUser, useSignOut } from '../../services/auth.service.ts';
import { useState } from 'react';
import { Logo } from '../logo/logo.tsx';
import { LanguageSwitcher } from '../language-switcher/language-switcher.tsx';
import { useTranslate } from '../../translate/use-translate.ts';

export const Header = () => {
    const { user, isAdmin } = useCurrentUser();
    const { signOut, isLoading } = useSignOut();
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslate();

    function closeDropdown() {
        setIsOpen(false);
    }

    return (
        <Container size="2" pt="4" pl="4" pr="4">
            <Flex className="main-container" px="5" py="3" justify="between" align="center">
                <Logo />

                <DropdownMenu.Root open={isOpen}>
                    <DropdownMenu.Trigger>
                        <IconButton variant="ghost" onClick={() => setIsOpen(true)}>
                            <Profile width="26px" height="26px" />
                        </IconButton>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content onInteractOutside={closeDropdown}>
                        <Box p="2">
                            {user?.isAnonymous && (
                                <Flex gap="3" align="center">
                                    <Avatar fallback={<Incognito width="20px" height="20px" />} color="gray" />
                                    <Text weight="bold">{t('auth.guest')}</Text>
                                </Flex>
                            )}
                            {user?.providerData.map((data) => (
                                <Flex gap="3" align="center" key={data.uid}>
                                    <Avatar
                                        src={data.photoURL ?? undefined}
                                        fallback={<PersonIcon width={24} height={24} />}
                                    />
                                    <Flex direction="column">
                                        <Flex gap="1" align="center">
                                            <Text weight="bold">{data.displayName}</Text>
                                            {isAdmin && <Badge color="red">Admin</Badge>}
                                        </Flex>
                                        <Text trim="both" mb="2">
                                            {data.email}
                                        </Text>
                                    </Flex>
                                </Flex>
                            ))}
                        </Box>
                        <DropdownMenu.Separator />

                        <Flex p="2" align="stretch" direction="column">
                            <LanguageSwitcher />
                        </Flex>

                        <DropdownMenu.Item color="red" onSelect={signOut} disabled={isLoading}>
                            {isLoading ? <Spinner /> : <ExitIcon />}
                            {t('auth.log-out')}
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </Flex>
        </Container>
    );
};
