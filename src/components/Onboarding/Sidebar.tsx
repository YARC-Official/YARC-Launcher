import { OnboardingStep } from ".";
import StepIndicator from "./StepIndicator";
import styles from "./Onboarding.module.css";
import { DriveIcon, QueueIcon } from "@app/assets/Icons";

interface Props {
    steps: OnboardingStep[],
    stepIndex: number;
}

const OnboardingSidebar: React.FC<Props> = ({ steps, stepIndex }: Props) => {
    return <div className={styles.sidebar}>
        <div className={styles.sidebarTop}>
            <div className={styles.navigation}>
                {
                    steps.map(i => {
                        switch (i) {
                            case OnboardingStep.INSTALL_PATH:
                                return <StepIndicator activeStep={steps[stepIndex] === OnboardingStep.INSTALL_PATH} key={i}>
                                    <DriveIcon width={20} height={20} />
                                </StepIndicator>;
                            case OnboardingStep.COMPONENTS:
                                return <StepIndicator activeStep={steps[stepIndex] === OnboardingStep.COMPONENTS} key={i}>
                                    <QueueIcon width={20} height={20} />
                                </StepIndicator>;
                        }
                    })
                }
            </div>
        </div>
        <div className={styles.sidebarBottom}>

        </div>
    </div>;
};

export default OnboardingSidebar;

