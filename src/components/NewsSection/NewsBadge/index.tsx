import { PropsWithChildren } from "react";
import styles from "./NewsBadge.module.css";

const NewsBadge: React.FC<PropsWithChildren> = ({children}: PropsWithChildren) => {
    return <div className={styles.badge}>{children}</div>;
};

export default NewsBadge;