import { SetlistTask } from "@app/tasks/Processors/Setlist";
import BaseQueue from "./base";
import SetlistIcon from "@app/assets/SourceIcons/Official.png";

interface Props {
    setlistTask: SetlistTask,
    bannerMode: boolean,
}

const SetlistQueue: React.FC<Props> = ({ setlistTask, bannerMode }: Props) => {
    return <BaseQueue
        name="YARG Setlist"
        icon={<img src={SetlistIcon} />}
        versionChannel={setlistTask.version}
        bannerMode={bannerMode}
    />;
};

export default SetlistQueue;