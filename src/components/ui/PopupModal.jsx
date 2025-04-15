import { useEffect, useRef } from "react";
import IconButton from "./buttons/IconButton";
import { X } from "lucide-react";
import PrimaryButton from "./buttons/PrimaryButton";

const PopupModal = ({
  isPopupOpen,
  setIsPopupOpen,
  title,
  isProcessing,
  children,
  onSubmit,
  confirmLabel = "Submit",
}) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopupOpen]);

  if (!isPopupOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <form
        ref={modalRef}
        onSubmit={onSubmit}
        className="relative flex flex-col items-center gap-6 w-[90%] max-w-md rounded-lg bg-white p-6 text-center shadow-lg"
      >
        <div className="absolute top-2 right-2">
          <IconButton
            size="w-5 h-5"
            onClick={() => setIsPopupOpen(false)}
            icon={X}
          />
        </div>
        <h2 className="text-xl font-body font-bold">{title}</h2>
        {children}
        <div className="ml-auto">
          <PrimaryButton
            color="blue"
            type="submit"
            disabled={isProcessing}
            label={confirmLabel}
          />
        </div>
      </form>
    </div>
  );
};

export default PopupModal;
