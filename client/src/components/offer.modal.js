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
    Snackbar,
    Chip,
    Checkbox,
    FormControlLabel
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

export default function OfferModal(props) {
    const classes = useStyles2();

    return (
        <div>
            <Dialog
                // fullScreen={fullScreen}
                open={props.open}
                onClose={() => props.Close()}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">{"Offer"}</DialogTitle>
                <DialogContent>
                    <div className="horizontal-align">
                        <TextField
                            className="form-input"
                            id="title"
                            label="Title"
                            value={props.offer.title}
                            margin="normal"
                            className="text-input"
                            onChange={event => props.updateOffer(event)}
                            type="text"
                            variant="filled"
                        />
                        <TextField
                            className="form-input"
                            id="percentage"
                            value={props.offer.percentage}
                            margin="normal"
                            label="Percentage"
                            className="text-input"
                            onChange={event => props.updateOffer(event)}
                            type="text"
                            variant="filled"
                        />
                    </div>
                    <div className="horizontal-align">
                        <FormControl id="membershipType" variant="filled" className="form-select">
                            <InputLabel htmlFor="membershipType">MembershipType</InputLabel>
                            <Select
                                value={props.offer.membershipType}
                                onChange={event => {
                                    event.target.id = "membershipType";
                                    props.updateOffer(event);
                                }}
                                inputProps={{
                                    name: "membershipType",
                                    id: "membershipType"
                                }}
                            >
                                <MenuItem value="all">all</MenuItem>
                                <MenuItem value="blue">blue</MenuItem>
                                <MenuItem value="gold">gold</MenuItem>
                                <MenuItem value="platinum">platinum</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl id="ageRange" variant="filled" className="form-select">
                            <InputLabel htmlFor="ageRange">Age-Range</InputLabel>
                            <Select
                                value={props.offer.ageRange}
                                onChange={event => {
                                    event.target.id = "ageRange";
                                    props.updateOffer(event);
                                }}
                                inputProps={{
                                    name: "ageRange",
                                    id: "ageRange"
                                }}
                            >
                                <MenuItem value="all">all</MenuItem>
                                <MenuItem value="15-20">15 - 20</MenuItem>
                                <MenuItem value="20-25">20 - 25</MenuItem>
                                <MenuItem value="25-30">25 - 30</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div style={{ margin: "10px" }}>
                        <p>*select preferences to target offer to.</p>
                        {props.offer.preferences.map((item, key) => (
                            <Chip
                                style={{ marginTop: "3px", marginBottom: "3px" }}
                                key={key}
                                label={item}
                                color="primary"
                            />
                        ))}
                        <hr />
                        <br />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={event => props.updatePreference("Movies", event)}
                                    checked={props.offer.preferences.includes("Movies")}
                                />
                            }
                            label="Movies"
                        ></FormControlLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={event => props.updatePreference("Restaurant", event)}
                                    checked={props.offer.preferences.includes("Restaurant")}
                                />
                            }
                            label="Restaurant"
                        ></FormControlLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={event => props.updatePreference("NightLife", event)}
                                    checked={props.offer.preferences.includes("NightLife")}
                                />
                            }
                            label="NightLife"
                        ></FormControlLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={event => props.updatePreference("Shopping", event)}
                                    checked={props.offer.preferences.includes("Shopping")}
                                />
                            }
                            label="Shopping"
                        ></FormControlLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={event => props.updatePreference("Leisure", event)}
                                    checked={props.offer.preferences.includes("Leisure")}
                                />
                            }
                            label="Leisure"
                        ></FormControlLabel>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={event => props.updatePreference("Hotel", event)}
                                    checked={props.offer.preferences.includes("Hotel")}
                                />
                            }
                            label="Hotel"
                        ></FormControlLabel>
                    </div>

                    <div style={{ margin: "10px" }}>
                        <label htmlFor="selectedFile">select an image to represent the offer</label>
                        <br />
                        <input
                            accept="image/*"
                            id="selectedFile"
                            type="file"
                            onChange={event => props.updateOffer(event)}
                        />
                    </div>
                    <div style={{ margin: "10px" }}>
                        <img
                            alt="No Image!"
                            src={props.offer.imageId}
                            width="50"
                            height="50"
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
                </DialogActions>
            </Dialog>
        </div>
    );
}
