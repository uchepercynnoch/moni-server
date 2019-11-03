import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    Fade,
    Snackbar
} from "@material-ui/core";
import "../styles/cashRegistration.css";
import clsx from "clsx";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import CloseIcon from "@material-ui/icons/Close";
import { amber, green } from "@material-ui/core/colors";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import WarningIcon from "@material-ui/icons/Warning";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {isSuperAdmin} from "../util";

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon
};

const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: green[600]
    },
    error: {
        backgroundColor: theme.palette.error.dark
    },
    info: {
        backgroundColor: theme.palette.primary.main
    },
    warning: {
        backgroundColor: amber[700]
    },
    icon: {
        fontSize: 20
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1)
    },
    message: {
        display: "flex",
        alignItems: "center"
    }
}));

function SnackbarWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];
    console.log("edit", props.edit);
    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>
            ]}
            {...other}
        />
    );
}

const useStyles2 = makeStyles(theme => ({
    margin: {
        margin: theme.spacing(1)
    }
}));

export default function CashierModal(props) {
    const classes = useStyles2();

    return (
        <div>
            <Dialog open={props.open} onClose={() => props.Close()} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">{"Cashier Account"}</DialogTitle>
                <DialogContent>
                    <div className="horizontal-align">
                        <TextField
                            id="firstname"
                            label="Firstname"
                            value={props.cashier.firstname}
                            margin="normal"
                            className="text-input"
                            onChange={event => props.updateCashier(event)}
                            type="text"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(!props.edit)
                            }}
                        />
                        <TextField
                            id="lastname"
                            value={props.cashier.lastname}
                            margin="normal"
                            label="Lastname"
                            className="text-input"
                            onChange={event => props.updateCashier(event)}
                            type="text"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(!props.edit)
                            }}
                        />
                    </div>
                    <div className="horizontal-align">
                        <TextField
                            id="phoneNumber"
                            label="PhoneNumber"
                            value={props.cashier.phoneNumber}
                            margin="normal"
                            helperText="Mobile phone number"
                            className="text-input"
                            onChange={event => props.updateCashier(event)}
                            type="text"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(!props.edit)
                            }}
                        />

                        <TextField
                            className="form-input"
                            id="password"
                            value={props.cashier.password}
                            margin="normal"
                            label="Password"
                            className="text-input"
                            helperText="You can set a new password here!"
                            onChange={event => props.updateCashier(event)}
                            type="password"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(!props.edit)
                            }}
                        />
                    </div>
                    <div className="align-select">
                        <FormControl id="gender" variant="filled" className="form-select">
                            <InputLabel htmlFor="filled-gender-simple">Gender</InputLabel>
                            <Select
                                id="gender"
                                value={props.cashier.gender}
                                onChange={event => {
                                    event.target.id = "gender";
                                    props.updateCashier(event);
                                }}
                                inputProps={{
                                    name: "gender",
                                    id: "gender",
                                    readOnly: Boolean(!props.edit)
                                }}
                            >
                                <MenuItem value="male">male</MenuItem>
                                <MenuItem value="female">female</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            className="form-input"
                            id="iam"
                            value={props.cashier.iam}
                            margin="normal"
                            label="IAM"
                            className="text-input"
                            onChange={event => props.updateCashier(event)}
                            type="text"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(!props.edit)
                            }}
                        />
                    </div>
                    {/* <div className="horizontal-align">
                        <Paper style={{ width: "100%", backgroundColor: "lightGrey", margin: "10px" }}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">Total Customers Requests</TableCell>
                                        <TableCell align="center">Total Gems Gained💎</TableCell>
                                        <TableCell align="center">Total Gems Redeemed💎</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell align="center" component="th" scope="row">
                                            {props.cashier.customersAttendedTo}
                                        </TableCell>
                                        <TableCell align="center">
                                            {props.cashier.totalGemsGainedForCustomers}
                                        </TableCell>
                                        <TableCell align="center">
                                            {props.cashier.totalGemsRedeemedForCustomers}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Paper>
                    </div> */}
                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left"
                        }}
                        open={props.saved}
                        onClose={() => props.closeSnack("success")}
                        autoHideDuration={6000}
                    >
                        <SnackbarWrapper variant="success" message="Saved successfully!" />
                    </Snackbar>
                    <Snackbar
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left"
                        }}
                        open={props.error}
                        onClose={() => props.closeSnack("error")}
                        autoHideDuration={6000}
                    >
                        <SnackbarWrapper
                            variant="error"
                            className={classes.margin}
                            message="An error ocurred! Pls try again"
                        />
                    </Snackbar>
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={props.saving}
                        onClick={() => {
                            props.Close();
                        }}
                    >
                        Close
                    </Button>
                    {props.edit ? (
                        <Button
                            disabled={props.saving}
                            onClick={() => props.Update()}
                            color="primary"
                            autoFocus
                            variant="contained"
                        >
                            {
                                isSuperAdmin() ? null : <>{props.saving ? (
                                    <Fade
                                        in={props.saving}
                                        style={{
                                            transitionDelay: props.saving ? "100ms" : "0ms"
                                        }}
                                        unmountOnExit
                                    >
                                        <CircularProgress size={24} />
                                    </Fade>
                                ) : (
                                    "Update"
                                )}</>
                            }
                        </Button>
                    ) : null}
                </DialogActions>
            </Dialog>
        </div>
    );
}
