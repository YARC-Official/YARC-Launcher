import { SetlistStates, useSetlistData } from "@app/hooks/useSetlistData";
import { SetlistID, useSetlistRelease } from "@app/hooks/useSetlistRelease";

type Props = {
    setlistId: SetlistID
};

export function Setlist({setlistId}: Props) {
    const setlistData = useSetlistRelease(setlistId);
    const { state, payload, download } = useSetlistData(setlistData);

    return (<>
    
        <h1>Official setlist!!!!</h1>

        <p>STATE: {
            
            state === SetlistStates.AVAILABLE ? "Setlist available (aka installed, maybe i should rename the states for better understanding??)" :
                state === SetlistStates.DOWNLOADING ? "Downloading setlist" :
                    state === SetlistStates.ERROR ? "Error! Please check the DevlTools log" :
                        state === SetlistStates.NEW_UPDATE ? "New update available!" :
                            "State not defined"
            
        }</p>

        <p>Current version: {setlistData.version}</p>

        <div>
            <button onClick={() => download()}>
                {
                    payload?.state === "waiting" ? "On queue" : // eslint-disable-next-line indent
                    payload?.state === "downloading" ? `Downloading... (${payload.current}/${payload.total})` : // eslint-disable-next-line indent
                    payload?.state === "installing" ? "Installing..." : // eslint-disable-next-line indent
                    "Download setlist"
                }
            </button>
        </div>
    
    </>);
}