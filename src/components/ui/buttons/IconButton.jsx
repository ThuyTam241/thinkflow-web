const IconButton = ({ src, text, onClick }) => {
  return (
    <button onClick={onClick} className={`cursor-pointer ${text ? "flex items-center gap-2.5 rounded-[6px]" : "rounded-full"}`}>
      <img src={src} alt={src.split("/").pop().replace(".svg", "")} />
      {text && (<span className="font-body text-ebony-clay text-base">{text}</span>)}
    </button>
  );
};

export default IconButton;
