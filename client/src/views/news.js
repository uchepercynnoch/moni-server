import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import { Button } from "@material-ui/core";
import { createAxiosInstance, getUserData, isSuperAdmin } from "../util";
import NewsRegister from "../components/news.register";
import NewsModal from "../components/news.modal";
import Moment from "moment";

const columns = [
    { field: "title", title: "Title", minWidth: 170 },
    { field: "dateCreated", title: "Date Created", minWidth: 150, render: rowData => Moment(rowData.dateCreated).format("YYYY-MM-DD") }
];

function createData(obj) {
    return {
        id: obj._id,
        title: obj.title,
        content: obj.content,
        imageId: obj.imageId,
        dateCreated: obj.dateCreated
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

export default function News() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [openView, setOpenView] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [saving, setSaving] = React.useState(false);
    const [saved, setSaved] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [news, setNews] = React.useState({
        id: "",
        title: "",
        content: "",
        dateCreated: "",
        // for update
        selectedFile: null
    });

    useEffect(() => {
        const url = isSuperAdmin() ? `/api/news` : `/api/news?vendorId=${getUserData().vendor}`;

        createAxiosInstance()
            .get(url)
            .then(res => {
                const news = [];
                res.data.forEach(data => {
                    news.push(createData(data));
                });
                setRows(news);
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
        console.log(data);
        const formdata = new FormData();
        formdata.append("newsImage", data.newsImage, data.newsImage.name);
        formdata.append("content", data.content);
        formdata.append("title", data.title);
        formdata.append("vendorId", getUserData().vendor);

        createAxiosInstance()
            .post("/api/news", formdata)
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

    const getNews = id => {
        createAxiosInstance()
            .get(`/api/news?id=${id}`)
            .then(res => {
                console.log(res.data);
                setNews(createData(res.data));
            })
            .catch(error => {
                setError(true);
                console.log(error);
            });
    };

    const handleDelete = () => {};
    const handleView = id => {
        setOpenView(true);
        getNews(id);
    };

    const newsDetailsUpdate = event => {
        const obj = { ...news };
        obj[event.target.id] =
            event.target.id === "selectedFile" ? event.target.files[0] : event.target.value;
        setNews(obj);
    };

    const newsUpdate = () => {
        const formdata = new FormData();
        if(news.newsImage)
            formdata.append("newsImage", news.newsImage, news.newsImage.name);
        formdata.append("content", news.content);
        formdata.append("title", news.title);

        setSaving(true);
        setSaved(false);
        setError(false);
        createAxiosInstance()
            .post(`/api/news/update?id=${news.id}`, formdata)
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
                        Create News
                    </Button>
                </div>
                <MaterialTable
                    title="News"
                    columns={columns}
                    data={rows}
                    actions={tableActions}
                    localization={localizationOptions}
                    options={{
                        columnsButton: true,
                        actionsColumnIndex: -1
                    }}
                />
                <NewsRegister
                    closeSnack={type => (type === "success" ? setSaved(false) : setError(false))}
                    saved={saved}
                    error={error}
                    saving={saving}
                    open={open}
                    Close={() => setOpen(false)}
                    Save={handleSave}
                />
                <NewsModal
                    closeSnack={type => (type === "success" ? setSaved(false) : setError(false))}
                    saved={saved}
                    error={error}
                    saving={saving}
                    open={openView}
                    Close={() => setOpenView(false)}
                    Update={newsUpdate}
                    news={news}
                    updateNews={newsDetailsUpdate}
                />
            </div>
        </Paper>
    );
}
