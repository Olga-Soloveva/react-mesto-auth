import React, {useState, useEffect, useContext}  from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function EditProfilePopup({
  isOpen,
  isSave,
  onClose,
  onUpdateUser,
  onSaveChange,
}) {
  const currentUser = useContext(CurrentUserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isValidName, setIsValidName] = useState(true);
  const [isValidDescription, setIsValidDescription] = useState(true);
  const [isValidForm, setIsValidForm] = useState(false);
  const [errorNameMessage, setErrorNameMessage] = useState("");
  const [errorDescriptionMessage, setErrorDescriptionMessage] =
    useState("");

  function handleChangeName(evt) {
    setName(evt.target.value);
    setErrorNameMessage(evt.target.validationMessage);
    setIsValidName(evt.target.validity.valid);
  }

  function handleChangeDescription(evt) {
    setDescription(evt.target.value);
    setErrorDescriptionMessage(evt.target.validationMessage);
    setIsValidDescription(evt.target.validity.valid);
  }

  useEffect(() => {
    setIsValidName(true);
    setIsValidDescription(true);
    setErrorNameMessage("");
    setErrorDescriptionMessage("");
  }, [isOpen]);

  useEffect(() => {
    setIsValidForm(isValidName && isValidDescription);
  }, [isValidName, isValidDescription, isOpen]);

  function handleSubmit(evt) {
    evt.preventDefault();
    onSaveChange();

    onUpdateUser({
      name,
      about: description,
    });
  }

  useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      name="edit-profile"
      title="Редактировать профиль"
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
          className={`popup__input ${
            !isValidName && "popup__input_iserror"
          }`}
          type="text"
          id="name-input"
          name="nameInput"
          autoComplete="off"
          placeholder="Имя"
          required
          minLength="2"
          maxLength="40"
        />
        <span
          className={`popup__error name-input-error ${
            !isValidName && "popup__error_visible"
          }`}
        >
          {errorNameMessage}
        </span>
      </label>
      <label className="popup__field">
        <input
          value={description}
          onChange={handleChangeDescription}
          className={`popup__input ${
            !isValidDescription && "popup__input_iserror"
          }`}
          type="text"
          id="description-input"
          name="descriptionInput"
          autoComplete="off"
          placeholder="О себе"
          required
          minLength="2"
          maxLength="200"
        />
        <span
          className={`popup__error description-input-error ${
            !isValidDescription && "popup__error_visible"
          }`}
        >
          {errorDescriptionMessage}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
