import { useNewsArticle } from "@app/hooks/useNewsArticle";
import { useParams } from "react-router-dom";

function NewsPage() {

    const { md } = useParams();
    if(!md) return <></>;

    const { data, error, isLoading, isSuccess } = useNewsArticle(md);

    if (isLoading) return "Loading..";

    if (error) return `An error has occurred: ${error}`;

    if(isSuccess) {
        return (<>

            <h1>{JSON.stringify(data)}</h1>

        </>);
    }
}

export default NewsPage;