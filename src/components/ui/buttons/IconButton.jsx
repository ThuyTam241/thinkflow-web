import { ClipLoader } from "react-spinners";

const IconButton = ({
  type = "button",
  customStyle = "text-gravel stroke-[1.5]",
  colorLoad = "var(--color-gallery)",
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
      {isProcessing && label ? (
        <ClipLoader size={20} color={colorLoad} />
      ) : Icon ? (
        <Icon
          className={`${customStyle} ${label ? "group-hover:text-indigo h-5 w-5" : size}`}
        />
      ) : (
        src && <img src={src} alt="icon" />
      )}
      {label && (
        <span
          className={`font-body ${customStyle} text-base whitespace-nowrap ${isProcessing ? "" : "group-hover:text-indigo"}`}
        >
          {label}
        </span>
      )}
    </button>
  );
};

export default IconButton;
