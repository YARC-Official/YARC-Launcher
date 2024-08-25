import { OnboardingStep } from ".";
import StepIndicator from "./StepIndicator";
import styles from "./Onboarding.module.css";
import { DriveIcon, QueueIcon } from "@app/assets/Icons";

interface Props {
    onboardingStep: OnboardingStep;
}

const OnboardingSidebar: React.FC<Props> = ({ onboardingStep }: Props) => {
    return <div className={styles.sidebar}>
        <div className={styles.sidebarTop}>
            <div className={styles.navigation}>
                {/* <StepIndicator text="Language"
                    activeStep={onboardingStep === OnboardingStep.LANGUAGE}
                    completedStep={onboardingStep > OnboardingStep.LANGUAGE} /> */}
                <StepIndicator activeStep={onboardingStep === OnboardingStep.INSTALL_PATH}>
                    <DriveIcon width={20} height={20} />
                </StepIndicator>
                <StepIndicator activeStep={onboardingStep === OnboardingStep.COMPONENTS}>
                    <QueueIcon width={20} height={20} />
                </StepIndicator>
            </div>
        </div>
        <div className={styles.sidebarBottom}>

        </div>
    </div>;
};

export default OnboardingSidebar;

