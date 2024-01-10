import styles from "./LoadingScreen.module.css";

const LoadingScreen: React.FC = () => {
    return <div className={styles.container}>
        <p>Loading...</p>
    </div>;
};

export default LoadingScreen;