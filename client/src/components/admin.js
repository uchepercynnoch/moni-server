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
        <IconButton
          key="close"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
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

export default function AdminModal(props) {
  const classes = useStyles2();

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={() => props.Close()}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Admin Account"}
        </DialogTitle>
        <DialogContent>
          <div className="horizontal-align">
            <TextField
              id="name"
              label="Name"
              value={props.admin.name}
              margin="normal"
              className="text-input"
              onChange={event => props.updateAdmin(event)}
              type="text"
              variant="filled"
              inputProps={{
                readOnly: Boolean(!props.edit)
              }}
            />
            <TextField
              id="email"
              value={props.admin.email}
              margin="normal"
              label="Email"
              className="text-input"
              onChange={event => props.updateAdmin(event)}
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
              value={props.admin.phoneNumber}
              margin="normal"
              helperText="Mobile phone number"
              className="text-input"
              onChange={event => props.updateAdmin(event)}
              type="text"
              variant="filled"
              inputProps={{
                readOnly: Boolean(!props.edit)
              }}
            />

            <TextField
              id="password"
              value={props.admin.password}
              margin="normal"
              label="Password"
              className="text-input"
              helperText="You can set a new password here!"
              onChange={event => props.updateAdmin(event)}
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
                value={props.admin.gender}
                onChange={event => {
                  event.target.id = "gender";
                  props.updateAdmin(event);
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
            <FormControl variant="filled" className="form-select">
              <InputLabel htmlFor="filled-vendor-simple">Vendor</InputLabel>
              <Select
                value={props.admin.vendor}
                onChange={event => {
                  event.target.id = "vendor";
                  props.updateAdmin(event);
                }}
                inputProps={{
                  name: "vendor",
                  id: "filled-vendor-simple",
                  readOnly: Boolean(!props.edit)
                }}
              >
                {props.vendors.map((vendor, key) => (
                  <MenuItem key={key} value={vendor.id}>
                    {vendor.vendorName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
