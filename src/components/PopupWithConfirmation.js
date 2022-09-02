import React from "react";
import PopupWithForm from "./PopupWithForm";

function PopupWithConfirmation({
  isOpen,
  onClose,
  onConfirm,
  selectedDeleteCard,
}) {
  function handleConfirm(evt) {
    evt.preventDefault();
    onConfirm(selectedDeleteCard);
  }

  return (
    <PopupWithForm
      name="confirm"
      title="Вы уверены?"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleConfirm}
      isFormValid={true}
    ></PopupWithForm>
  );
}

export default PopupWithConfirmation;
