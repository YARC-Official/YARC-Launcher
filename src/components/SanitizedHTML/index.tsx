import DOMPurify from "dompurify";

type Props = {
    dirtyHTML: string,
};

const SanitizedHTML: React.FC<Props> = ({dirtyHTML}: Props) => {
    const sanitized = DOMPurify.sanitize(dirtyHTML);

    return <div dangerouslySetInnerHTML={{__html: sanitized}}/>;
};

export default SanitizedHTML;