import React, {Component} from 'react';
import {invalidateToken, getUserData} from "../util";
import {history} from "../history.helper";

class Header extends Component {
    handleLogout = () => {
        invalidateToken();
        history.push("/");
    };

    render() {
        return (
            <div className="br-header">
                <div className="br-header-left">
                    <div className="navicon-left hidden-md-down"><a id="btnLeftMenu" href=""><i
                        className="icon ion-navicon-round"></i></a></div>
                    <div className="navicon-left hidden-lg-up"><a id="btnLeftMenuMobile" href=""><i
                        className="icon ion-navicon-round"></i></a></div>
                    <div className="input-group hidden-xs-down wd-170 transition">
                        <input id="searchbox" type="text" className="form-control" placeholder="Search"/>
                        <span className="input-group-btn">
            <button className="btn btn-secondary" type="button"><i className="fa fa-search"></i></button>
          </span>
                    </div>
                </div>
                <div className="br-header-right">
                    <nav className="nav">
                        <div className="dropdown">
                            <a href="test.html" className="nav-link pd-x-7 pos-relative" data-toggle="dropdown">
                                <i className="icon ion-ios-email-outline tx-24"></i>

                                <span className="square-8 bg-danger pos-absolute t-15 r-0 rounded-circle"></span>

                            </a>
                            <div className="dropdown-menu dropdown-menu-header wd-300 pd-0-force">
                                <div
                                    className="d-flex align-items-center justify-content-between pd-y-10 pd-x-20 bd-b bd-gray-200">
                                    <label
                                        className="tx-12 tx-info tx-uppercase tx-semibold tx-spacing-2 mg-b-0">Messages</label>
                                    <a href="test.html" className="tx-11">+ Add New Message</a>
                                </div>

                                <div className="media-list">

                                    <a href="test.html" className="media-list-link">
                                        <div className="media pd-x-20 pd-y-15">
                                            <div className="media-body">
                                                <div
                                                    className="d-flex align-items-center justify-content-between mg-b-5">
                                                    <p className="mg-b-0 tx-medium tx-gray-800 tx-14">Donna Seay</p>
                                                    <span className="tx-11 tx-gray-500">2 minutes ago</span>
                                                </div>
                                                <p className="tx-12 mg-b-0">A wonderful serenity has taken
                                                    possession of my entire soul, like these sweet mornings of
                                                    spring.</p>
                                            </div>
                                        </div>
                                    </a>
                                    <div className="pd-y-10 tx-center bd-t">
                                        <a href="test.html" className="tx-12"><i
                                            className="fa fa-angle-down mg-r-5"></i> Show
                                            All Messages</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dropdown">
                            <a href="test.html" className="nav-link pd-x-7 pos-relative" data-toggle="dropdown">
                                <i className="icon ion-ios-bell-outline tx-24"></i>

                                <span className="square-8 bg-danger pos-absolute t-15 r-5 rounded-circle"></span>

                            </a>
                            <div className="dropdown-menu dropdown-menu-header wd-300 pd-0-force">
                                <div
                                    className="d-flex align-items-center justify-content-between pd-y-10 pd-x-20 bd-b bd-gray-200">
                                    <label
                                        className="tx-12 tx-info tx-uppercase tx-semibold tx-spacing-2 mg-b-0">Notifications</label>
                                    <a href="test.html" className="tx-11">Mark All as Read</a>
                                </div>

                                <div className="media-list">

                                    <a href="test.html" className="media-list-link read">
                                        <div className="media pd-x-20 pd-y-15">
                                            <div className="media-body">
                                                <p className="tx-13 mg-b-0 tx-gray-700"><strong
                                                    className="tx-medium tx-gray-800">Suzzeth
                                                    Bungaos</strong> tagged you and 18 others in a post.</p>
                                                <span className="tx-12">October 03, 2017 8:45am</span>
                                            </div>
                                        </div>
                                    </a>
                                    <div className="pd-y-10 tx-center bd-t">
                                        <a href="test.html" className="tx-12"><i
                                            className="fa fa-angle-down mg-r-5"></i> Show
                                            All Notifications</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dropdown">
                            <a href="test.html" className="nav-link nav-link-profile" data-toggle="dropdown">
                                <span className="logged-name hidden-md-down tx-md-13 tx-md-bold mr-2">{getUserData().email}</span>
                                {getUserData().role ? <span className="square-10 bg-success"></span> :
                                    <span className="square-10 bg-danger"></span>}

                            </a>
                            <div className="dropdown-menu dropdown-menu-header wd-200">
                                <ul className="list-unstyled user-profile-nav">
                                    <li><a href="test.html"><i className="icon ion-ios-person"></i> Edit Profile</a>
                                    </li>
                                    <li><a href="test.html"><i className="icon ion-ios-gear"></i> Settings</a></li>
                                    <li><a href="" onClick={this.handleLogout}><i className="icon ion-power"></i> Sign
                                        Out</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}

export default Header;