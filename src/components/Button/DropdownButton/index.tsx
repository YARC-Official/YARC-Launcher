import { DropdownIcon } from "@app/assets/Icons";
import Button, {ButtonColor, ButtonProps} from "..";
import styles from "./DropdownButton.module.css";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as RadioGroup from "@radix-ui/react-radio-group";
import {DropdownMenuItemIndicatorProps} from "@radix-ui/react-dropdown-menu";
import {RadioGroupItemProps, RadioGroupProps} from "@radix-ui/react-radio-group";

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

    let classes;
    switch (buttonProps.color) {
        case ButtonColor.BLUE:
            classes = [styles.colorsBlue];
            break;
        case ButtonColor.GREEN:
            classes = [styles.colorsGreen];
            break;
        case ButtonColor.YELLOW:
            classes = [styles.colorsYellow];
            break;
        case ButtonColor.LIGHT:
            classes = [styles.colorsLight];
            break;
        case ButtonColor.DARK:
            classes = [styles.colorsDark];
            break;
        case ButtonColor.RED:
            classes = [styles.colorsRed];
            break;
        default:
            classes = [styles.colorsBlue];
            break;
    }

    if (buttonProps.border) {
        classes.push(styles.border);
    }

    if (buttonProps.rounded) {
        classes.push(styles.rounded);
    }

    return <DropdownMenu.Root>
        <div className={[styles.container, ...classes, className].join(" ")} style={style}>
            <Button {...buttonProps as ButtonProps} className={styles.button}>
                {children}
            </Button>
            <DropdownMenu.Trigger asChild>
                <button className={[styles.dropdown_button, ...classes].join(" ")}>
                    <DropdownIcon width={12} height={12} className={[...classes].join(" ")}/>
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

interface RadioItemProps extends RadioGroupItemProps {
    label: string,
}

const DropdownItem: React.FC<ItemProps> = (props: ItemProps) => {
    const {
        children,
        onClick
    } = props;

    return <DropdownMenu.Item className={styles.dropdown_item} onClick={onClick}>
        {children}
    </DropdownMenu.Item>;
};

const DropdownRadioGroup: React.FC<RadioGroupProps> = (props: RadioGroupProps) => {
    const {
        children,
        defaultValue,
        onValueChange
    } = props;

    return <RadioGroup.Root className={styles.dropdown_radio_root} defaultValue={defaultValue} onValueChange={onValueChange}>
        {children}
    </RadioGroup.Root>;
};

const DropdownRadioGroupIndicator: React.FC<DropdownMenuItemIndicatorProps> = () => {
    return <DropdownMenu.ItemIndicator className={styles.dropdown_item} />;
};

const DropdownRadioItem: React.FC<RadioItemProps> = (props: RadioItemProps) => {
    const {
        onClick,
        checked,
        value,
        label
    } = props;

    return <>
        <label className={[styles.dropdown_item, styles.dropdown_radio_label].join(" ")}>
            <RadioGroup.Item className={styles.dropdown_radio_item} onClick={onClick} value={value}>
                <RadioGroup.Indicator className={styles.dropdown_radio_indicator} />
            </RadioGroup.Item>
            <span className={styles.dropdown_radio_label_text}>{label}</span>
        </label>
    </>;
};

export { DropdownButton, DropdownItem, DropdownRadioItem, DropdownRadioGroup, DropdownRadioGroupIndicator };
