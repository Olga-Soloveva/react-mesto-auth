import React, { useState, useRef, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup({
  isOpen,
  isSave,
  onClose,
  onUpdateAvatar,
  onSaveChange,
}) {
  const avatarRef = useRef("");
  const [isValidAvatar, setIsValidAvatar] = useState(true);
  const [errorAvatarMessage, setErrorAvatarMessage] = useState("");

  function handleChangeAvatar(evt) {
    setErrorAvatarMessage(evt.target.validationMessage);
    setIsValidAvatar(evt.target.validity.valid);
  }

  useEffect(() => {
    setIsValidAvatar(true);
    setErrorAvatarMessage("");
    avatarRef.current.value = "";
  }, [isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onSaveChange();
    onUpdateAvatar({
      avatar: avatarRef.current.value,
    });
  }

  return (
    <PopupWithForm
      name="edit-avatar"
      title="Обновить аватар"
      isOpen={isOpen}
      isSave={isSave}
      onClose={onClose}
      onSubmit={handleSubmit}
      isFormValid={isValidAvatar}
    >
      <label className="popup__field">
        <input
          ref={avatarRef}
          onChange={handleChangeAvatar}
          className={`popup__input ${
            !isValidAvatar && "popup__input_iserror"
          }`}
          type="url"
          id="avatar-input"
          name="avatarInput"
          autoComplete="off"
          placeholder="Ссылка на новый аватар"
          required
        />
        <span
          className={`popup__error avatar-input-error ${
            !isValidAvatar && "popup__error_visible"
          }`}
        >
          {errorAvatarMessage}
        </span>
      </label>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;
