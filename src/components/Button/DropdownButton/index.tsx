import { DropdownIcon } from "@app/assets/Icons";
import Button, { ButtonProps } from "..";
import styles from "./DropdownButton.module.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

interface DropdownProps extends ButtonProps {
    dropdownChildren: React.ReactNode
}

const DropdownButton: React.FC<DropdownProps> = (props: DropdownProps) => {
    const {
        dropdownChildren,
        style,
        className,
        children,
        ...buttonProps
    } = props;

    return <DropdownMenu.Root>
        <div className={[styles.container, className].join(" ")} style={style}>
            <Button {...buttonProps as ButtonProps} className={styles.button}>
                {children}
            </Button>
            <DropdownMenu.Trigger asChild>
                <button className={styles.dropdown_button}>
                    <DropdownIcon width={12} height={12} />
                </button>
            </DropdownMenu.Trigger>
        </div>

        <DropdownMenu.Portal>
            <DropdownMenu.Content
                className={styles.dropdown_content}
                sideOffset={5}
                align="end">

                {dropdownChildren}
                <DropdownMenu.Arrow className={styles.dropdown_arrow} />
            </DropdownMenu.Content>
        </DropdownMenu.Portal>

    </DropdownMenu.Root>;
};

type ItemProps = React.PropsWithChildren<{
    onClick?: React.MouseEventHandler<HTMLDivElement>,
}>;

const DropdownItem: React.FC<ItemProps> = (props: ItemProps) => {
    const {
        children,
        onClick
    } = props;

    return <DropdownMenu.Item className={styles.dropdown_item} onClick={onClick}>
        {children}
    </DropdownMenu.Item>;
};

export { DropdownButton, DropdownItem };
