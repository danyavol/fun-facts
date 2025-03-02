import { useState, forwardRef, ReactNode, ElementRef, isValidElement, cloneElement, ReactElement } from 'react';
import { Tooltip as TooltipPrimitive } from 'radix-ui';
import { Text, Theme } from '@radix-ui/themes';

type TooltipElement = ElementRef<typeof TooltipPrimitive.Content>;

interface TooltipProps {
    text: string;
    children: ReactNode;
}
export const Tooltip = forwardRef<TooltipElement, TooltipProps>((props, forwardedRef) => {
    const { children, text } = props;
    const [open, setOpen] = useState(false);

    const tooltipHidden = !text;

    const enhancedChildren =
        isValidElement(children) &&
        cloneElement(children as ReactElement, {
            onMouseOver: () => {
                if (!tooltipHidden) setOpen(true);
            },
            onMouseLeave: () => {
                setOpen(false);
            },
        });

    return (
        <TooltipPrimitive.Root
            open={open}
            onOpenChange={(isOpened) => {
                if (!tooltipHidden) setOpen(isOpened);
            }}
        >
            <TooltipPrimitive.Trigger asChild>{enhancedChildren}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <Theme asChild>
                    <TooltipPrimitive.Content
                        sideOffset={4}
                        collisionPadding={10}
                        asChild={false}
                        ref={forwardedRef}
                        className={'rt-TooltipContent'}
                    >
                        <Text as="p" className="rt-TooltipText" size="1">
                            {text}
                        </Text>
                        <TooltipPrimitive.Arrow className="rt-TooltipArrow" />
                    </TooltipPrimitive.Content>
                </Theme>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
});
