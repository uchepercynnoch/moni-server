import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { useStyles } from "../styles/dashboard.style";
import Copyright from "../components/copyright";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PeopleIcon from "@material-ui/icons/People";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LayersIcon from "@material-ui/icons/Layers";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import {
    LocalOffer,
    AccountBalance,
    InfoSharp,
    PersonPinCircle,
    VerifiedUser
} from "@material-ui/icons";
import BusinessIcon from "@material-ui/icons/Business";
import Overview from "./overview";
import Customers from "./customers";
import Cashiers from "./cashiers";
import { Hidden, useTheme, Button, Tooltip, Chip } from "@material-ui/core";
import { invalidateToken, getUserData } from "../util";
import Transaction from "./transactions";
import Offers from "./offers";
import News from "./news";
import Vendors from "./vendors";
import Admins from "./admins";

export default function Dashboard(props) {
    const classes = useStyles();
    const theme = useTheme();
    const { container } = props;
    const [open, setOpen] = React.useState(true);
    const [value, setValue] = React.useState(1);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const changeContent = to => {
        setValue(to);
        console.log(value);
    };

    const renderContent = () => {
        switch (value) {
            case 1:
                return <Overview />;
            // case 2:
            //     return <Products />;
            case 3:
                return <Customers />;
            case 4:
                return <Cashiers />;
            case 5:
                return <Transaction />;
            case 6:
                return <Offers />;
            case 7:
                return <News />;
            case 8:
                 return <Vendors/>;
            case 9:
                return <Admins/>;
            default:
                return <Overview />;
        }
    };

    const handleLogout = () => {
        invalidateToken();
        props.history.push("/");
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const secondaryListItems = () => {
        return (
            <div>
                <ListItem
                    style={value === 8 ? { backgroundColor: "#505569" } : {}}
                    button
                    onClick={() => changeContent(8)}
                >
                    <ListItemIcon className={classes.listStyle}>
                        <LayersIcon />
                    </ListItemIcon>
                    <ListItemText primary="Configurations" />
                </ListItem>
            </div>
        );
    };
    const listItems = () => {
        return (
            <div>
                <ListItem
                    style={value === 1 ? { backgroundColor: "#505569" } : {}}
                    button
                    onClick={() => changeContent(1)}
                >
                    <ListItemIcon className={classes.listStyle}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                {/* <ListItem
                    style={value === 2 ? { backgroundColor: "#505569" } : {}}
                    button
                    onClick={() => changeContent(2)}
                >
                    <ListItemIcon className={classes.listStyle}>
                        <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Products" />
                </ListItem> */}
                <ListItem
                    style={value === 3 ? { backgroundColor: "#505569" } : {}}
                    button
                    onClick={() => changeContent(3)}
                >
                    <ListItemIcon className={classes.listStyle}>
                        <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Customers" />
                </ListItem>
                {getUserData().role === "admin" ? (

                <ListItem
                    style={value === 4 ? { backgroundColor: "#505569" } : {}}
                    button
                    onClick={() => changeContent(4)}
                >
                    <ListItemIcon className={classes.listStyle}>
                        <PersonPinCircle />
                    </ListItemIcon>
                    <ListItemText primary="Cashiers" />
                </ListItem>) : null}
                <ListItem
                    style={value === 5 ? { backgroundColor: "#505569" } : {}}
                    button
                    onClick={() => changeContent(5)}
                >
                    <ListItemIcon className={classes.listStyle}>
                        <AccountBalance />
                    </ListItemIcon>
                    <ListItemText primary="Transactions" />
                </ListItem>
                {getUserData().role === "super-admin" ? (
                    <div>
                        <ListItem
                            style={value === 6 ? { backgroundColor: "#505569" } : {}}
                            button
                            onClick={() => changeContent(6)}
                        >
                            <ListItemIcon className={classes.listStyle}>
                                <LocalOffer />
                            </ListItemIcon>
                            <ListItemText primary="Offers" />
                        </ListItem>
                        <ListItem
                            style={value === 7 ? { backgroundColor: "#505569" } : {}}
                            button
                            onClick={() => changeContent(7)}
                        >
                            <ListItemIcon className={classes.listStyle}>
                                <InfoSharp />
                            </ListItemIcon>
                            <ListItemText primary="News" />
                        </ListItem>
                        <ListItem
                            style={value === 8 ? { backgroundColor: "#505569" } : {}}
                            button
                            onClick={() => changeContent(8)}
                        >
                            <ListItemIcon className={classes.listStyle}>
                                <BusinessIcon />
                            </ListItemIcon>
                            <ListItemText primary="Vendor" />
                        </ListItem>
                    </div>
                ) : null}
                        <ListItem
                            style={value === 9 ? { backgroundColor: "#505569" } : {}}
                            button
                            onClick={() => changeContent(9)}
                        >
                            <ListItemIcon className={classes.listStyle}>
                                <VerifiedUserIcon />
                            </ListItemIcon>
                            <ListItemText primary="Admin" />
                        </ListItem>
            </div>
        );
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <img
                        style={{ padding: "5px" }}
                        width="130"
                        height="33"
                        src={require("../assets/lm3.png")}
                    ></img>
                    <div className={classes.title}></div>
                    {/* <IconButton color="inherit">
                        <Badge badgeContent={1} color="secondary">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton> */}
                    <div className={classes.alignBtn}>
                        <Tooltip title={getUserData().role} aria-label="security">
                            <Chip
                                icon={<VerifiedUser style={{ color: "white" }} />}
                                label={getUserData().email}
                                size="small"
                                style={{ color: "white", backgroundColor: "green" }}
                            />
                        </Tooltip>
                        <Button
                            style={{ marginLeft: "10px" }}
                            onClick={handleLogout}
                            variant="outlined"
                            color="secondary"
                        >
                            logout
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>

            <nav className={classes.drawer}>
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === "rtl" ? "right" : "left"}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper
                        }}
                        ModalProps={{
                            keepMounted: true // Better open performance on mobile.
                        }}
                    >
                        <div className={classes.toolbarIcon}>
                            <IconButton className={classes.listStyle} onClick={handleDrawerToggle}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </div>
                        <Divider />
                        <List>{listItems()}</List>
                        <Divider />
                        <List>{secondaryListItems()}</List>
                    </Drawer>
                </Hidden>
                <Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper
                            }}
                            variant="permanent"
                            open
                        >
                            <div className={classes.toolbarIcon}>
                                <IconButton onClick={handleDrawerClose}>
                                    <ChevronLeftIcon />
                                </IconButton>
                            </div>
                            <Divider />
                            <List>{listItems()}</List>
                            <Divider />
                            {/* <List>{secondaryListItems()}</List> */}
                        </Drawer>
                    </Hidden>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                {renderContent()}
                <Copyright />
            </main>
        </div>
    );
}
