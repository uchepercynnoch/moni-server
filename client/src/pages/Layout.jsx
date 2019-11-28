import React, {Component} from 'react';
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import Footer from "../components/Footer";

class Layout extends Component {
    render() {
        return (
            <div>
                <SideBar/>
                <Header/>
                <Footer/>
            </div>
        );
    }
}

export default Layout;