import { SetlistCredit } from "@app/hooks/useSetlistRelease";
import styles from "./CreditEntry.module.css";
import { ReactComponent as LinkIcon } from "@app/assets/Icons/Link.svg";

interface Props {
    creditEntry: SetlistCredit,
}

const CreditEntry: React.FC<Props> = ({ creditEntry }: Props) => {
    if (creditEntry.url.length == 0) {
        return <div className={styles.credit_entry}>
            {creditEntry.name}
        </div>;
    } else {
        return <a className={styles.credit_entry} href={creditEntry.url} target="_blank" rel="noreferrer">
            {creditEntry.name} <LinkIcon />
        </a>;
    }
};

export default CreditEntry;