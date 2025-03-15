import { useState } from "react";
import checkMarkIcon from "../../../assets/icons/check-mark-icon.svg"

const Checkbox = ({ label, ...props }) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div
      className="flex cursor-pointer items-center gap-1"
      onClick={() => setIsChecked(!isChecked)}
    >
      {isChecked ? (
        <img
          src={checkMarkIcon}
          alt="check-mark-icon"
          className="h-3 w-3 rounded-[2px] md:h-3.5 md:w-3.5"
        />
      ) : (
        <input
          type="checkbox"
          checked={isChecked}
          {...props}
          className="h-3 w-3 cursor-pointer md:h-3.5 md:w-3.5"
        />
      )}
      <label
        htmlFor={props.id}
        className="font-body text-ebony-clay cursor-pointer text-xs md:text-sm"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
