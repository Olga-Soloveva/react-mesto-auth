import React from "react";
import Popup from "./Popup";

function ImagePopup({ name, isOpen, onClose, card }) {
  return (
    <Popup isOpen={isOpen} name="card" onClose={onClose}>
      <img className="popup__card" src={card.link} alt={card.name} />
      <p className="popup__card-name">{card.name}</p>
    </Popup>
  );
}

export default ImagePopup;
