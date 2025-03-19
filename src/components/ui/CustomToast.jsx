import checkCircleIcon from "../../assets/icons/circle-check-big-icon.svg";
import xCircleIcon from "../../assets/icons/circle-x-icon.svg";
import alertTriangleIcon from "../../assets/icons/triangle-alert-icon.svg";
import infoIcon from "../../assets/icons/info-icon.svg";

const CustomToast = ({ type = "info", title, message }) => {
  const icons = {
    success: checkCircleIcon,
    error: xCircleIcon,
    warning: alertTriangleIcon,
    info: infoIcon,
  };

  return (
    <div
      className="flex gap-3 mr-4"
    >
      <img className="w-6 h-6"
        src={icons[type]}
        alt={icons[type].split("/").pop().replace(".svg", "")}
      />

      <div>
        <h3 className="font-body text-black text-base font-semibold">
          {title}
        </h3>
        <p className="mt-1 font-body text-gravel text-sm">{message}</p>
      </div>
    </div>
  );
};

export default CustomToast;
