const TextArea = ({
  style = "text-sm md:text-base outline",
  placeholder,
  ...props
}) => {
  return (
    <div className="relative flex h-44 w-full flex-col items-start gap-1.5">
      <textarea
        placeholder={placeholder}
        {...props}
        className={`outline-gallery h-full peer no-scrollbar font-body text-ebony-clay w-full px-3 py-2 ${style} focus:outline-indigo focus:shadow-[0px_0px_8px_rgba(107,118,246,0.4)]`}
      />
    </div>
  );
};

export default TextArea;
