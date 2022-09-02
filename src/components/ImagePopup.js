import React from "react";

function ImagePopup({card, onClose}) {
  return (
    <div
      className={`popup popup_type_open-card ${
        "name" in card && "link" in card && "popup_opened"
      }`}
    >
      <div className="popup__container-card">
        <button
          type="button"
          className="popup__close"
          aria-label="Закрыть фотокарточку"
          onClick={onClose}
        />
        <img
          className="popup__card"
          src={card.link}
          alt={card.name}
        />
        <p className="popup__card-name">{card.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;
