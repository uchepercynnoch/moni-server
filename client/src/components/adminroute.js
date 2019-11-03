import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { isLoggedIn, getUserData } from "../util";

class AdminRoute extends Component {
    render() {
        if (!isLoggedIn()) {
            return <Redirect to="/" />;
        }

        if (getUserData().type !== "admin" || getUserData().type !== "super-admin") {
            return <Redirect to="/admin" />;
        }

        return <Route {...this.props} />;
    }
}

export default AdminRoute;
