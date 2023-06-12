import BaseVersion from "./Base";
import StableYARGIcon from '@app/assets/StableYARGIcon.png';

const StableYARGVersion: React.FC = () => {
  return (
    <BaseVersion 
      icon={<img src={StableYARGIcon} alt="YARG"/>}
      programName="YARG"
      versionChannel="Stable"
      updateAvailable={true}
    />
  );
}

export default StableYARGVersion;