import styles from "./Selector.module.css";
import ProfileIcon from "@app/components/ProfileIcon";

interface Props {
    name: string;
    iconUrl: string;
}

const Selector: React.FC<Props> = ({ name, iconUrl }: Props) => {
    return <div className={styles.selector}>
        <ProfileIcon className={styles.icon} iconUrl={iconUrl} />
        <div className={styles.text}>
            {name}
        </div>
    </div>;
};

export default Selector;
