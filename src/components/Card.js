import React, { useContext } from "react";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const [currentUser] = useContext(CurrentUserContext);

  const isOwn = card.owner === currentUser._id;

  const cardDeleteButtonClassName = `delete-button ${
    isOwn && "delete-button_visible"
  }`;

  const isLiked = card.likes.some((i) => i === currentUser._id);

  const cardLikeButtonClassName = `like-button ${
    isLiked && "like-button_active"
  }`;

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <article className="element" aria-label="Фотокарточка">
      <div className="element__photo-container">
        <button
          type="button"
          className={cardDeleteButtonClassName}
          aria-label="Удалить фотокарточку"
          onClick={handleDeleteClick}
        />
        <img
          className="element__photo"
          alt={card.name}
          src={card.link}
          onClick={handleClick}
        />
      </div>
      <div className="element__description">
        <h2 className="element__place-name">{card.name}</h2>
        <div className="element__like">
          <button
            type="button"
            className={cardLikeButtonClassName}
            aria-label="Поставить отметку нравится"
            onClick={handleLikeClick}
          />
          <p className="element__like-counter">{card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;
