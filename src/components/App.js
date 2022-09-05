import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Header from "./Header";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import Mesto from "./Mesto";

import ProtectedRoute from "./ProtectedRoute";

import authOption from "../utils/Auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState("");
  const history = useHistory();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth(jwt);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      history.push("/");
    }
  }, [history, loggedIn]);

  function closeInfoTooltip() {
    setInfoTooltipOpen(false);
  }

  function handleLoggedIn() {
    setUserData("");
    setLoggedIn(false);
  }

  const onRegister = ({ password, email }) => {
    return authOption
      .register(password, email)
      .then((res) => {
        if (!res.data) {
          setAuthStatus("error");
          throw new Error("Что-то пошло не так!");
        }
        if (res.data) {
          setAuthStatus("ok");
          onLogin({ password, email });
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
          setLoggedIn(true);
          localStorage.setItem("jwt", data.token);
        }
      })
      .catch((err) => {
        setInfoTooltipOpen(true);
        setAuthStatus("error");
        console.log(err);
      });
  };

  const auth = async (jwt) => {
    authOption
      .checkToken(jwt)
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setUserData({
            email: res.data.email,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="page">
      <Header userData={userData} handleLoggedIn={handleLoggedIn} />
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          loggedIn={loggedIn}
          component={Mesto}
     
        ></ProtectedRoute>
        <Route path="/sign-up">
          <Register onRegister={onRegister} />
        </Route>
        <Route path="/sign-in">
          <Login onLogin={onLogin} />
        </Route>
        <Route>
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
        </Route>
      </Switch>
      <InfoTooltip
        isOpen={isInfoTooltipOpen}
        onClose={closeInfoTooltip}
        status={authStatus}
      />
    </div>
  );
}

export default App;
