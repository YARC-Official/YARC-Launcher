import styles from "./Button.module.css";
import { CSSProperties } from "react";

export enum ButtonColor {
    "GREEN",
    "BLUE",
    "YELLOW",
    "LIGHT",
    "DARK",
    "RED"
}

interface ButtonCSS extends CSSProperties {
    "--progress": string
}

export type ButtonProps = React.PropsWithChildren<{
    className?: string,
    style?: React.CSSProperties,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,

    border?: boolean,
    rounded?: boolean,
    color?: ButtonColor,

    width?: number,
    height?: number,
}>;

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    // Get the button color class
    let classes;
    switch (props.color) {
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

    if (props.border) {
        classes.push(styles.border);
    }

    if (props.rounded) {
        classes.push(styles.rounded);
    }

    // Get the styles
    const newStyles = {
        width: props.width,
        height: props.height,
        ...props.style,
    } as ButtonCSS;

    return <button className={[styles.button, ...classes, props.className].join(" ")} style={newStyles} onClick={props.onClick}>
        {props.children}
    </button>;
};

export default Button;
