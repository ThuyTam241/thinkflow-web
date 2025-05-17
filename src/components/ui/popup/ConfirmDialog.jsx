import { X } from "lucide-react";
import IconButton from "../buttons/IconButton";
import PrimaryButton from "../buttons/PrimaryButton";

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Yes",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-[#16163B]">
        <div className="absolute top-2 right-2">
          <IconButton
            size="w-5 h-5"
            onClick={onCancel}
            icon={X}
            customStyle="text-silver-chalice stroke-[1.5]"
          />
        </div>
        <h2 className="font-body text-ebony-clay mb-2 text-xl font-semibold">
          {title}
        </h2>
        <p className="font-body text-gravel mb-6 text-base">{message}</p>
        <div className="flex justify-end space-x-3">
          <PrimaryButton
            onClick={onCancel}
            label={cancelText}
            color="white"
            fontSize="text-xs md:text-sm"
          />
          <PrimaryButton
            onClick={onConfirm}
            label={confirmText}
            color="red"
            fontSize="text-xs md:text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog
