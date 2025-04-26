const ToolbarButton = ({ icon: Icon, onClick, isActive, ...props }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center"
      {...props}
    >
      <Icon
        className={`h-5 w-5 cursor-pointer ${isActive ? "text-ebony-clay stroke-2" : "text-silver-chalice stroke-[1.5]"} `}
      />
    </button>
  );
};

export default ToolbarButton;
