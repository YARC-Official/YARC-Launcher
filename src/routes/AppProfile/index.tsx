import { useParams } from "react-router-dom";
import { useProfileStore } from "@app/stores/ProfileStore";
import { LaunchButton } from "@app/components/Launch/LaunchButton";

function AppProfile() {
    const { uuid } = useParams();
    if (!uuid) {
        return <></>;
    }

    const profileStore = useProfileStore();
    const profile = profileStore.getProfileByUUID(uuid);
    if (!profile) {
        return <></>;
    }

    async function download() {

    }

    return <div>
        <p>{profile.metadata.locales["en-US"].name}</p>
        <p>{profile.version}</p>
        <p>{profile.metadata.locales["en-US"].description}</p>
        <LaunchButton profileUUID={profile.uuid} />
    </div>;
}

export default AppProfile;
