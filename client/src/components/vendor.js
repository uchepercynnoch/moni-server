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

export default function Vendor(props) {
    const classes = useStyles2();

    return (
        <div>
            <Dialog open={props.open} onClose={() => props.Close()} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">{"Vendor Account"}</DialogTitle>
                <DialogContent>
                    <TextField
                        className="form-input"
                        id="vendorName"
                        label="Vendor"
                        value={props.vendor.vendorName}
                        margin="normal"
                        className="text-input"
                        onChange={event => props.updateVendor(event)}
                        type="text"
                        variant="filled"
                        inputProps={{
                            readOnly: Boolean(!props.edit)
                        }}
                    />
                    <TextField
                        className="form-input"
                        id="location"
                        value={props.vendor.location}
                        margin="normal"
                        label="Location"
                        className="text-input"
                        onChange={event => props.updateVendor(event)}
                        type="text"
                        variant="filled"
                        inputProps={{
                            readOnly: Boolean(!props.edit)
                        }}
                    />
                    <div className="horizontal-align">
                        <TextField
                            className="form-input"
                            id="iamAlias"
                            label="Iam-Alias"
                            value={props.vendor.iamAlias}
                            margin="normal"
                            className="text-input"
                            onChange={event => props.updateVendor(event)}
                            type="text"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(!props.edit)
                            }}
                        />

                        <TextField
                            className="form-input"
                            id="loyaltyPercentage"
                            value={props.vendor.loyaltyPercentage}
                            margin="normal"
                            label="Loyalty Percentage"
                            className="text-input"
                            onChange={event => props.updateVendor(event)}
                            type="number"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(!props.edit)
                            }}
                        />
                    </div>
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
                            {props.saving ? (
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
                            )}
                        </Button>
                    ) : null}
                </DialogActions>
            </Dialog>
        </div>
    );
}
