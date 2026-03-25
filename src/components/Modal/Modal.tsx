import css from "./Modal.module.css";
import { createPortal } from "react-dom";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const modalRoot = document.querySelector("#modal-root") as HTMLElement;
function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}

export default Modal;
