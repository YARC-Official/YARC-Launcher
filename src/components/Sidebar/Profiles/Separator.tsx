import styles from "./List.module.css";

type Props = {
    name: string,
    children?: React.ReactNode,
}

const Separator: React.FC<Props> = ({name, children}: Props) => {
    return <div className={styles.separator}>
        <span className={styles.name}>{name}</span>
        <div className={styles.right}>{children}</div>
    </div>;
};

export default Separator;
