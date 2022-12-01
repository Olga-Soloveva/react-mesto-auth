import logo from "../images/logo.svg";

import React, { useState, useEffect } from "react";
import { Route, Link, useHistory } from "react-router-dom";

function Header({ userData, handleLoggedIn }) {
  const [windowWidth, setWindowWidth] = useState([window.innerWidth]);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleMenuBtn = () => {
    setIsMenuVisible(true);
  };

  const handleCloseBtn = () => {
    setIsMenuVisible(false);
  };

  useEffect(() => {
    function resize() {
      setWindowWidth(window.innerWidth);
    }
    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const history = useHistory();

  const signOut = () => {
    handleLoggedIn();
    history.push("/signin");
  };
  return (
    <>
      {windowWidth <= 650 && isMenuVisible && (
        <div className="header__menu-container">
          <p className="header__user-email">{userData.email}</p>
          <Link to="/signin" className="header__logout" onClick={signOut}>
            Выйти
          </Link>
        </div>
      )}
      <header className="header">
        <img className="header__logo" src={logo} alt="Логотип Mesto" />

        <Route exact path="/">
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
              <p className="header__user-email">{userData.email}</p>
              <Link to="/signin" className="header__logout" onClick={signOut}>
                Выйти
              </Link>
            </div>
          )}
        </Route>
        <Route path="/signup">
          <div className="header__container">
            <Link to="/signin" className="header__auth-link">
              Войти
            </Link>
          </div>
        </Route>
        <Route path="/signin">
          <div className="header__container">
            <Link to="/signup" className="header__auth-link">
              Регистрация
            </Link>
          </div>
        </Route>
      </header>
    </>
  );
}

export default Header;
