// import React, { useState, useEffect } from "react";

function InfoTooltip({ isOpen, onClose, status }) {
  const handleOverlay = (evt) => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`popup ${isOpen && "popup_opened"}`}
      onMouseDown={handleOverlay}
    >
      <div className="popup__container">
        <div
          className={`popup__status-img  ${
            status === "ok"
              ? "popup__status-img_type_ok"
              : "popup__status-img_type_error"
          }`}
        />

        <button
          type="button"
          className="popup__close"
          aria-label={`Закрыть окно`}
          onClick={onClose}
        />

        <p className="popup__status-text">{
            status === "ok"
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так!Попробуйте ещё раз."
          }</p>
      </div>
    </div>
  );
}

export default InfoTooltip;
