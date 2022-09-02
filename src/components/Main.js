import React, {useContext}  from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

import Card from "./Card";

function Main({onEditProfile,
  onEditAvatar,
  onAddPlace,
  onCardClick,
  cards,
  onCardLike,
  onCardDelete}) {
  const currentUser = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__item">
          <div className="profile__avatar-container">
            <img
              className="profile__avatar"
              src={currentUser.avatar}
              alt="Аватар"
            />
            <div className="profile__avatar-cover">
              <button
                type="button"
                className="edit-avatar"
                aria-label="Редактировать аватар"
                onClick={onEditAvatar}
              />
            </div>
          </div>
          <div className="profile__profile-info">
            <div className="profile__person">
              <h1 className="profile__person-name">{currentUser.name}</h1>
              <button
                type="button"
                className="edit-button"
                aria-label="Редактировать профиль"
                onClick={onEditProfile}
              />
            </div>
            <p className="profile__description">{currentUser.about}</p>
          </div>
        </div>
        <button
          type="button"
          className="add-button"
          aria-label="Добавить фотокарточку"
          onClick={onAddPlace}
        />
      </section>
      <section className="elements" aria-label="Секция с фотокарточками">
        {cards.map((card) => (
          <Card
            key={card._id}
            card={card}
            onCardClick={onCardClick}
            onCardLike={onCardLike}
            onCardDelete={onCardDelete}
          />
        ))}
      </section>
    </main>
  );
}

export default Main;
