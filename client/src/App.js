import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Login from "./views/login";
import AuthRoute from "./components/authroute";
import Dashboard from "./views/dashboard";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import Dinero from "dinero.js";

function App() {
    //Initializations
    //Dinero.globalLocale = "en-NG";
    Dinero.globalFormat = "$0,0.00";
    
    let theme = createMuiTheme({
        palette: {
            primary: {
                main: "#070E2E"
            },
            secondary: {
                main: "#FFC065"
            }
        },
        status: {
            danger: "orange"
        }
    });
    theme = responsiveFontSizes(theme);

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Switch>
                    <Route path="/" exact component={Login} />
                    <AuthRoute path="/admin" component={Dashboard} />
                </Switch>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
