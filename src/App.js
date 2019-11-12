import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import NavBar from "./components/navbar";
import Art from "./components/art";
import "./App.css";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

import { createMuiTheme } from "@material-ui/core/styles";

//Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#448aff"
    },
    secondary: {
      main: "#ff1744"
    }
  }
});

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
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
      </MuiThemeProvider>
    );
  }
}

export default App;
