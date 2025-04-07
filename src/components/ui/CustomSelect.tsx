import { ChevronDown } from "lucide-react";
import React from "react";
import Select, { components, DropdownIndicatorProps } from "react-select";

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="text-silver-chalice w-5 h-5 stroke-[1.5]" />
    </components.DropdownIndicator>
  );
};

const customClassNames = {
  control: ({ isFocused }) =>
    `rounded-md px-3 py-[6px] text-sm md:text-base font-body hover:cursor-pointer! ${
      isFocused
        ? "border border-indigo shadow-[0px_0px_8px_rgba(107,118,246,0.4)]"
        : "border border-gallery"
    }`,

  menu: () =>
    "mt-1 rounded-md shadow-[0px_1px_8px_rgba(39,35,64,0.1)] z-50 border border-gallery bg-white dark:bg-[#16163B] text-sm md:text-base",

  option: ({ isFocused, isSelected }) =>
    `hover:cursor-pointer! first:rounded-tl-md first:rounded-tr-md last:rounded-bl-md last:rounded-br-md transition-all duration-300 ease-in-out px-3 font-body py-2 ${
      isSelected
        ? "bg-cornflower-blue text-white font-semibold"
        : isFocused
          ? "text-indigo font-semibold"
          : "text-ebony-clay"
    }`,

  singleValue: () => "text-ebony-clay",
  placeholder: () => "text-silver-chalice",
};

const CustomSelect = ({ ...props }) => {
  return (
    <Select
      {...props}
      unstyled
      isClearable={false}
      isSearchable={false}
      className="w-full"
      classNames={customClassNames}
      components={{ DropdownIndicator }}
    />
  );
};

export default CustomSelect;
