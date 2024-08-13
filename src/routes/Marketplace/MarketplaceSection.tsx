import Button, { ButtonColor } from "@app/components/Button";
import styles from "./Marketplace.module.css";
import { useState } from "react";

type Props = React.PropsWithChildren<{
    name: string,
}>;

const MarketplaceSection: React.FC<Props> = ({ name, children }: Props) => {
    const [expanded, setExpanded] = useState(false);

    const classes = [styles.section];
    if (expanded) {
        classes.push(styles.expanded);
    }

    return <div className={classes.join(" ")}>
        <div className={styles.title}>
            <div className={styles.left}>
                {name}
            </div>
            <Button color={ButtonColor.LIGHT} rounded={true} onClick={() => setExpanded(!expanded)}>
                {!expanded &&
                    "More"
                }
                {expanded &&
                    "Less"
                }
            </Button>
        </div>
        <div className={styles.list}>
            {children}
        </div>
    </div>;
};

export default MarketplaceSection;
