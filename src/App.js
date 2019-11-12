import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar";
import Art from "./components/art";
import "./App.css";

//Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <NavBar />
        <main className="container">
          <Switch>
            <Route path="/" component={home} />
            <Route exact path="/login" component={login} />
            <Route exact path="/signup" component={signup} />
          </Switch>
        </main>
      </React.Fragment>
    );
  }
}

export default App;
