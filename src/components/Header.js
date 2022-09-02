import logo from "../images/logo.svg";

import { Link, useHistory } from "react-router-dom";

import React from "react";

function Header() {
  const history = useHistory();
  function signOut() {
    // localStorage.removeItem('jwt');
    history.push("/sign-in");
  }
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Логотип Mesto" />
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
    </header>
  );
}

export default Header;
