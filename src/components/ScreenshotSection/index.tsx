import {Profile} from "@app/profiles/types";
import Box from "@app/components/Box";
import {InformationIcon} from "@app/assets/Icons";

interface Props {
    profile: Profile;
}

const ScreenshotSection: React.FC<Props> = ({profile}: Props) => {
    if (profile.type !== "venue") {
        return <></>;
    }

    if (profile.metadata.screenshots === undefined || profile.metadata.screenshots.length === 0) {
        return <></>;
    }

    // Ok, at this point we know that the profile is a venue profile and has screenshots

    return <>
        <Box style={{alignSelf: "stretch", paddingTop: "8px", paddingBottom: "8px"}}>
            <header>
                <InformationIcon />
                Screenshots
            </header>
            {profile.metadata.screenshots.map(item => (
                <div key={JSON.stringify(item)}>
                    <img src={item.url} alt={item.caption !== undefined ? item.caption : ""} />
                    {item.caption !== undefined && <div>{item.caption}</div>}
                </div>
            ))}
        </Box>
    </>;
};

export default ScreenshotSection;