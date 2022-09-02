import React, { useState, useEffect } from "react";

import apiOption from "../utils/Api";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithConfirmation from "./PopupWithConfirmation";

function Mesto({ loggedIn }) {
  const [currentUser, setCurrentUser] = useState({ name: "", about: "" });
  const [selectedCard, setSelectedCard] = useState({});
  const [selectedDeleteCard, setSelectedDeleteCard] = useState({});
  const [cards, setCards] = useState([]);

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isAwaitApiQuery, setIsAwaitApiQuery] = useState(false);

  // Получить данные о пользователе

  useEffect(() => {
    apiOption
      .getUserInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // Изменить данные о пользователе и аватар

  function handleUpdateUser({ name, about }) {
    apiOption
      .editUserInfo({ name, about })
      .then((res) => {
        setCurrentUser({ ...currentUser, name: res.name, about: res.about });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsAwaitApiQuery(false);
      });
  }

  function handleUpdateAvatar({ avatar }) {
    apiOption
      .editAvatarInfo({ avatar })
      .then((res) => {
        setCurrentUser({ ...currentUser, avatar: res.avatar });
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsAwaitApiQuery(false);
      });
  }

  // Карточки

  useEffect(() => {
    apiOption
      .getInitialCards()
      .then((res) => {
        setCards(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    apiOption.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    });
  }

  function handleCardDelete(card) {
    setSelectedDeleteCard(card);
    setIsConfirmPopupOpen(true);
  }

  function DeleteCard(card) {
    apiOption
      .deleteCard(card._id)
      .then(() => {
        setCards((state) =>
          state.filter((c) => {
            return c._id !== card._id;
          })
        );
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    apiOption
      .sendCardInfo({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsAwaitApiQuery(false);
      });
  }

  // Открытие и закрытие Popup

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(res) {
    setSelectedCard(res);
  }

  function handleSaveBtn() {
    setIsAwaitApiQuery(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard({});
    setSelectedDeleteCard({});
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <>
        <Header />
        <Main
          onEditProfile={handleEditProfileClick}
          onEditAvatar={handleEditAvatarClick}
          onAddPlace={handleAddPlaceClick}
          onCardClick={handleCardClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          isSave={isAwaitApiQuery}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          onSaveChange={handleSaveBtn}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          isSave={isAwaitApiQuery}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          onSaveChange={handleSaveBtn}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          isSave={isAwaitApiQuery}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          onSaveChange={handleSaveBtn}
        />

        <PopupWithConfirmation
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onConfirm={DeleteCard}
          selectedDeleteCard={selectedDeleteCard}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
      </>
    </CurrentUserContext.Provider>
  );
}

export default Mesto;
