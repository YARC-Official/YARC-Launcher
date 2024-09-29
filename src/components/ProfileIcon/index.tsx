import { Img } from "react-image";
import styles from "./ProfileIcon.module.css";
import { processAssetUrl } from "@app/profiles/utils";
import UnknownImage from "@app/assets/Unknown.png";

interface Props {
    iconUrl: string;
    className?: string;
}

const ProfileIcon: React.FC<Props> = ({ iconUrl, className }: Props) => {
    return <div className={[styles.icon, className].join(" ")}>
        <Img src={[processAssetUrl(iconUrl), UnknownImage]} />
    </div>;
};

export default ProfileIcon;
