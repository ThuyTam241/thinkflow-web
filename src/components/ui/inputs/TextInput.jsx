import { useState } from "react";
import eyeIcon from "../../../assets/icons/eye-icon.svg";
import eyeOffIcon from "../../../assets/icons/eye-off-icon.svg";

const TextInput = ({ type = "text", placeholder, errorMessage, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={`${type === "password" ? "relative" : ""} relative flex w-full flex-col items-start gap-1.5`}
    >
      <input
        type={type === "password" && showPassword ? "text" : type}
        placeholder={placeholder}
        {...props}
        autoComplete="on"
        className={`outline-gallery peer font-body text-ebony-clay w-full rounded-[6px] px-3 py-[6px] text-sm outline md:text-base ${errorMessage ? "focus:outline-crimson-red outline-crimson-red! focus:shadow-[0px_0px_8px_rgba(230,57,70,0.4)]" : "focus:outline-indigo focus:shadow-[0px_0px_8px_rgba(107,118,246,0.4)]"}`}
      />
      {type === "password" && (
        <img
          src={showPassword ? eyeIcon : eyeOffIcon}
          alt={showPassword ? "eye-icon" : "eye-off-icon"}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute top-2 right-3 w-5 cursor-pointer peer-placeholder-shown:hidden"
        />
      )}
      {errorMessage && (
        <span className="font-body text-crimson-red text-left text-xs font-medium md:text-sm">
          {errorMessage.message}
        </span>
      )}
    </div>
  );
};

export default TextInput;
