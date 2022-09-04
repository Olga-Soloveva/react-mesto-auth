import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import Mesto from "./Mesto";

import ProtectedRoute from "./ProtectedRoute";

import * as Auth from "../utils/Auth.js";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);
  const [authStatus, setAuthStatus] = useState("");
  const history = useHistory();

  useEffect(() => {
    let jwt = localStorage.getItem("jwt");
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
    setUserData('')
    setLoggedIn(false);
  }

  const onRegister = ({ password, email }) => {
    return Auth.register(password, email).then((res) => {
      if (!res.data) {
        setInfoTooltipOpen(true);
        setAuthStatus("error");
        throw new Error("Что-то пошло не так!");
      }
      if (res.data) {
        setLoggedIn(true);
        setInfoTooltipOpen(true);
        setAuthStatus("ok");
        localStorage.setItem("jwt", res.data);
      }
    });
  };

  const onLogin = ({ password, email }) => {
    return Auth.authorize(password, email).then((data) => {
      if (!data) {
        setInfoTooltipOpen(true);
        setAuthStatus("error");
        throw new Error("Неправильное имя пользователя или пароль");
      }
      if (data.token) {
        setLoggedIn(true);
        localStorage.setItem("jwt", data.token);
      }
    });
  };

  const auth = async (jwt) => {
    Auth.getContent(jwt).then((res) => {
      if (res) {
        setLoggedIn(true);
        setUserData({
           email: res.data.email,
        });
      }
    });
  };

  return (
    <div className="page">
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          loggedIn={loggedIn}
          component={Mesto}
          userData={userData}
          handleLoggedIn={handleLoggedIn}
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
