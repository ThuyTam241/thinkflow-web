const ToolbarButton = ({ icon: Icon, onClick, isActive, ...props }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center"
      {...props}
    >
      <Icon
        className={`h-5 w-5 cursor-pointer stroke-[1.5] ${isActive ? "text-ebony-clay" : "text-silver-chalice"} `}
      />
    </button>
  );
};

export default ToolbarButton;
