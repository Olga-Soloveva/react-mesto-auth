import React, { useState, useEffect } from "react";

import Popup from "./Popup";

function PopupWithForm({
  name,
  isOpen,
  onClose,
  title,
  isSave,
  onSubmit,
  isFormValid,
  children,
}) {
  const [btnText, setBtnText] = useState("Сохранить");

  useEffect(() => {
    !isSave ? setBtnText("Сохранить") : setBtnText("Сохранение...");
  }, [isSave]);

  return (
    <Popup isOpen={isOpen} name={name} onClose={onClose}>
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
    </Popup>
  );
}

export default PopupWithForm;
