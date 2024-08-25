import styles from "./Pages.module.css";
import { InformationIcon } from "@app/assets/Icons";

export const warningBox: React.FC<React.PropsWithChildren> = (props: React.PropsWithChildren) => {
    return <div className={styles.warningBox}>
        <InformationIcon width={"1.5em"} height={"1.5em"} color={"#2ED9FF"} />
        {props.children}
    </div>;
};

export default warningBox;
