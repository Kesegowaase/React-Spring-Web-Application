import React from "react";
import UserSignupPage from "../pages/UserSignupPage";
import UserLoginPage from "../pages/UserLoginPage";
import LanguageSelector from "../components/LanguageSelector";
import HomePage from "../pages/HomePage";
import { HashRouter, Route, Redirect, Switch } from "react-router-dom";
import UserPage from "../pages/UserPage";
import TopBar from "../components/TopBar";
import { useSelector } from 'react-redux';

const App = () => {

  const { isLoggedIn } = useSelector((store) => {
    return {
      isLoggedIn: store.isLoggedIn
    }
  });

  return (

    <div>
      <HashRouter>
        <TopBar />
        <Switch>
          <Route exact path="/" component={HomePage} />
          {!isLoggedIn && <Route path="/login" component={UserLoginPage} />}
          <Route path="/signup" component={UserSignupPage} />
          <Route path="/user/:userID" component={UserPage} />
          <Redirect to="/" />
        </Switch>
      </HashRouter >
      <LanguageSelector />
    </div>

  );

}


export default App;
