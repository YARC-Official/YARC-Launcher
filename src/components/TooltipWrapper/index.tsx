import * as Tooltip from "@radix-ui/react-tooltip";
import styles from "./TooltipWrapper.module.css";
import React from "react";

type Props = React.PropsWithChildren<{
    text: string,
    side?: "left" | "right" | "top" | "bottom",
    sideOffset?: number
}>;

const TooltipWrapper: React.FC<Props> = ({ children, text, side, sideOffset }: Props) => {
    return <Tooltip.Provider delayDuration={600}>
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                {children}
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content className={styles.content} side={side} sideOffset={sideOffset}>
                    {text}
                    <Tooltip.Arrow className={styles.arrow} />
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    </Tooltip.Provider>;
};

export default TooltipWrapper;
