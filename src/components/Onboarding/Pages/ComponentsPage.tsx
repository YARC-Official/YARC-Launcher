import WarningBox from "./WarningBox";
import styles from "./Pages.module.css";

interface Props {
}

export const ComponentsPage: React.FC<Props> = () => {
    return <>
        <WarningBox>
            You can download other applications and songs at any time after the initial onboarding process.
        </WarningBox>
        <div className={styles.componentContainer}>
            <div className={styles.componentCategory}>
                <header>Applications</header>
                <div className={styles.componentOptionContainer}>
                    <div className={styles.componentOption}>

                    </div>
                    <div className={styles.componentOption}>

                    </div>
                </div>
            </div>
            <div className={styles.componentCategory}>
                <header>Songs</header>
                <div className={styles.componentOptionContainer}>
                    <div className={styles.componentOption}>

                    </div>
                </div>
            </div>
        </div>
    </>;
};

export default ComponentsPage;
