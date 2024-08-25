import styles from "./Sidebar.module.css";

interface Props {
    icon?: React.ReactNode,
    children?: React.ReactNode
}

const SidebarMenuButton: React.FC<Props> = ({ icon, children }: Props) => {
    return <div className={styles.button}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.text}>{children}</div>
    </div>;
};

export default SidebarMenuButton;
