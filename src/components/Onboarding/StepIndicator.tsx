import styles from "./Onboarding.module.css";

type Props = React.PropsWithChildren<{
    activeStep: boolean
}>;

const StepIndicator: React.FC<Props> = ({ children, activeStep }: Props) => {
    const classes = [styles.navigationButton];
    if (activeStep) {
        classes.push(styles.activeStep);
    }

    return <div className={classes.join(" ")}>
        <div>
            {children}
        </div>
    </div>;
};

export default StepIndicator;
