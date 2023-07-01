import { YARGVersion } from "@app/hooks/useYARGVersion";
import styles from "./styles.module.css";
import MainButton from "../MainButton";

interface Props {
    version: YARGVersion,
    playName: string,
}

const LaunchPage: React.FC<Props> = ({ version, playName }: Props) => {
    // If there isn't a version, something went wrong
    if (!version) {
        return <p>Error: No version.</p>;
    }

    return <div className={styles.app}>
        <div className={styles.actions}>
            <MainButton version={version} playName={playName} />
        </div>
    </div>;
};

export default LaunchPage;