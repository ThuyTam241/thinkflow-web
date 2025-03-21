import checkCircleIcon from "../../assets/icons/circle-check-big-icon.svg";
import xCircleIcon from "../../assets/icons/circle-x-icon.svg";
import alertTriangleIcon from "../../assets/icons/triangle-alert-icon.svg";
import infoIcon from "../../assets/icons/info-icon.svg";
import { toast } from "react-toastify";

const CustomToast = ({ type = "info", title, message }) => {
  const icons = {
    success: checkCircleIcon,
    error: xCircleIcon,
    warning: alertTriangleIcon,
    info: infoIcon,
  };

  return (
    <div className="mr-4 flex gap-3">
      <img
        className="h-6 w-6"
        src={icons[type]}
        alt={icons[type].split("/").pop().replace(".svg", "")}
      />

      <div>
        <h3 className="font-body text-base font-semibold text-black">
          {title}
        </h3>
        <p className="font-body text-gravel mt-1 text-sm">{message}</p>
      </div>
    </div>
  );
};

const notify = (type, title, message, color, position = "top-right") => {
  toast(<CustomToast type={type} title={title} message={message} />, {
    position,
    className: "max-w-xs",
    style: { "--toastify-color-progress-light": color },
  });
};

export default notify;
