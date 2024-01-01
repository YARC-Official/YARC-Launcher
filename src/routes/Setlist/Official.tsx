import SetlistPage from "@app/components/Setlist/SetlistPage";
import { useSetlistData } from "@app/hooks/useSetlistData";
import { useSetlistRelease } from "@app/hooks/useSetlistRelease";

function OfficialSetlistPage() {
    const { data: setlistData, error, isSuccess, isLoading } = useSetlistRelease("official");
    const setlistVersion = useSetlistData(setlistData, "official");

    if (isLoading) return "Loading...";

    if (error) return `An error has occurred: ${error}`;

    if (isSuccess) {
        return (<>
            <SetlistPage
                version={setlistVersion}
                data={setlistData}
            />
        </>);
    }
}

export default OfficialSetlistPage;