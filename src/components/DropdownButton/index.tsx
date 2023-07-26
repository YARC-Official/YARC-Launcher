import { DropdownIcon } from "@app/assets/Icons";
import Button, { ButtonProps } from "../Button";
import styles from "./DropdownButton.module.css";

interface Props extends ButtonProps {
    buttonChildren: React.ReactNode
}

const DropdownButton: React.FC<Props> = (props: Props) => {
    const { children, style, className, ...buttonProps } = props;

    return <div className={[styles.container, className].join(" ")} style={style}>
        <Button {...buttonProps as ButtonProps} className={styles.button}>
            {props.buttonChildren}
        </Button>
        <button className={styles.dropdown_button}>
            <DropdownIcon width={12} height={12} />
        </button>
    </div>;
};

export default DropdownButton;