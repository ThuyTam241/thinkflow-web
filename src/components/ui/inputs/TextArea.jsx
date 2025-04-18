const TextArea = ({
  style = "text-ebony-clay h-full",
  placeholder,
  ...props
}) => {
  return (
    <textarea
      placeholder={placeholder}
      {...props}
      className={`no-scrollbar font-body w-full resize-none text-sm outline-none md:text-base ${style}`}
    />
  );
};

export default TextArea;
