import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import Add from "@material-ui/icons/Add";
import { Button, Fab } from "@material-ui/core";
import { createAxiosInstance, getUserData } from "../util";
import ProductModal from "../components/product.modal";
import ProductRegistrationModal from "../components/product.register";

const columns = [
    { field: "name", title: "Name", minWidth: 170 },
    { field: "code", title: "Code", minWidth: 100 },
    {
        field: "description",
        title: "Description",
        minWidth: 170,
        align: "right"
    },
    {
        field: "unitPrice",
        title: "Unit Price",
        minWidth: 170,
        align: "right"
    }
];

function createData(obj) {
    return {
        id: obj.refId,
        name: obj.name,
        code: obj.code,
        description: obj.description,
        loyaltyPercentage: obj.loyaltyPercentage,
        unitPrice: obj.unitPrice
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

export default function Product() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [saving, setSaving] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [product, setProduct] = React.useState({
        id: "",
        name: "",
        code: "",
        description: "",
        loyaltyPercentage: "",
        unitPrice: 0
    });

    useEffect(() => {
        createAxiosInstance()
            .get(`/api/product/all?id=${getUserData().vendor}`)
            .then(res => {
                const products = [];
                res.data.forEach(data => {
                    products.push(createData(data));
                });
                setRows(products);
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
            .post("/api/product/register", data)
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

    const getProduct = id => {
        createAxiosInstance()
            .get(`/api/product?id=${id}`)
            .then(res => {
                console.log(res.data);
                setProduct(createData(res.data));
            })
            .catch(error => {
                setError(true);
                console.log(error);
            });
    };

    const handleDelete = () => {};
    const handleView = id => {
        setOpenView(true);
        getProduct(id);
    };

    const productDetailsUpdate = event => {
        const obj = { ...product };
        obj[event.target.id] = event.target.value;
        setProduct(obj);
    };

    const productUpdate = () => {
        setSaving(true);
        setSaved(false);
        setError(false);
        createAxiosInstance()
            .post(`/api/product/update`, product)
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
    const deleteIconFontStyle = {
        fontSize: 16,
        color: "red"
    };

    const tableActions = [
        {
            icon: "visibility",
            tooltip: "View",
            onClick: (event, rowData) => {
                handleView(rowData.id);
            },
            iconProps: {
                style: { ...visibilityIconFontStyle }
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
                        Add Product
                    </Button>

                    <Button
                        style={{ margin: "5px" }}
                        variant="contained"
                        size="small"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        onClick={() => console.log("syncing...")}
                    >
                        Sync
                    </Button>
                </div>
                <MaterialTable
                    title="Products"
                    columns={columns}
                    data={rows}
                    localization={localizationOptions}
                    actions={tableActions}
                    options={{
                        columnsButton: true,
                        actionsColumnIndex: -1
                    }}
                />
                <ProductRegistrationModal
                    closeSnack={type => (type === "success" ? setSaved(false) : setError(false))}
                    saved={saved}
                    error={error}
                    saving={saving}
                    open={open}
                    Close={() => setOpen(false)}
                    Save={handleSave}
                />
                <ProductModal
                    closeSnack={type => (type === "success" ? setSaved(false) : setError(false))}
                    saved={saved}
                    error={error}
                    saving={saving}
                    open={openView}
                    Close={() => setOpenView(false)}
                    Update={productUpdate}
                    product={product}
                    updateProduct={productDetailsUpdate}
                />
            </div>
        </Paper>
    );
}
