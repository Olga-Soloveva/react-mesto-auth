import React from "react";
import Popup from "./Popup";

function InfoTooltip({ name = "info", isOpen, onClose, status }) {
  return (
    <Popup isOpen={isOpen} name={name} onClose={onClose}>
      <div
        className={`popup__status-img  ${
          status === "ok"
            ? "popup__status-img_type_ok"
            : "popup__status-img_type_error"
        }`}
      />
      <p className="popup__status-text">
        {status === "ok"
          ? "Вы успешно зарегистрировались!"
          : "Что-то пошло не так!Попробуйте ещё раз."}
      </p>
    </Popup>
  );
}

export default InfoTooltip;
