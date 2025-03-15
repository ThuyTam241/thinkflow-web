const PrimaryButton = ({ color, label, type = "button", onClick }) => {
  const colorVariants = {
    white:
      "border-gallery bg-white text-ebony-clay hover:shadow-[0px_6px_20px_rgba(0,0,0,0.1)]",
    blue: "border-indigo bg-cornflower-blue text-white hover:shadow-[0px_6px_20px_rgba(99,104,209,0.4)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${colorVariants[color]} font-body cursor-pointer rounded-[6px] border-[1px] border-solid px-4 py-2 text-sm font-bold transition-all duration-300 ease-in-out md:text-base/[22px]`}
    >
      {label}
    </button>
  );
};

export default PrimaryButton;
