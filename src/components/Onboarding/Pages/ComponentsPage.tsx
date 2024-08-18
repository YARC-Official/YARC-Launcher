import WarningBox from "./WarningBox";
import styles from "./Pages.module.css";
import { useQuery } from "@tanstack/react-query";
import { OnboardingIndex, OnboardingOption } from "./onboardingIndex";
import ProfileIcon from "@app/components/ProfileIcon";
import { localizeObject } from "@app/utils/localized";

interface ComponentProps {
    option: OnboardingOption;
}

const ComponentOption: React.FC<ComponentProps> = ({ option }: ComponentProps) => {
    const localized = localizeObject(option, "en-US");

    return <div className={styles.componentOption}>
        <div className={styles.left}>
            <ProfileIcon iconUrl={localized.iconUrl} className={styles.icon} />
            <div>
                <header>{localized.name}</header>
                <div>{localized.subText}</div>
            </div>
        </div>
    </div>;
};

interface Props {
}

export const ComponentsPage: React.FC<Props> = () => {
    const onboardingIndexQuery = useQuery({
        queryKey: ["OnboardingIndex"],
        queryFn: async (): Promise<OnboardingIndex> => await fetch("https://releases.yarg.in/profiles/onboarding.json")
            .then(res => res.json())
    });

    if (onboardingIndexQuery.isLoading) {
        return <>Loading...</>;
    }

    const onboardingIndex = onboardingIndexQuery.data;
    if (onboardingIndexQuery.isError || onboardingIndex === undefined) {
        return <>
            Error: {onboardingIndexQuery.error}
        </>;
    }

    return <>
        <WarningBox>
            You can download other applications and songs at any time after the initial onboarding
            process in the &quot;Marketplace&quot;.
        </WarningBox>
        <div className={styles.componentContainer}>
            <div className={styles.componentCategory}>
                <header>Applications</header>
                <div className={styles.componentOptionContainer}>
                    {
                        onboardingIndex.filter(i => i.type === "application").map(i =>
                            <ComponentOption option={i} key={i.uuid} />
                        )
                    }
                </div>
            </div>
            <div className={styles.componentCategory}>
                <header>Songs</header>
                <div className={styles.componentOptionContainer}>
                    {
                        onboardingIndex.filter(i => i.type === "setlist").map(i =>
                            <ComponentOption option={i} key={i.uuid} />
                        )
                    }
                </div>
            </div>
        </div>
    </>;
};

export default ComponentsPage;
