const ToolbarButton = ({ icon: Icon, onClick, isActive }) => {
  return (
    <button type="button" onClick={onClick}>
      {
        <Icon
          className={`h-5 w-5 cursor-pointer stroke-[1.5] ${isActive ? "text-ebony-clay" : "text-silver-chalice"} `}
        />
      }
    </button>
  );
};

export default ToolbarButton;
