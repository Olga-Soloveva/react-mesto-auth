import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import authOption from "../utils/Auth";
import apiOption from "../utils/Api";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";

import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithConfirmation from "./PopupWithConfirmation";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isCheckToken, setIsCheckToken] = useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState("");
  const [email, setEmail] = useState("");
  const [currentUser, setCurrentUser] = useState({
    id: "",
    name: "",
    about: "",
    avatar: "",
    email: "",
  });
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState({});
  const [selectedDeleteCard, setSelectedDeleteCard] = useState({});
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [isAwaitApiQuery, setIsAwaitApiQuery] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (loggedIn) {
      apiOption
        .getUserInfo(token)
        .then((res) => {
          setCurrentUser({
            ...currentUser,
            id: res._id,
            name: res.name,
            about: res.about,
            avatar: res.avatar,
          });
        })
        .catch((err) => {
          console.log(err);
        });

      apiOption
        .getInitialCards(token)
        .then((res) => {
          setCards(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      setIsCheckToken(true);
      authOption
        .checkToken(token)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setEmail(res.email)
            history.push("/");
          }
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          console.log(err);
        });
    }
  }, [history]);

  function closeInfoTooltip() {
    setInfoTooltipOpen(false);
  }

  function onSignOut() {
    history.push("/signin");
    localStorage.removeItem("jwt");
    setCurrentUser({  id: "", name: "", about: "", avatar: "" });
    setCards([]);
    setEmail("");
    setLoggedIn(false);
    setIsCheckToken(false);
  }

  const onRegister = ({ password, email }) => {
    return authOption
      .register(password, email)
      .then((data) => {
        if (!data.token) {
          setInfoTooltipOpen(true);
          setAuthStatus("error");
          throw new Error("Что-то пошло не так!");
        }
        if (data.token) {
          setAuthStatus("ok");
          setLoggedIn(true);
          localStorage.setItem("jwt", data.token);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setInfoTooltipOpen(true);
      });
  };

  const onLogin = ({ password, email }) => {
    return authOption
      .authorize(password, email)
      .then((data) => {
        if (!data) {
          setInfoTooltipOpen(true);
          setAuthStatus("error");
          throw new Error("Неправильное имя пользователя или пароль");
        }
        if (data.token) {
          localStorage.setItem("jwt", data.token);
          setEmail(email)
          setLoggedIn(true);
        }
      })
      .catch((err) => {
        setInfoTooltipOpen(true);
        setAuthStatus("error");
        console.log(err);
      });
  };

  // Работа с текущим пользователем

  function handleUpdateUser({ name, about }) {
    const token = localStorage.getItem("jwt");
    apiOption
      .editUserInfo({ name, about, token })
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
    const token = localStorage.getItem("jwt");
    apiOption
      .editAvatarInfo({ avatar, token })
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

  // Работа с карточками

  function handleCardLike(card) {
    const token = localStorage.getItem("jwt");
    const isLiked = card.likes.some((i) => i === currentUser.id);
    apiOption
      .changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function deleteCard(card) {
    const token = localStorage.getItem("jwt");
    apiOption
      .deleteCard(card._id, token)
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
    const token = localStorage.getItem("jwt");
    apiOption
      .sendCardInfo({ name, link, token })
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

  function handleCardDelete(card) {
    setSelectedDeleteCard(card);
    setIsConfirmPopupOpen(true);
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
    setImagePopupOpen(true);
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
    setImagePopupOpen(false);
    setSelectedCard({});
    setSelectedDeleteCard({});
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
        <Header email={email} onSignOut={onSignOut} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            isCheckToken={isCheckToken}
          >
            <Main
              cards={cards}
              onEditProfile={handleEditProfileClick}
              onEditAvatar={handleEditAvatarClick}
              onAddPlace={handleAddPlaceClick}
              onCardClick={handleCardClick}
              onCardLike={handleCardLike}
              onCardDelete={handleCardDelete}
              component={Main}
            />
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
              onConfirm={deleteCard}
              selectedDeleteCard={selectedDeleteCard}
            />
            <ImagePopup
              card={selectedCard}
              isOpen={isImagePopupOpen}
              onClose={closeAllPopups}
            />
            <Footer />
          </ProtectedRoute>
          <Route path="/signup">
            <Register onRegister={onRegister} />
          </Route>
          <Route path="/signin">
            <Login onLogin={onLogin} />
          </Route>
          <Route>
            {loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}
          </Route>
        </Switch>
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeInfoTooltip}
          status={authStatus}
        />{" "}
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
