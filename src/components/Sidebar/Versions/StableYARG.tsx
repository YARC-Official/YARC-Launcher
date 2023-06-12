import { useYARGRelease } from "@app/hooks/useReleases";
import BaseVersion from "./Base";
import StableYARGIcon from '@app/assets/StableYARGIcon.png';

const StableYARGVersion: React.FC = () => {
  const { data } = useYARGRelease("stable");

  return (
    <BaseVersion 
      icon={<img src={StableYARGIcon} alt="YARG"/>}
      programName="YARG"
      versionChannel="Stable"
      version={data?.tag_name}
      updateAvailable={true}
    />
  );
}

export default StableYARGVersion;