const TextInput = ({
  type,
  placeholder,
  name,
  value,
  onChange,
  errorMessage,
}) => {
  return (
    <div className="flex w-full flex-col items-start gap-1.5">
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="on"
        className={`border-gallery font-body text-silver-chalice focus:outline-indigo w-full rounded-[6px] border px-3 py-[6px] text-sm md:text-base focus:shadow-[0px_0px_8px_rgba(107,118,246,0.4)] focus:outline-1 ${errorMessage ? "" : ""}`}
      />
      {errorMessage && (
        <span className="font-body text-crimson-red text-xs md:text-sm">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default TextInput;
