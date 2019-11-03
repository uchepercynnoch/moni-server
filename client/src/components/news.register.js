import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useTheme } from "@material-ui/core/styles";
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

const classes = {
    margin: {
        margin: "10px"
    }
};

export default class NewsRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            content: "",
            newsImage: null
        };
    }

    setProperty(event) {
        const obj = { ...this.state };
        obj[event.target.id] = event.target.id === "newsImage" ? event.target.files[0] : event.target.value;
        this.setState(obj);
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.Close()}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Add News."}</DialogTitle>
                    <DialogContent>
                        <TextField
                            className="form-input"
                            id="title"
                            value={this.state.title}
                            margin="normal"
                            label="title"
                            className="text-input"
                            placeholder="title"
                            onChange={event => this.setProperty(event)}
                            type="text"
                            variant="filled"
                        />
                        <TextField
                            className="form-input"
                            id="content"
                            value={this.state.content}
                            margin="normal"
                            label="content"
                            className="text-input"
                            placeholder="content"
                            onChange={event => this.setProperty(event)}
                            multiline
                            rows="10"
                            variant="filled"
                            helperText="*content of the news"
                        />

                        <div style={{ margin: "10px" }}>
                            <label htmlFor="newsImage">select an image to represent the news</label>
                            <br />
                            <input
                                accept="image/*"
                                id="newsImage"
                                type="file"
                                onChange={event => this.setProperty(event)}
                            />
                        </div>

                        <Snackbar
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left"
                            }}
                            open={this.props.saved}
                            onClose={() => this.props.closeSnack("success")}
                            autoHideDuration={6000}
                        >
                            <SnackbarWrapper variant="success" message="Saved successfully!" />
                        </Snackbar>
                        <Snackbar
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left"
                            }}
                            open={this.props.error}
                            onClose={() => this.props.closeSnack("error")}
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
                            disabled={this.props.saving}
                            onClick={() => {
                                this.props.Close();
                            }}
                            color="primary"
                        >
                            Close
                        </Button>
                        <Button
                            disabled={this.props.saving}
                            onClick={() => {
                                const obj = {
                                    title: this.state.title,
                                    content: this.state.content,
                                    newsImage: this.state.newsImage
                                };
                                console.log(obj);
                                this.props.Save(obj);
                            }}
                            color="primary"
                            autoFocus
                            variant="contained"
                        >
                            {this.props.saving ? (
                                <Fade
                                    in={this.props.saving}
                                    style={{
                                        transitionDelay: this.props.saving ? "100ms" : "0ms"
                                    }}
                                    unmountOnExit
                                >
                                    <CircularProgress size={24} />
                                </Fade>
                            ) : (
                                "Save"
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
