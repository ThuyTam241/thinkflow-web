import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NoteCardSkeleton = () => {
  return (
    <div className="w-80 border border-gray-200 px-4 py-3 dark:border-gray-100/20">
      <Skeleton height={18} containerClassName="flex-1" />
      <Skeleton height={10} width={70} />
    </div>
  );
};

export default NoteCardSkeleton;
