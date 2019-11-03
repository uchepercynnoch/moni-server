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

export default class OfferRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            percentage: "",
            offerImage: null,
            membershipType: "",
            ageRange: "",
            preferences: []
        };
    }

    setProperty(event) {
        const obj = { ...this.state };
        obj[event.target.id] = event.target.id === "offerImage" ? event.target.files[0] : event.target.value;
        this.setState(obj);
    }

    render() {
        //const classes = useStyles2();
        const updatePreference = name => {
            const pref = this.state.preferences;
            if (pref.includes(name)) {
                const index = pref.indexOf(name);
                pref.splice(index, 1);
                this.setState({ ...this.state, preferences: pref });
            } else {
                pref.push(name);
                this.setState({ ...this.state, preferences: pref });
            }
            console.log(this.state.preferences);
        };
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={() => this.props.Close()}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Add new offer."}</DialogTitle>
                    <DialogContent>
                        <div className="horizontal-align">
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
                                id="percentage"
                                value={this.state.percentage}
                                margin="normal"
                                label="percentage"
                                className="text-input"
                                placeholder="percentage"
                                onChange={event => this.setProperty(event)}
                                type="number"
                                variant="filled"
                            />
                        </div>
                        <div className="horizontal-align">
                            <FormControl id="membershipType" variant="filled" className="form-select">
                                <InputLabel htmlFor="membershipType">MembershipType</InputLabel>
                                <Select
                                    value={this.state.membershipType}
                                    onChange={event => {
                                        event.target.id = "membershipType";
                                        this.setProperty(event);
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
                                    value={this.state.ageRange}
                                    onChange={event => {
                                        event.target.id = "ageRange";
                                        this.setProperty(event);
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
                            {this.state.preferences.map((item, key) => (
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
                                        onChange={event => updatePreference("Movies", event)}
                                        checked={this.state.preferences.includes("Movies")}
                                    />
                                }
                                label="Movies"
                            ></FormControlLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={event => updatePreference("Restaurant", event)}
                                        checked={this.state.preferences.includes("Restaurant")}
                                    />
                                }
                                label="Restaurant"
                            ></FormControlLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={event => updatePreference("NightLife", event)}
                                        checked={this.state.preferences.includes("NightLife")}
                                    />
                                }
                                label="NightLife"
                            ></FormControlLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={event => updatePreference("Shopping", event)}
                                        checked={this.state.preferences.includes("Shopping")}
                                    />
                                }
                                label="Shopping"
                            ></FormControlLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={event => updatePreference("Leisure", event)}
                                        checked={this.state.preferences.includes("Leisure")}
                                    />
                                }
                                label="Leisure"
                            ></FormControlLabel>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        onChange={event => updatePreference("Hotel", event)}
                                        checked={this.state.preferences.includes("Hotel")}
                                    />
                                }
                                label="Hotel"
                            ></FormControlLabel>
                        </div>
                        <div style={{ margin: "10px" }}>
                            <label htmlFor="offerImage">select an image to represent the offer</label>
                            <br />
                            <input
                                accept="image/*"
                                id="offerImage"
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
                                    percentage: this.state.percentage,
                                    offerImage: this.state.offerImage,
                                    membershipType: this.state.membershipType,
                                    ageRange: this.state.ageRange,
                                    preferences: this.state.preferences
                                };
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
                                "Push"
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

// export default function OfferRegister(props) {
//     const classes = useStyles2();

//     const [title, setTitle] = useState("");
//     const [percentage, setPercentage] = useState("");
//     const [offerImage, setOfferImage] = useState("");
//     const [membershipType, setMembershipType] = useState("");
//     const [ageRange, setAgeRange] = useState("");
//     const [preferences, setPreferences] = useState([]);

// }
