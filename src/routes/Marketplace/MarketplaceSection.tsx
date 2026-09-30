import Button, { ButtonColor } from "@app/components/Button";
import styles from "./Marketplace.module.css";
import { useEffect, useRef, useState } from "react";
import { useOverflow } from "use-overflow";

type Props = React.PropsWithChildren<{
    name: string,
}>;

const MarketplaceSection: React.FC<Props> = ({ name, children }: Props) => {
    const listRef = useRef<HTMLDivElement>(null);
    const { refXOverflowing: listOverflowing } = useOverflow(listRef);

    const [expanded, setExpanded] = useState(false);

	useEffect(() => {
        const list = listRef.current;
        if (!list || expanded) return;

        const handleWheel = (event: WheelEvent) => {
            // Preserve zoom gestures and native horizontal trackpad scrolling.
            if (event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;

            const maxScroll = list.scrollWidth - list.clientWidth;
            if (maxScroll <= 0) return;

            const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16
                : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? list.clientWidth : 1;
            const nextScroll = Math.max(0, Math.min(maxScroll, list.scrollLeft + event.deltaY * unit));
            if (nextScroll === list.scrollLeft) return;

            event.preventDefault();
            list.scrollLeft = nextScroll;
        };

        // A non-passive listener lets the row consume scrolling before the page does.
        list.addEventListener("wheel", handleWheel, { passive: false });
        return () => list.removeEventListener("wheel", handleWheel);
    }, [expanded]);

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
