import styles from "./LoadingScreen.module.css";
import * as Progress from "@radix-ui/react-progress";

interface Props {
    fadeOut: boolean;
}

const LoadingScreen: React.FC<Props> = (props: Props) => {
    return <div className={styles.container} style={{opacity: props.fadeOut ? 0 : 1}}>
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