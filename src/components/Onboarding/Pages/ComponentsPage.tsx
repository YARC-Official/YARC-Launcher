import WarningBox from "./WarningBox";
import styles from "./Pages.module.css";
import { useQuery } from "@tanstack/react-query";
import { OnboardingIndex, OnboardingOption } from "./onboardingIndex";
import ProfileIcon from "@app/components/ProfileIcon";
import { localizeObject } from "@app/utils/localized";
import { useEffect, useState } from "react";
import { CheckmarkIcon } from "@app/assets/Icons";

interface ComponentProps {
    option: OnboardingOption,
    setOption: (url: string, enabled: boolean) => void
}

const ComponentOption: React.FC<ComponentProps> = ({ option, setOption }: ComponentProps) => {
    const [selected, setSelected] = useState<boolean>(option.selectedByDefault);
    const localized = localizeObject(option, "en-US");

    // Ensure options that are "selected by default" are actually selected
    useEffect(() => {
        setOption(option.url, option.selectedByDefault);
    }, [option.selectedByDefault]);

    return <div className={styles.componentOption} onClick={() => {
        setSelected(!selected);
        setOption(option.url, !selected);
    }}>
        <div className={styles.left}>
            <ProfileIcon iconUrl={localized.iconUrl} className={styles.icon} />
            <div>
                <header>{localized.name}</header>
                <div>{localized.subText}</div>
            </div>
        </div>
        {!selected &&
            <div className={styles.unselectedIndicator} />
        }
        {selected &&
            <div className={styles.selectedIndicator}>
                <CheckmarkIcon />
            </div>
        }
    </div>;
};

interface Props {
    profileUrls: string[],
    setProfileUrls: React.Dispatch<React.SetStateAction<string[]>>,
}

export const ComponentsPage: React.FC<Props> = ({ profileUrls, setProfileUrls }: Props) => {
    const onboardingIndexQuery = useQuery({
        queryKey: ["OnboardingIndex"],
        queryFn: async (): Promise<OnboardingIndex> => await fetch(`${import.meta.env.VITE_RELEASES_SERVER_URL}/profiles/onboarding.json`)
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

    const setOption = (url: string, enabled: boolean) => {
        if (enabled) {
            if (!profileUrls.includes(url)) {
                profileUrls.push(url);
                setProfileUrls(profileUrls);
            }
        } else {
            profileUrls = profileUrls.filter(i => i !== url);
            setProfileUrls(profileUrls);
        }
    };

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
                            <ComponentOption option={i} setOption={setOption} key={i.uuid} />
                        )
                    }
                </div>
            </div>
            <div className={styles.componentCategory}>
                <header>Songs</header>
                <div className={styles.componentOptionContainer}>
                    {
                        onboardingIndex.filter(i => i.type === "setlist").map(i =>
                            <ComponentOption option={i} setOption={setOption} key={i.uuid} />
                        )
                    }
                </div>
            </div>
        </div>
    </>;
};

export default ComponentsPage;
