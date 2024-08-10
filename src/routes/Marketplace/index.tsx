import { useProfileStore } from "@app/profiles/store";
import styles from "./Marketplace.module.css";
import Button from "@app/components/Button";
import { localize } from "@app/utils/localized";

function Marketplace() {
    const profileStore = useProfileStore();

    return <main>
        {
            profileStore.availableProfiles.map(i =>
                <Button key={i.uuid} onClick={async () => await profileStore.activateProfile(i)}>
                    {localize(i, "name", "en-US")}
                </Button>
            )
        }
    </main>;
}

export default Marketplace;
