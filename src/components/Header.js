import logo from "../images/logo.svg";

import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

function Header() {
  const [windowWidth, setWindowWidth] = useState([window.innerWidth]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleMenuBtn = () => {
    setIsMenuVisible(true);
  };

  const handleCloseBtn = () => {
    setIsMenuVisible(false);
  };

  window.addEventListener("resize", () => {
    setWindowWidth(window.innerWidth);
  });

  const history = useHistory();

  const signOut = () => {
    // localStorage.removeItem('jwt');
    history.push("/sign-in");
  };
  return (
    <>
      {isMenuVisible && windowWidth <= 650 && (
        <div className="header__menu-container">
          <p className="header__user-email">e-mail user</p>
          <Link
            to="/sign-in"
            className="header__button header__button_type_txt-close"
            onClick={signOut}
          >
            Выйти
          </Link>
        </div>
      )}
      <header className="header">
        <img className="header__logo" src={logo} alt="Логотип Mesto" />
        {windowWidth <= 650 && !isMenuVisible && (
          <button
            type="button"
            className="header__menu-btn"
            aria-label="Открыть меню"
            onClick={handleMenuBtn}
          />
        )}
        {windowWidth <= 650 && isMenuVisible && (
          <button
            type="button"
            className="header__close-btn"
            aria-label="Закрыть меню"
            onClick={handleCloseBtn}
          />
        )}

        {windowWidth > 650 && (
          <div className="header__container">
            <p className="header__user-email">e-mail user</p>
            <Link
              to="/sign-in"
              className="header__button header__button_type_txt-close"
              onClick={signOut}
            >
              Выйти
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
