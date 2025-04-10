import { ClipLoader } from "react-spinners";

const IconButton = ({
  type = "button",
  size = "w-6 h-6",
  icon: Icon,
  src,
  label,
  onClick,
  isProcessing,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      {...props}
      disabled={isProcessing}
      className={`cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 ${label ? "group flex w-full items-center gap-2.5" : "rounded-full"}`}
    >
      {isProcessing ? (
        <ClipLoader size={20} color="var(--gallery)" />
      ) : Icon ? (
        <Icon
          className={`text-gravel stroke-[1.5] ${label ? "group-hover:text-indigo h-5 w-5" : size}`}
        />
      ) : (
        src && <img src={src} alt="icon" />
      )}
      {label && (
        <span
          className={`font-body text-gravel text-base whitespace-nowrap ${isProcessing ? "" : "group-hover:text-indigo"}`}
        >
          {label}
        </span>
      )}
    </button>
  );
};

export default IconButton;
