import styles from "./Onboarding.module.css";

interface Props {
    setOnboarding: React.Dispatch<boolean>;
}

const Onboarding: React.FC<Props> = (props: Props) => {
    return <div className={styles.container}>
        Here is where onboarding will happen!
    </div>;
};

export default Onboarding;

