import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NoteCardSkeleton = () => {
  return (
    <div className="border-gallery rounded-md border px-4 py-3">
      <Skeleton height={18} containerClassName="flex-1" />
      <Skeleton height={10} width={70} />
    </div>
  );
};

export default NoteCardSkeleton;
