import { ClipLoader } from "react-spinners";

const ToolbarButton = ({ icon: Icon, onClick, isActive, isProcessing }) => {
  return (
    <button type="button" onClick={onClick} className="flex items-center">
      {isProcessing ? (
        <ClipLoader size={18} color="var(--color-silver-chalice)" />
      ) : (
        <Icon
          className={`h-5 w-5 cursor-pointer stroke-[1.5] ${isActive ? "text-ebony-clay" : "text-silver-chalice"} `}
        />
      )}
    </button>
  );
};

export default ToolbarButton;
