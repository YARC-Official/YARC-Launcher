import { OnboardingStep } from ".";
import StepIndicator from "./StepIndicator";
import styles from "./Onboarding.module.css";

interface Props {
    onboardingStep: OnboardingStep;
}

const OnboardingSidebar: React.FC<Props> = ({ onboardingStep }: Props) => {
    return <div className={styles.sidebar}>
        <div className={styles.sidebarTop}>
            <header>Welcome to YARG!</header>
            <div className={styles.navigation}>
                {/* <StepIndicator text="Language"
                    activeStep={onboardingStep === OnboardingStep.LANGUAGE}
                    completedStep={onboardingStep > OnboardingStep.LANGUAGE} /> */}
                <StepIndicator text="Installation Folder"
                    activeStep={onboardingStep === OnboardingStep.INSTALL_PATH}
                    completedStep={onboardingStep > OnboardingStep.INSTALL_PATH} />
                <StepIndicator text="Components"
                    activeStep={onboardingStep === OnboardingStep.COMPONENTS}
                    completedStep={onboardingStep > OnboardingStep.COMPONENTS} />
            </div>
        </div>
        <div className={styles.sidebarBottom}>

        </div>
    </div>;
};

export default OnboardingSidebar;

