import styles from "./NewsBadge.module.css";

interface BadgeDataObject {
    [k: string]: {
        css: string,
        text: string
    }
}

const BADGE_DATA: BadgeDataObject = {
    "update": {
        css: styles.blue,
        text: "Update"
    },
    "announcement": {
        css: styles.green,
        text: "Announcement"
    },
    "release": {
        css: styles.pink,
        text: "Release"
    }
};

interface Props {
    badgeType: string;
}

const NewsBadge: React.FC<Props> = ({ badgeType }: Props) => {
    let cssClass = "green";
    let text = badgeType;
    if (badgeType in BADGE_DATA) {
        const badgeData = BADGE_DATA[badgeType];
        cssClass = badgeData.css;
        text = badgeData.text;
    }

    return <div className={[styles.badge, cssClass].join(" ")}>{text}</div>;
};

export default NewsBadge;