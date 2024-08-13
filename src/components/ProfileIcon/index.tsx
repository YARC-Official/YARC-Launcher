import styles from "./ProfileIcon.module.css";
import { processAssetUrl } from "@app/profiles/utils";

interface Props {
    iconUrl: string;
    className?: string;
}

const ProfileIcon: React.FC<Props> = ({ iconUrl, className }: Props) => {
    return <div className={[styles.icon, className].join(" ")}>
        <img src={processAssetUrl(iconUrl)} />
    </div>;
};

export default ProfileIcon;
