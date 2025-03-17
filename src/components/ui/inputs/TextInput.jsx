import { useState } from "react";
import eyeIcon from "../../../assets/icons/eye-icon.svg";
import eyeOffIcon from "../../../assets/icons/eye-off-icon.svg";

const TextInput = ({
  type,
  placeholder,
  name,
  value,
  onChange,
  errorMessage,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={`${type === "password" ? "relative" : ""} relative flex w-full flex-col items-start gap-1.5`}
    >
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete="on"
        className={`border-gallery font-body text-ebony-clay focus:outline-indigo w-full rounded-[6px] border px-3 py-[6px] text-sm focus:shadow-[0px_0px_8px_rgba(107,118,246,0.4)] focus:outline-1 md:text-base ${errorMessage ? "" : ""}`}
      />
      {type === "password" && value && (
        <img
          src={showPassword ? eyeOffIcon : eyeIcon}
          alt={showPassword ? "eye-off-icon" : "eye-icon"}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-1/2 right-3 w-5 -translate-y-1/2 cursor-pointer"
        />
      )}
      {errorMessage && (
        <span className="font-body text-crimson-red text-xs md:text-sm">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default TextInput;
