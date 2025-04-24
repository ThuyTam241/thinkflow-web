import { useEffect, useRef } from "react";
import IconButton from "../buttons/IconButton";
import { X } from "lucide-react";

const FormModal = ({ isOpen, setIsOpen, title, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="relative flex w-[90%] max-w-md flex-col items-center gap-6 rounded-lg bg-white p-8 shadow-lg dark:bg-[#16163B]"
      >
        <div className="absolute top-2 right-2">
          <IconButton
            size="w-5 h-5"
            onClick={() => setIsOpen(false)}
            icon={X}
          />
        </div>
        <h2 className="font-body text-ebony-clay text-center text-xl font-bold">
          {title}
        </h2>
        <form noValidate className="flex w-full flex-col gap-5">
          {children}
        </form>
      </div>
    </div>
  );
};

export default FormModal;
