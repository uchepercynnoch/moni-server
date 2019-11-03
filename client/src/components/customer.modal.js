import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
    TextField,
    Button,
    Snackbar,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography
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

export default function CustomerModal(props) {
    const classes = useStyles2();

    return (
        <div>
            <Dialog open={props.open} onClose={() => props.Close()} aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">{"Customer"}</DialogTitle>
                <DialogContent>
                    <div className="horizontal-align">
                        <TextField
                            id="name"
                            label="Name"
                            value={props.customer.name}
                            margin="normal"
                            type="text"
                            variant="filled"
                            className="text-input"
                            inputProps={{
                                readOnly: Boolean(true)
                            }}
                        />

                        <TextField
                            id="email"
                            value={props.customer.email}
                            margin="normal"
                            label="Email"
                            type="text"
                            className="text-input"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(true)
                            }}
                        />
                    </div>

                    <div className="horizontal-align">
                        <TextField
                            id="gender"
                            label="Gender"
                            value={props.customer.gender}
                            margin="normal"
                            type="text"
                            variant="filled"
                            className="text-input"
                            inputProps={{
                                readOnly: Boolean(true)
                            }}
                        />

                        <TextField
                            id="loyaltyPoints"
                            className="text-input"
                            value={props.customer.gemPoints}
                            margin="none"
                            label="Gems💎"
                            type="number"
                            variant="filled"
                            inputProps={{
                                readOnly: Boolean(true)
                            }}
                        />
                    </div>
                    <div>
                    <Typography component="h5">Transactions</Typography>
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Transaction Id</TableCell>
                                        <TableCell>Items</TableCell>
                                        <TableCell>Serviced By</TableCell>
                                        <TableCell>Gems Awarded</TableCell>
                                        <TableCell>Gems Deducted</TableCell>
                                        <TableCell>Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.customer.transactions.map((transaction, key) => (
                                        <TableRow key={key}>
                                            <TableCell>{transaction.transactionId}</TableCell>
                                            <TableCell>{transaction.items.map((item, key) => (
                                                <p key={key}>{item.name}</p>
                                            ))}</TableCell>
                                            <TableCell>{transaction.servicedBy.iam}</TableCell>
                                            <TableCell>{transaction.gemsAwarded}</TableCell>
                                            <TableCell>{transaction.gemsDeducted}</TableCell>
                                            <TableCell>{transaction.total}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
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
                        variant="contained"
                        color="primary"
                        disabled={props.saving}
                        onClick={() => {
                            props.Close();
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
