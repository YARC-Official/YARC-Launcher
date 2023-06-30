import MainButton from "@app/components/MainButton";
import { useYARGRelease } from "@app/hooks/useYARGRelease";
import { useYARGVersion } from "@app/hooks/useYARGVersion";
import styles from "./styles.module.css";

function NightlyYARGPage() {
    const releaseData = useYARGRelease("nightly");
    const yargVersion = useYARGVersion(releaseData);

    return (<>

        <div className={styles.app}>
            <div className={styles.actions}>
                <MainButton version={yargVersion} />
            </div>
        </div>

        {/*         

        <h1>YARG nightly version page</h1>
        <p>this page is on /src/routes/YARG/nightly/index.tsx</p>

        <p>STATE: {

            // I SWEAR THIS IS ONLY FOR DEVELOPMENT
            // I believe you
            state === YARGStates.AVAILABLE ? "Available to play" :
                state === YARGStates.DOWNLOADING ? "Downloading new version" :
                    state === YARGStates.ERROR ? "Error! Please check the DevTools log" :
                        state === YARGStates.LOADING ? "Loading latest release information" :
                            state === YARGStates.NEW_UPDATE ? "New update available!" :
                                state === YARGStates.PLAYING ? "YARGING" :
                                    "State not defined."

        }</p>

        <p>Current version: {releaseData?.tag_name}</p>

        <MainButton version={yargVersion} /> */}
    </>);
}

export default NightlyYARGPage;