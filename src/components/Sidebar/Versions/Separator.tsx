import styles from "./Versions.module.css";

type Props = {
    name: string,
    children?: React.ReactNode,
}

const VersionSeparator: React.FC<Props> = ({name, children}: Props) => {
    return <div className={styles.separator}>
        <span className={styles.name}>{name}</span>
        <div className={styles.right}>{children}</div>
    </div>;
};

export default VersionSeparator;