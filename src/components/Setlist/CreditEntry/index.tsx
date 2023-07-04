import { SetlistCredit } from "@app/hooks/useSetlistRelease";
import styles from "./CreditEntry.module.css";
import { LinkIcon } from "@app/assets/Icons";
import TooltipWrapper from "@app/components/TooltipWrapper";

interface Props {
    creditEntry: SetlistCredit,
}

const CreditEntry: React.FC<Props> = ({ creditEntry }: Props) => {
    if (creditEntry.url.length == 0) {
        return <div className={[styles.credit_entry, styles.credit_text].join(" ")}>
            {creditEntry.name}
        </div>;
    } else {
        return <TooltipWrapper text={creditEntry.url} className={styles.credit_entry}>
            <a href={creditEntry.url} className={styles.credit_text} target="_blank" rel="noreferrer">
                {creditEntry.name} <LinkIcon />
            </a>
        </TooltipWrapper>;
    }
};

export default CreditEntry;