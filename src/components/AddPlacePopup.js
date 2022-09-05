import React, { useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, isSave, onClose, onAddPlace, onSaveChange }) {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [isValidName, setIsValidName] = useState(true);
  const [isValidLink, setIsValidLink] = useState(true);
  const [isValidForm, setIsValidForm] = useState(false);
  const [errorNameMessage, setErrorNameMessage] = useState("");
  const [errorLinkMessage, setErrorLinkMessage] = useState("");

  function handleChangeName(evt) {
    setName(evt.target.value);
    setErrorNameMessage(evt.target.validationMessage);
    setIsValidName(evt.target.validity.valid);
  }

  function handleChangeLink(evt) {
    setLink(evt.target.value);
    setErrorLinkMessage(evt.target.validationMessage);
    setIsValidLink(evt.target.validity.valid);
  }

  useEffect(() => {
    setIsValidName(true);
    setIsValidLink(true);
    setErrorNameMessage("");
    setErrorLinkMessage("");
    setName("");
    setLink("");
  }, [isOpen]);

  useEffect(() => {
    setIsValidForm(isValidName && isValidLink);
  }, [isValidName, isValidLink, isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onSaveChange();

    onAddPlace({
      name,
      link,
    });
  }

  return (
    <PopupWithForm
      name="add-card"
      title="Новое место"
      isOpen={isOpen}
      isSave={isSave}
      onClose={onClose}
      onSubmit={handleSubmit}
      isFormValid={isValidForm}
    >
      <label className="popup__field">
        <input
          value={name}
          onChange={handleChangeName}
          className={`popup__input ${!isValidName && "popup__input_iserror"}`}
          type="text"
          id="place-input"
          name="placeInput"
          autoComplete="off"
          placeholder="Название"
          required
          minLength="2"
          maxLength="30"
        />
        <span
          className={`popup__error place-input-error ${
            !isValidName && "popup__error_visible"
          }`}
        >
          {errorNameMessage}
        </span>
      </label>
      <label className="popup__field">
        <input
          value={link}
          onChange={handleChangeLink}
          className={`popup__input ${!isValidLink && "popup__input_iserror"}`}
          type="url"
          id="link-input"
          name="linkInput"
          autoComplete="off"
          placeholder="Ссылка на картинку"
          required
        />
        <span
          className={`popup__error link-input-error ${
            !isValidLink && "popup__error_visible"
          }`}
        >
          {errorLinkMessage}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
