import styles from "./Box.module.css";

type Props = React.PropsWithChildren<{
    className?: string,
    style?: React.CSSProperties
}>;

const Box: React.FC<Props> = ({ children, className, style }: Props) => {
    const classes = [styles.box];
    if (className !== undefined) {
        classes.push(className);
    }

    return <div className={classes.join(" ")} style={style}>
        {children}
    </div>;
};

export default Box;
