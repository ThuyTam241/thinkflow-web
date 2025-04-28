const Checkbox = ({ label, ...props }) => {
  return (
    <label className="font-body text-ebony-clay flex cursor-pointer items-center gap-1 text-xs md:text-sm">
      <input type="checkbox" {...props} className="peer hidden" />
      <div className="h-4 w-4 rounded-sm border border-gray-200 peer-checked:invisible dark:border-gray-100/20"></div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="invisible absolute rounded-sm peer-checked:visible"
      >
        <rect width="16" height="16" rx="2" fill="#6B76F6" />
        <rect width="16" height="16" rx="2" stroke="#6B76F6" />
        <path
          d="M4 7.63158L6.57143 10L12 5"
          stroke="white"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
      </svg>
      {label}
    </label>
  );
};

export default Checkbox;
