import { ClipLoader } from "react-spinners";

const PrimaryButton = ({
  color,
  label,
  fontSize = "text-sm md:text-base",
  type = "button",
  onClick,
  isProcessing,
  ...props
}) => {
  const colorVariants = {
    white:
      "border-gray-200 dark:border-gray-100/20 bg-white dark:bg-[#16163B] text-gravel enabled:hover:shadow-[0px_6px_20px_rgba(39,35,64,0.1)]",
    blue: "border-indigo bg-cornflower-blue text-white enabled:hover:shadow-[0px_6px_20px_rgba(99,104,209,0.4)]",
    red: "border-red-600 bg-crimson-red text-white enabled:hover:shadow-[0px_2px_12px_rgba(230,57,70,0.4)]",
  };

  const spinnercolorVariants = {
    white: "var(--spinner-white)",
    blue: "var(--spinner-blue)",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${colorVariants[color]} font-body inline-flex cursor-pointer items-center rounded-md border-[1px] border-solid px-4 py-2 font-bold transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-60 ${fontSize}`}
      {...props}
      disabled={isProcessing || props.disabled}
    >
      {isProcessing && (
        <ClipLoader
          size={20}
          color={spinnercolorVariants[color]}
          className="mr-2"
        />
      )}
      {label}
    </button>
  );
};

export default PrimaryButton;
