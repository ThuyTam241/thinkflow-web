import Skeleton from "react-loading-skeleton";

const AudioItemSkeleton = () => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <Skeleton circle height={44} width={44} />
      <div className="flex flex-col justify-between">
        <Skeleton width={100} height={16} />
        <Skeleton width={80} height={14} />
      </div>
    </div>
    <div className="flex items-center gap-3">
      <Skeleton width={24} height={24} />
      <Skeleton width={24} height={24} />
    </div>
  </div>
);

export default AudioItemSkeleton;
