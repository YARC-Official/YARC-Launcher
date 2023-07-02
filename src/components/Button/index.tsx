import styles from "./Button.module.css";

export enum ButtonColor {
    "GREEN",
    "BLUE",
    "YELLOW"
}

type Props = React.PropsWithChildren<{
    className?: string,
    style?: React.CSSProperties,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,

    color?: ButtonColor,
    width?: number,
    height?: number,
}>;

const Button: React.FC<Props> = (props: Props) => {
    // Get the button color class
    let colorClass;
    switch (props.color) {
        case ButtonColor.GREEN:
            colorClass = styles.colors_green;
            break;
        case ButtonColor.YELLOW:
            colorClass = styles.colors_yellow;
            break;
        default:
        case ButtonColor.BLUE:
            colorClass = styles.colors_blue;
            break;
    }

    // Get the styles
    const newStyles = { ...props.style, width: props.width, height: props.height };

    return <button className={[styles.button, colorClass, props.className].join(" ")} style={newStyles} onClick={props.onClick}>
        {props.children}
    </button>;
};

export default Button;