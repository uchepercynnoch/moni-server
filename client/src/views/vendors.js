import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";
import MaterialTable from "material-table";
import { createAxiosInstance, getUserData } from "../util";
import Vendor from "../components/vendor";
import VendorRegister from "../components/vendor.register";

const columns = [
    { field: "vendorName", title: "Name", minWidth: 170 },
    { field: "location", title: "Location", minWidth: 170 },
    { field: "iamAlias", title: "Iam-Alias", minWidth: 170 }
];

function createData(obj) {
    return {
        id: obj._id,
        vendorName: obj.vendorName,
        location: obj.location,
        iamAlias: obj.iamAlias,
        loyaltyPercentage: obj.loyaltyPercentage,
        payable: obj.payable,
        revenue: obj.revenue
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

export default function Vendors() {
    const classes = useStyles();
    const [openView, setOpenView] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [saving, setSaving] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [vendor, setVendor] = React.useState({
        vendorName: "",
        location: "",
        iamAlias: "",
        loyaltyPercentage: ""
    });

    useEffect(() => {
        createAxiosInstance()
            .get(`/api/vendor`)
            .then(res => {
                const transactions = [];
                res.data.forEach(data => {
                    transactions.push(createData(data));
                });
                setRows(transactions);
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
            .post("/api/vendor/add", data)
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

    const getVendor = id => {
        createAxiosInstance()
            .get(`/api/vendor?id=${id}`)
            .then(res => {
                const obj = createData(res.data);
                console.log(obj);
                setVendor(obj);
            })
            .catch(error => {
                setError(true);
                console.log(error);
            });
    };

    const handleView = id => {
        setOpenView(true);
        getVendor(id);
    };

    const vendorDetailsUpdate = event => {
        const obj = { ...vendor };
        console.log(event.target);
        obj[event.target.id] = event.target.value;
        setVendor(obj);
    };
    const handleDelete = () => {};

    const vendorUpdate = () => {
        setSaving(true);
        setSaved(false);
        setError(false);
        createAxiosInstance()
            .post(`/api/vendor/update`, vendor)
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
        fontSize: 16,
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
                        Create new Vendor
                    </Button>
                </div>
                <MaterialTable
                    title="Vendors"
                    columns={columns}
                    data={rows}
                    localization={localizationOptions}
                    actions={tableActions}
                    options={{
                        columnsButton: true,
                        actionsColumnIndex: -1
                    }}
                />
                <VendorRegister
                    closeSnack={type => (type === "success" ? setSaved(false) : setError(false))}
                    saved={saved}
                    error={error}
                    saving={saving}
                    open={open}
                    Close={() => setOpen(false)}
                    Save={handleSave}
                />
                <Vendor
                    closeSnack={type => setError(false)}
                    error={error}
                    saved={saved}
                    saving={saving}
                    open={openView}
                    Close={() => setOpenView(false)}
                    vendor={vendor}
                    Update={vendorUpdate}
                    updateVendor={vendorDetailsUpdate}
                    edit={edit}
                />
            </div>
        </Paper>
    );
}
