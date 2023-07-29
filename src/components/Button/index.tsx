import styles from "./Button.module.css";
import { CSSProperties } from "react";

export enum ButtonColor {
    "GREEN",
    "BLUE",
    "YELLOW",
    "GRAY",
    "BLACK",
    "RED"
}

interface ButtonCSS extends CSSProperties {
    "--progress": string
}

export type ButtonProps = React.PropsWithChildren<{
    className?: string,
    style?: React.CSSProperties,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,

    color?: ButtonColor,
    progress?: number,
    width?: number,
    height?: number,
}>;

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    // Get the button color class
    let colorClass;
    switch (props.color) {
        case ButtonColor.BLUE:
            colorClass = styles.colors_blue;
            break;
        case ButtonColor.GREEN:
            colorClass = styles.colors_green;
            break;
        case ButtonColor.YELLOW:
            colorClass = styles.colors_yellow;
            break;
        case ButtonColor.GRAY:
            colorClass = styles.colors_gray;
            break;
        case ButtonColor.BLACK:
            colorClass = styles.colors_black;
            break;
        case ButtonColor.RED:
            colorClass = styles.colors_red;
            break;
        default:
            colorClass = styles.colors_blue;
            break;
    }

    // Get the styles
    const newStyles = {
        width: props.width,
        height: props.height,
        ...props.style,

        "--progress": props.progress ? `${props.progress}%` : undefined
    } as ButtonCSS;

    return <button className={[styles.button, colorClass, props.className].join(" ")} style={newStyles} onClick={props.onClick}>
        <div className={styles.top}>{props.children}</div>
        <div className={styles.bottom}>{props.children}</div>
    </button>;
};

export default Button;