import { Flex } from '@radix-ui/themes';

export function Logo() {
    return (
        <Flex gap="3" align="baseline" style={{ userSelect: 'none', pointerEvents: 'none' }}>
            <img height="30" src="/assets/logo.svg" alt="App logo" />
            <img height="26" src="/assets/fun-facts.svg" alt="App title" />
        </Flex>
    );
}
