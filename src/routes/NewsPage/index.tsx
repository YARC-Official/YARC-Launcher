import { useNewsArticle } from "@app/hooks/useNewsArticle";
import { useParams } from "react-router-dom";
import matter from "gray-matter";
import { marked } from "marked";
import SanitizedHTML from "@app/components/SanitizedHTML";

function NewsPage() {

    const { md } = useParams();
    if(!md) return <></>;

    const { data, error, isLoading, isSuccess } = useNewsArticle(md);

    if (isLoading) return "Loading..";

    if (error) return `An error has occurred: ${error}`;

    if(isSuccess) {

        const { data: articleData, content } = matter(data);

        return (<>

            <h2>{JSON.stringify(articleData)}</h2>

            <SanitizedHTML dirtyHTML={marked.parse(content)}/>

        </>);
    }
}

export default NewsPage;