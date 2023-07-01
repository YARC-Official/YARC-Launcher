import styles from "./home.module.css";

function Home() {
    return <div className={styles.main}>
        <h1>Welcome to the <b>YAL <span className={styles.blue}>Beta</span></b></h1>
        <p>Here you can download and install YARG, and the official YARG setlist!</p>
        <p>If you encounter any bugs, please report it to us in our Discord.</p>
    </div>;
}

export default Home;