import styles from "./Button.module.css";
import { CSSProperties, forwardRef } from "react";

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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
    const {
        className,
        style,

        border,
        rounded,
        color,

        width,
        height,

        children,

        ...otherProps
    } = props;

    // Get the button color class
    let classes;
    switch (color) {
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

    if (border) {
        classes.push(styles.border);
    }

    if (rounded) {
        classes.push(styles.rounded);
    }

    // Get the styles
    const newStyles = {
        width,
        height,
        ...style,
    } as ButtonCSS;

    return <button
        className={[styles.button, ...classes, className].join(" ")}
        style={newStyles}
        ref={ref}
        {...otherProps}>

        {children}
    </button>;
});

export default Button;
