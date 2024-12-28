import { signInAnonymous, signInViaGoogle, signOut, useCurrentUser } from '../../services/auth.service.ts';
import { Avatar, Badge, Box, Button, Container, Flex, IconButton, Spinner, Text } from '@radix-ui/themes';
import { ArrowLeftIcon, PersonIcon } from '@radix-ui/react-icons';
import { NavLink } from 'react-router';

export function SignInPage() {
    const { user, isLoading, isAdmin } = useCurrentUser();
    return (
        <Container size="2" p="4">
            <Box className="main-container" p="5">
                <IconButton asChild variant="ghost" size="2" mb="3">
                    <NavLink to={'/'}>
                        <ArrowLeftIcon width={24} height={24} />
                    </NavLink>
                </IconButton>
                {isLoading && <Spinner />}
                {!isLoading && (
                    <Flex align="center" justify="between">
                        {!user && <Text weight="bold">Unauthorized</Text>}
                        {user?.isAnonymous && (
                            <Flex gap="3" align="center">
                                <Avatar fallback="A" />
                                <Text weight="bold">Anonymous</Text>
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
                                    <Text trim="both">{data.email}</Text>
                                </Flex>
                            </Flex>
                        ))}
                        <Flex gap="3">
                            {!user && <Button onClick={signInAnonymous}>Anonymous Sign In</Button>}
                            {user && !user.isAnonymous && <Button onClick={signOut}>Sign Out</Button>}
                            {(!user || user.isAnonymous) && <Button onClick={signInViaGoogle}>Google Sign In</Button>}
                        </Flex>
                    </Flex>
                )}
            </Box>
        </Container>
    );
}
