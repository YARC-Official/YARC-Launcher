import YARGVersion from "./YARG";
import styles from "./Versions.module.css";
import SetlistVersion from "./Setlist";
import VersionSeparator from "./Separator";
import { AddIcon } from "@app/assets/Icons";

const VersionsList: React.FC = () => {
    return <div className={styles.list}>
        <VersionSeparator name="Applications">
            <AddIcon className={styles.add} />
        </VersionSeparator>
        <YARGVersion channel="stable" />
        <YARGVersion channel="nightly" />
        <VersionSeparator name="Songs">
            <AddIcon className={styles.add} />
        </VersionSeparator>
        <SetlistVersion channel="official" />
    </div>;
};

export default VersionsList;