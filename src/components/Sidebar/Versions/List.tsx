import YARGVersion from "./YARG";
import styles from "./Versions.module.css";

const VersionsList: React.FC = () => {
    return <div className={styles.list}>
        <YARGVersion channel="stable" />
        <YARGVersion channel="nightly" />
    </div>;
};

export default VersionsList;