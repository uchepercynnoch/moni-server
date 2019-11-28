import React, {Component, Fragment} from 'react';
import Dashboard from "../pages/Dashboard";
import Stores from "../pages/Stores";
import Loyalty from "../pages/Loyalty";
import Customers from "../pages/Customers";
import Reports from "../pages/Reports";
import {getUserData} from "../util";
import Products from "../pages/Products";
import Transaction from "../pages/Transaction";
import Offers from "../pages/Offers";
import Events from "../pages/Events";
import Vendors from "../pages/Vendors";
import Cashiers from "../views/cashiers";
import User from "./User";
import SuperAdministrator from "./SuperAdministrator";
import Administrator from "./Administrator";

const items = [
    {id: 1, name: 'super_admin_dashboard', label: 'Home', icon: 'fa-th-large'},
    {id: 2, name: 'admin_dashboard', label: 'Home', icon: 'fa-th-large'},
    {id: 3, name: 'super_admin_customers', label: 'Customers', icon: 'fa-group'},
    {id: 4, name: 'admin_customers', label: 'Customers', icon: 'fa-group'},
    {id: 5, name: 'super_admin_reports', label: 'Reports', icon: 'fa-clipboard'},
    {id: 6, name: 'admin_reports', label: 'Reports', icon: 'fa-clipboard'},
    {id: 7, name: 'super_admin_products', label: 'Products', icon: 'fa-clipboard'},
    {id: 8, name: 'admin_products', label: 'Products', icon: 'ion-pricetags'},
    {id: 9, name: 'super_admin_transaction', label: 'Transaction', icon: 'fa-briefcase'},
    {id: 10, name: 'admin_transaction', label: 'Transaction', icon: 'fa-briefcase'},
    {id: 11, name: 'stores', label: 'Stores', icon: 'fa-archive'},
    {id: 12, name: 'loyalty', label: 'Loyalty', icon: 'fa-trophy'},
    {id: 13, name: 'super_admin_offers', label: 'Offers', icon: 'fa-clipboard'},
    {id: 14, name: 'super_admin_events', label: 'Events', icon: 'fa-calender'},
    {id: 15, name: 'super_admin_vendors', label: 'Vendors', icon: 'fa-building'},
    {id: 16, name: 'admin_cashier', label: 'Cashier', icon: 'fa-money'},

];


class SideBar extends Component {
    state = {
        value: 1
    };
    handleRedirect = () => {
        const {value} = this.state;
        switch (value) {
            case 1:
            case 2:
                return <Dashboard id={value}/>;
            case 3:
            case 4:
                return <Customers id={value}/>;
            case 5:
            case 6:
                return <Reports id={value}/>;
            case 7:
            case 8:
                return <Products id={value}/>;
            case 9:
            case 10:
                return <Transaction id={value}/>;
            case 11:
                return <Stores id={value}/>;
            case 12:
                return <Loyalty id={value}/>;
            case 13:
                return <Offers id={value}/>;
            case 14:
                return <Events id={value}/>;
            case 15:
                return <Vendors id={value}/>;
            case 16:
                return <Cashiers id={value}/>;

            default:
                return null;

        }
    };

    changePage = (key) => {
        this.setState({value: key});
    };

    render() {
        const {value} = this.state;
        if (getUserData().role === 'admin') {
            return (
                <Fragment>
                    <div className="br-logo"><a href="/"><span>[</span>LOGO<span>]</span></a></div>
                    <div className="br-sideleft overflow-y-auto">
                        <div className=" mg-t-40"></div>
                        <div className="br-sideleft-menu">
                            <Administrator changePage={this.changePage} value={value} data={items}/>
                        </div>
                        <br/>
                    </div>
                    {this.handleRedirect()}
                </Fragment>
            );
        } else if (getUserData().role === 'super-admin') {
            return (
                <Fragment>
                    <div className="br-logo"><a href="/"><span>[</span>LOGO<span>]</span></a></div>
                    <div className="br-sideleft overflow-y-auto">
                        <div className=" mg-t-40"></div>
                        <div className="br-sideleft-menu">
                            <SuperAdministrator changePage={this.changePage} value={value} data={items}/>
                        </div>
                        <br/>
                    </div>
                    {this.handleRedirect()}
                </Fragment>
            );
        } else return (
            <Fragment>
                <div className="br-logo"><a href="/"><span>[</span>LOGO<span>]</span></a></div>
                <div className="br-sideleft overflow-y-auto">
                    <div className=" mg-t-40"></div>
                    <div className="br-sideleft-menu">
                        <User changePage={this.changePage} value={value} data={items}/>
                    </div>
                    <br/>
                </div>
                {this.handleRedirect()}
            </Fragment>
        );
    }
}

export default SideBar;