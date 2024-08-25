import Button, { ButtonColor } from "@app/components/Button";
import styles from "./Marketplace.module.css";
import { useRef, useState } from "react";
import { useOverflow } from "use-overflow";

type Props = React.PropsWithChildren<{
    name: string,
}>;

const MarketplaceSection: React.FC<Props> = ({ name, children }: Props) => {
    const listRef = useRef<HTMLDivElement>(null);
    const { refXOverflowing: listOverflowing } = useOverflow(listRef);

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
            {(expanded || listOverflowing) &&
                <Button color={ButtonColor.LIGHT} rounded onClick={() => setExpanded(!expanded)}>
                    {!expanded &&
                        "More"
                    }
                    {expanded &&
                        "Less"
                    }
                </Button>
            }
        </div>
        <div className={styles.list} ref={listRef}>
            {children}
        </div>
    </div>;
};

export default MarketplaceSection;
