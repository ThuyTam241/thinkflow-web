import { useEffect, useRef } from "react";

const TextArea = ({ style = "text-ebony-clay", placeholder, ...props }) => {

  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [textareaRef]);


  return (
    <textarea
      ref={(e) => {
        if (props.register?.ref) props.register.ref(e);
        textareaRef.current = e;
      }}
      name={props.register?.name}
      onChange={(e) => {
        props.register?.onChange?.(e);
        e.currentTarget.style.height = "auto";
        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
        props.onChange?.(e);
      }}
      onBlur={(e) => {
        props.register?.onBlur?.(e);
        props.onBlur?.(e);
      }}
      spellCheck="false"
      placeholder={placeholder}
      {...props}
      className={`font-body w-full resize-none overflow-hidden text-sm outline-none md:text-base ${style}`}
    />
  );
};

export default TextArea;
