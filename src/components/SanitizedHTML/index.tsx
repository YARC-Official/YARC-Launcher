import DOMPurify from "dompurify";

type Props = {
    dirtyHTML: string,
};

const SanitizedHTML: React.FC<Props> = ({dirtyHTML}: Props) => {
    DOMPurify.addHook("afterSanitizeAttributes", function (node) {
        if ("target" in node) {
            node.setAttribute("target", "_blank");
            node.setAttribute("rel", "noreferrer noopener nofollow");
        }
    });

    const sanitized = DOMPurify.sanitize(dirtyHTML);

    return <div dangerouslySetInnerHTML={{__html: sanitized}}/>;
};

export default SanitizedHTML;