import YARGVersion from "./YARG";
import styles from "./Versions.module.css";
import SetlistVersion from "./Setlist";

const VersionsList: React.FC = () => {
    return <div className={styles.list}>
        <YARGVersion channel="stable" />
        <YARGVersion channel="nightly" />
        <SetlistVersion channel="official" />
    </div>;
};

export default VersionsList;