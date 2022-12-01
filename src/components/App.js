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

    if (document.cookie.split(';').filter(function(item) {
      return item.trim().indexOf('jwt=') === 0
    }).length) {
      auth();
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
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
    setUserData("");
    setLoggedIn(false);
  }

  const onRegister = ({ password, email }) => {
    const passwordIn = password;
    return authOption
      .register(password, email)
      .then((res) => {
        console.log(res)
        if (!res._id) {
          console.log(1)
          setAuthStatus("error");
          throw new Error("Что-то пошло не так!");
        }
        if (res._id) {
          console.log(2)
          console.log(passwordIn)
          setAuthStatus("ok");
          setLoggedIn(true);
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
        if (data) {
          setLoggedIn(true);
        }
      })
      .catch((err) => {
        setInfoTooltipOpen(true);
        setAuthStatus("error");
      });
  };

  const auth = async () => {
    authOption
      .checkToken()
      .then((res) => {
        if (res) {
          setLoggedIn(true);
          setUserData({
            email: res.email,
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
      />
    </div>
  );
}

export default App;
