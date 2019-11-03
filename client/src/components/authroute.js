import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isLoggedIn } from "../util";

class AuthRoute extends Component {
    render() {
        if (!isLoggedIn()) {
            return <Redirect to="/" />;
        }

        return <Route {...this.props} />;
    }
}

export default AuthRoute;
