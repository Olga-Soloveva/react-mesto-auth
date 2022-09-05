import { useEffect } from "react";

const Popup = ({ name, isOpen, onClose, children }) => {
  useEffect(() => {
    if (!isOpen) return;

    const closeByEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", closeByEscape);
    return () => {
      document.removeEventListener("keydown", closeByEscape);
    };
  }, [isOpen, onClose]);

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`popup ${isOpen && "popup_opened"} popup_type_${name}`}
      onClick={handleOverlay}
    >
      <div
        className={
          ( name !== "card") ? `popup__container` : `popup__container-card`
        }
      >
        <button className="popup__close" type="button" onClick={onClose} />
        {children}
      </div>
    </div>
  );
};

export default Popup;
