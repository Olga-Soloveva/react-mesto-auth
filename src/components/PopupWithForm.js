import React, { useState, useEffect } from "react";

function PopupWithForm({name,
title,
isOpen,
isSave,
onClose,
onSubmit,
isFormValid, children}) {
  const [btnText, setBtnText] = useState("Сохранить");

  useEffect(() => {
    !isSave ? setBtnText("Сохранить") : setBtnText("Сохранение...");
  }, [isSave]);

  const handleEscClose = (evt) => {
    if (evt.key === "Escape") {
      onClose();
      document.removeEventListener("keydown", handleEscClose);
    }
  };

  if (isOpen === true) {
    document.addEventListener("keydown", handleEscClose);
  }

  const handleOverlay = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`popup popup_type_${name} ${
        isOpen && "popup_opened"
      }`}
      onMouseDown={handleOverlay}
    >
      <div className="popup__container">
        <button
          type="button"
          className="popup__close"
          aria-label={`Закрыть окно "${title}"`}
          onClick={onClose}
        />
        <h2 className="popup__heading">{title}</h2>
        <form
          className="popup__form"
          name={name}
          id={name}
          onSubmit={onSubmit}
          noValidate
        >
          {children}

          <button
            type="submit"
            className={`popup__button ${
              !isFormValid && "popup__button_disabled"
            }`}
            aria-label="Сохранить изменения"
            disabled={!isFormValid}
          >
            {name === "confirm" ? "Да" : btnText}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
