import NightlyYARGVersion from "./NightlyYARG";
import StableYARGVersion from "./StableYARG";
import styles from "./Versions.module.css";

const VersionsList: React.FC = () => {
    return <div className={styles.list}>
        <StableYARGVersion />
        <NightlyYARGVersion />
    </div>;
};

export default VersionsList;