import styles from "./QueueSection.module.css";

type Props = React.PropsWithChildren<{
    icon?: React.ReactNode;
    title: string
}>;

const QueueSection: React.FC<Props> = ({ icon, children, title }: Props) => {
    return <div className={styles.container}>
        <div className={styles.title}>
            {icon} {title}
        </div>
        <div className={styles.list}>
            {children}
        </div>
    </div>;
};

export default QueueSection;