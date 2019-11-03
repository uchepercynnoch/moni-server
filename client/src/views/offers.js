import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import { Button } from "@material-ui/core";
import { createAxiosInstance, getUserData, isSuperAdmin } from "../util";
import OfferRegister from "../components/offer.register";
import Offer from "../components/offer.modal";
import Moment from "moment";

const columns = [
    { field: "title", title: "Title", minWidth: 170 },
    { field: "percentage", title: "Percentage", minWidth: 100 }
];

function createData(obj) {
    return {
        id: obj._id,
        title: `${obj.title}`,
        percentage: obj.offerPercentage,
        imageId: obj.imageId,
        membershipType: obj.membershipType,
        ageRange: obj.ageRange,
        preferences: obj.preferences
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

export default function Offers() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [saving, setSaving] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [offer, setOffer] = React.useState({
        id: "",
        title: "",
        percentage: "",
        imageId: "",
        membershipType: "",
        preferences: [],
        ageRange: "",
        // for update
        selectedFile: null
    });

    useEffect(() => {
        const url = isSuperAdmin() ? `/api/offer` : `/api/offer?vendorId=${getUserData().vendor}`;

        createAxiosInstance()
            .get(url)
            .then(res => {
                const offer = [];
                res.data.forEach(data => {
                    offer.push(createData(data));
                });
                setRows(offer);
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

        const formdata = new FormData();
        formdata.append("offerImage", data.offerImage, data.offerImage.name);
        formdata.append("percentage", data.percentage);
        formdata.append("title", data.title);
        formdata.append("membershipType", data.membershipType);
        formdata.append("ageRange", data.ageRange);
        formdata.append("preferences", data.preferences);
        formdata.append("vendorId", getUserData().vendor);

        createAxiosInstance()
            .post("/api/offer", formdata)
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

    const getOffer = id => {
        createAxiosInstance()
            .get(`/api/offer?id=${id}`)
            .then(res => {
                console.log(res.data);
                setOffer(createData(res.data));
            })
            .catch(error => {
                setError(true);
                console.log(error);
            });
    };

    const handleDelete = () => {};
    const handleView = id => {
        setOpenView(true);
        getOffer(id);
    };

    const offerDetailsUpdate = event => {
        const obj = { ...offer };
        obj[event.target.id] =
            event.target.id === "selectedFile" ? event.target.files[0] : event.target.value;
        setOffer(obj);
    };

    const handlePreferenceUpdate = (name, event) => {
        const obj = { ...offer };

        if (obj.preferences.includes(name)) {
            const index = obj.preferences.indexOf(name);
            obj.preferences.splice(index, 1);
            setOffer(obj);
        } else {
            obj.preferences.push(name);
            setOffer(obj);
        }
    };

    const offerUpdate = () => {
        const formdata = new FormData();
        if(offer.offerImage)
            formdata.append("offerImage", offer.selectedFile, offer.selectedFile.name);
        formdata.append("percentage", offer.percentage);
        formdata.append("title", offer.title);
        formdata.append("membershipType", offer.membershipType);
        formdata.append("ageRange", offer.ageRange);
        formdata.append("preferences", offer.preferences);

        setSaving(true);
        setSaved(false);
        setError(false);
        createAxiosInstance()
            .post(`/api/offer/update?id=${offer.id}`, formdata)
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
                        Create Offer
                    </Button>
                </div>
                <MaterialTable
                    title="Offers"
                    columns={columns}
                    data={rows}
                    actions={tableActions}
                    localization={localizationOptions}
                    options={{
                        columnsButton: true,
                        actionsColumnIndex: -1
                    }}
                />
                <OfferRegister
                    closeSnack={type => (type === "success" ? setSaved(false) : setError(false))}
                    saved={saved}
                    error={error}
                    saving={saving}
                    open={open}
                    Close={() => setOpen(false)}
                    Save={handleSave}
                />
                <Offer
                    closeSnack={type => (type === "success" ? setSaved(false) : setError(false))}
                    saved={saved}
                    error={error}
                    saving={saving}
                    open={openView}
                    Close={() => setOpenView(false)}
                    Update={offerUpdate}
                    offer={offer}
                    updateOffer={offerDetailsUpdate}
                    updatePreference={handlePreferenceUpdate}
                />
            </div>
        </Paper>
    );
}
