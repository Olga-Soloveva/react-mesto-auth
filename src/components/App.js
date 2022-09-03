import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";


import Mesto from "./Mesto";

import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const [isInfoTooltipOpen, setInfoTooltipOpen] = useState(false);

  function closeInfoTooltip() {
    setInfoTooltipOpen(false)
  }

  return (
    <div className="page">
      <Switch>
        <ProtectedRoute
          exact
          path="/"
          loggedIn={loggedIn}
          component={Mesto}
        ></ProtectedRoute>
        <Route path="/sign-up">
          <Register />
        </Route>
        <Route path="/sign-in">
          <Login />
        </Route>
        <Route>
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
        </Route>
      </Switch>
      <InfoTooltip isOpen={isInfoTooltipOpen} onClose={closeInfoTooltip} status='ok'/>
    </div>
  );
}

export default App;
