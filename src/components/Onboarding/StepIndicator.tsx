import { CheckmarkIcon } from "@app/assets/Icons";
import styles from "./Onboarding.module.css";

interface Props {
    text: string,
    activeStep: boolean,
    completedStep: boolean
}

const StepIndicator: React.FC<Props> = ({ text, activeStep, completedStep }: Props) => {
    let classes = [styles.navigationButton];
    if (activeStep) {
        classes.push(styles.activeStep);
    }

    return <div className={classes.join(" ")}>
        <div>
            <div>
                {text}
            </div>
            {completedStep &&
                <CheckmarkIcon color="#17E289" />
            }
        </div>
    </div>;
};

export default StepIndicator;
