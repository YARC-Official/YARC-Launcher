import styles from "./InputBox.module.css";

interface Props {
    state: string,
    setState: React.Dispatch<React.SetStateAction<string>>,

    placeholder?: string,

    className?: string,
    style?: React.CSSProperties,
}

const InputBox: React.FC<Props> = ({ state, setState, className, style, placeholder }: Props) => {
    return <input
        type="text"
        className={[styles.input, className].join(" ")}
        style={style}
        placeholder={placeholder}
        value={state}
        onChange={e => setState(e.target.value)} />;
};

export default InputBox;
