import React, {Component} from "react";
import {Router, Switch, Route} from "react-router-dom";
import {history} from "./history.helper";
import "./App.css";
import Login from "./views/login";
import AuthRoute from "./components/authroute";
// import Dashboard from "./views/dashboard";
import {ThemeProvider} from "@material-ui/styles";
import {createMuiTheme, responsiveFontSizes} from "@material-ui/core/styles";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import Dinero from "dinero.js";
import Layout from "./pages/Layout";
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

class App extends Component {

    render() {


        return (
            <ThemeProvider theme={theme}>
                <Router history={history}>
                    <Switch>
                        <Route path="/" exact component={Login}/>
                        <AuthRoute path="/admin" component={Layout}/>
                    </Switch>
                </Router>
            </ThemeProvider>
        )

    }
}

export default App;