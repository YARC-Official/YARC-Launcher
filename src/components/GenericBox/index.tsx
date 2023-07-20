import styles from "./SetlistBox.module.css";

type Props = React.PropsWithChildren<{
    style?: React.CSSProperties
}>;

const GenericBox: React.FC<Props> = ({ children, style }: Props) => {
    return <div className={[styles.box_slim, styles.box].join(" ")} style={style}>
        {children}
    </div>;
};

const GenericBoxSlim: React.FC<Props> = ({ children, style }: Props) => {
    return <div className={styles.box_slim} style={style}>
        {children}
    </div>;
};

const GenericBoxHeader: React.FC<Props> = ({ children, style }: Props) => {
    return <div className={styles.box_header} style={style}>
        {children}
    </div>;
};

export { GenericBox, GenericBoxSlim, GenericBoxHeader };