import YARGVersion from "./YARG";
import styles from "./Versions.module.css";
import SetlistVersion from "./Setlist";
import VersionSeparator from "./Separator";
import { ReactComponent as AddSign } from "@app/assets/Add.svg";

const VersionsList: React.FC = () => {
    return <div className={styles.list}>
        <VersionSeparator name="Applications">
            <AddSign className={styles.add} />
        </VersionSeparator>
        <YARGVersion channel="stable" />
        <YARGVersion channel="nightly" />
        <VersionSeparator name="Song">
            <AddSign className={styles.add} />
        </VersionSeparator>
        <SetlistVersion channel="official" />
    </div>;
};

export default VersionsList;