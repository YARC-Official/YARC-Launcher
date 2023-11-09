import { DropdownIcon } from "@app/assets/Icons";
import Button, { ButtonProps } from "../Button";
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
        <DropdownMenu.Trigger asChild>
            <div className={[styles.container, className].join(" ")} style={style}>
                <Button {...buttonProps as ButtonProps} className={styles.button}>
                    {children}
                </Button>
                <button className={styles.dropdown_button}>
                    <DropdownIcon width={12} height={12} />
                </button>
            </div>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
            <DropdownMenu.Content className={styles.dropdown_content} sideOffset={5}>
                {dropdownChildren}
                <DropdownMenu.Arrow className={styles.dropdown_arrow} />
            </DropdownMenu.Content>
        </DropdownMenu.Portal>

    </DropdownMenu.Root>;
};

type ItemProps = React.PropsWithChildren;

const DropdownItem: React.FC<ItemProps> = (props: ItemProps) => {
    const {
        children,
    } = props;

    return <DropdownMenu.Item className={styles.dropdown_item}>
        {children}
    </DropdownMenu.Item>;
};

export { DropdownButton, DropdownItem };