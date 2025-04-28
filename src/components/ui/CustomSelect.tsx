import { ChevronDown } from "lucide-react";
import React from "react";
import Select, { components, DropdownIndicatorProps } from "react-select";

const DropdownIndicator = (props: DropdownIndicatorProps) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="text-ebony-clay h-4 w-4 stroke-[1.5]" />
    </components.DropdownIndicator>
  );
};

const customClassNames = (customStyle) => ({
  control: ({ isFocused }) =>
    `rounded-md ${customStyle.padding} font-body gap-1.5 hover:cursor-pointer! min-h-full! ${customStyle.text} ${
      isFocused ? customStyle.borderFocused : customStyle.border
    }`,

  menu: () =>
    `mt-1 p-1 rounded-md ${customStyle.text} ${customStyle.borderMenu} bg-white dark:bg-[#16163B]`,
  option: ({ isFocused, isSelected }) =>
    `hover:cursor-pointer! whitespace-nowrap rounded-sm transition-all duration-300 ease-in-out font-body ${customStyle.paddingOption} ${
      isSelected
        ? "text-indigo font-semibold"
        : isFocused
          ? "bg-cornflower-blue/10 text-ebony-clay"
          : "text-ebony-clay"
    }`,

  singleValue: () => "text-ebony-clay",
  placeholder: () => "text-silver-chalice",
});

const CustomSelect = ({
  customStyle = {
    width: "w-full",
    text: "text-sm md:text-base",
    padding: "px-3 py-[6px]",
    border: "border border-gray-200 dark:border-gray-100/20",
    borderFocused:
      "border border-indigo shadow-[0px_0px_8px_rgba(107,118,246,0.4)]",
    borderMenu: "border border-gray-200 dark:border-gray-100/20",
    paddingOption: "px-3 py-2",
  },
  ...props
}) => {
  return (
    <Select
      {...props}
      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      menuPortalTarget={document.body}
      unstyled
      isClearable={false}
      isSearchable={false}
      className={`${customStyle.width}`}
      classNames={customClassNames(customStyle)}
      components={{ DropdownIndicator }}
    />
  );
};

export default CustomSelect;
