import styles from "./LoadingScreen.module.css";
import * as Progress from "@radix-ui/react-progress";

const LoadingScreen: React.FC = () => {
    return <div className={styles.container}>
        <Progress.Root className={styles.progressRoot}>
            <Progress.Indicator className={styles.progressIndicator} />
        </Progress.Root>

        <div className={styles.factContainer}>
            <p className={styles.factHeader}>Fun Fact</p>
            YARG stands for Yet Another Rhythm Game
        </div>
    </div>;
};

export default LoadingScreen;