import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import { Button, Avatar } from "@material-ui/core";
import { createAxiosInstance, getUserData, isSuperAdmin } from "../util";
import CashierRegistrationModal from "../components/cashierRegisteraton";
import CashierModal from "../components/cashier";
import { red } from "@material-ui/core/colors";

const nameStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
};

const nameAvatar = {
    backgroundColor: red[500],
    marginRight: "10px",
    marginLeft: "10px"
};

const columns = [
    {
        field: "name",
        title: "Name",
        minWidth: 350,
        render: rowData => (
            <div style={nameStyle}>
                <Avatar style={nameAvatar}>{`${rowData.name
                    .split(" ")[0]
                    .substr(0, 1)
                    .toUpperCase()} 
                ${rowData.name
                    .split(" ")[1]
                    .substr(0, 1)
                    .toUpperCase()}`}</Avatar>
                <p style={{ fontWeight: "bold" }}>{rowData.name}</p>
            </div>
        ),
        cellStyle: {
            padding: "0px"
        }
    },
    { field: "iam", title: "IAM", minWidth: 100 },
    {
        field: "lastLogon",
        title: "Last Login",
        minWidth: 170
    },
    {
        field: "phoneNumber",
        title: "Phone Number",
        minWidth: 170
    }
];

function createData(obj) {
    return {
        id: obj.id,
        name: `${obj.lastname} ${obj.firstname}`,
        iam: obj.iam,
        lastLogon: obj.lastLogon,
        phoneNumber: obj.phoneNumber
    };
}
function createSingleData(obj) {
    return {
        id: obj.id,
        firstname: obj.firstname,
        lastname: obj.lastname,
        iam: obj.iam,
        password: "",
        gender: obj.gender,
        phoneNumber: obj.phoneNumber,
        // customersAttendedTo: obj.customersAttendedTo,
        // totalGemsGainedForCustomers: obj.totalGemsGainedForCustomers,
        // totalGemsRedeemedForCustomers: obj.totalGemsRedeemedForCustomers
    };
}

const useStyles = makeStyles({
    root: {
        width: "95%",
        margin: "10px",
        marginLeft: "auto",
        marginRight: "auto"
    },
    tableWrapper: {
        height: "90%",
        overflow: "auto"
    },
    controls: {
        display: "flex",
        flexDirection: "row",
        margin: "20px"
    }
});

export default function Cashiers() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [saving, setSaving] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [cashier, setCashier] = React.useState({
        id: "",
        firstname: "",
        lastname: "",
        password: "",
        phoneNumber: "",
        gender: "",
        iam: ""
    });

    useEffect(() => {
        const url = isSuperAdmin() ? `/api/merchant` : `/api/merchant?vendorId=${getUserData().vendor}`;
        createAxiosInstance()
            .get(url)
            .then(res => {
                const cashiers = [];
                res.data.forEach(data => {
                    cashiers.push(createData(data));
                });
                setRows(cashiers);
            })
            .catch(error => {
                console.log(error);
                alert(error.response.data.error);
            });
    }, []);

    const handleSave = data => {
        setSaving(true);
        setSaved(false);
        setError(false);
        data.vendor = getUserData().vendor;
        createAxiosInstance()
            .post("/api/merchant/register", data)
            .then(res => {
                setSaving(false);
                setSaved(true);

                const newRow = [...rows];
                newRow.push(createData(res.data));
                setRows(newRow);
            })
            .catch(error => {
                setSaving(false);
                setError(true);
                setSaved(false);
                console.log(error);
            });
    };

    const getCashier = id => {
        createAxiosInstance()
            .get(`/api/merchant?id=${id}`)
            .then(res => {
                console.log(res.data);
                setCashier(createSingleData(res.data));
            })
            .catch(error => {
                setError(true);
                console.log(error);
            });
    };

    const handleDelete = () => {};
    const handleView = id => {
        setOpenView(true);
        getCashier(id);
    };

    const cashierDetailsUpdate = event => {
        const obj = { ...cashier };
        console.log(event.target);
        obj[event.target.id] = event.target.value;
        setCashier(obj);
    };

    const cashierUpdate = () => {
        setSaving(true);
        setSaved(false);
        setError(false);
        createAxiosInstance()
            .post(`/api/merchant/update`, cashier)
            .then(res => {
                setSaving(false);
                setSaved(true);

                console.log(res.data);
            })
            .catch(error => {
                setSaving(false);
                setError(true);
                setSaved(false);
                console.log(error);
            });
    };
    const visibilityIconFontStyle = {
        fontSize: 18,
        color: "green"
    };
    const editIconFontStyle = {
        fontSize: 18,
        color: "#070E2E"
    };
    const deleteIconFontStyle = {
        fontSize: 18,
        color: "red"
    };

    const tableActions = [
        {
            icon: "visibility",
            tooltip: "View",
            onClick: (event, rowData) => {
                setEdit(false);
                handleView(rowData.id);
            },
            iconProps: {
                style: { ...visibilityIconFontStyle }
            }
        },
        {
            icon: "edit",
            tooltip: "edit",
            onClick: (event, rowData) => {
                setEdit(true);
                handleView(rowData.id);
            },
            iconProps: {
                style: { ...editIconFontStyle }
            }
        }
    ];

    const deleteAction = {
        icon: "close",
        tooltip: "Delete",
        onClick: (event, rowData) => {
            handleDelete();
        },
        iconProps: {
            style: { ...deleteIconFontStyle }
        }
    };

    tableActions.push(deleteAction);

    const localizationOptions = {
        header: {
            actions: "Actions"
        }
    };

    return (
        <Paper className={classes.root}>
            <div className={classes.tableWrapper}>
                <div className={classes.controls}>
                    <Button
                        style={{ margin: "5px" }}
                        size="small"
                        color="primary"
                        variant="contained"
                        aria-label="add"
                        className={classes.margin}
                        onClick={() => setOpen(true)}
                    >
                        Add Cashier
                    </Button>
                    
                </div>
                <MaterialTable
                    title="Cashiers"
                    columns={columns}
                    data={rows}
                    actions={tableActions}
                    localization={localizationOptions}
                    options={{
                        columnsButton: true,
                        actionsColumnIndex: -1,
                        exportButton: true
                    }}
                />
                <CashierRegistrationModal
                    closeSnack={type => (type === "success" ? setSaved(false) : setError(false))}
                    saved={saved}
                    error={error}
                    saving={saving}
                    open={open}
                    Close={() => setOpen(false)}
                    Save={handleSave}
                />
                <CashierModal
                    closeSnack={type => (type === "success" ? setSaved(false) : setError(false))}
                    saved={saved}
                    error={error}
                    saving={saving}
                    open={openView}
                    Close={() => setOpenView(false)}
                    Update={cashierUpdate}
                    cashier={cashier}
                    updateCashier={cashierDetailsUpdate}
                    edit={edit}
                />
            </div>
        </Paper>
    );
}
