import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import { Button, Avatar } from "@material-ui/core";
import { createAxiosInstance, getUserData, isSuperAdmin } from "../util";
import AdminRegister from "../components/admin.register";
import Admin from "../components/admin";
import { red } from "@material-ui/core/colors";
import Moment from "moment";

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
        <Avatar style={nameAvatar}>
          {`${rowData.name
            .split(" ")[0]
            .substr(0, 1)
            .toUpperCase()} 
                ${rowData.name
                  .split(" ")[1]
                  .substr(0, 1)
                  .toUpperCase()}`}
        </Avatar>
        <p style={{ fontWeight: "bold" }}>{rowData.name}</p>
      </div>
    ),
    cellStyle: {
      padding: "0px"
    }
  },
  { field: "email", title: "Email", minWidth: 100 },
  { field: "gender", title: "Gender", minWidth: 100 },
  {
    field: "phoneNumber",
    title: "Phone Number",
    minWidth: 170
  },
  { field: "$vendor", title: "Vendor", minWidth: 100 },
  { field: "type", title: "Role", minWidth: 100 },
  {
    field: "lastLogin",
    title: "Last Login",
    minWidth: 170,
    render: rowData => Moment(rowData.lastLogin).format("YYYY-MM-DD")
  }
];

function createVendorData(obj) {
  return {
    id: obj._id,
    vendorName: obj.vendorName
  };
}

function createData(obj) {
  return {
    id: obj.id,
    name: obj.name,
    email: obj.email,
    password: obj.password,
    phoneNumber: obj.phoneNumber,
    gender: obj.gender,
    $vendor: typeof obj.vendor === "object" ? obj.vendor.vendorName : "",
    vendor: typeof obj.vendor === "object" ? obj.vendor._id : "",
    type: obj.type,

    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
    lastLogin: obj.lastLogin
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

export default function Admins() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [vendors, setVendors] = React.useState([]);
  const [admin, setAdmin] = React.useState({
    id: "",
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    gender: "",
    vendor: "",
    type: "",

    createdAt: null,
    updatedAt: null,
    lastLogin: null
  });

  useEffect(() => {
    Promise.all([getAdmins(), getVendors()])
      .then(res => {
        console.log("worked");
      })
      .catch(error => {
        console.log(error);
        alert(error.response.data.error);
      });
  }, []);

  const getAdmins = () => {
    const url = isSuperAdmin()
      ? `/api/admin`
      : `/api/admin?vendorId=${getUserData().vendor}`;
    return createAxiosInstance()
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
  };

  const getVendors = () => {
    return createAxiosInstance()
      .get(`/api/vendor`)
      .then(res => {
        const vendors = [];
        res.data.forEach(data => {
          vendors.push(createVendorData(data));
        });
        setVendors(vendors);
      })
      .catch(error => {
        console.log(error);
        alert(error.response.data.error);
      });
  };

  const handleSave = data => {
    setSaving(true);
    setSaved(false);
    setError(false);
    console.log(data);

    createAxiosInstance()
      .post("/api/admin/register", data)
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

  const getAdmin = id => {
    createAxiosInstance()
      .get(`/api/admin?id=${id}`)
      .then(res => {
        const data = createData(res.data);
        data.password = "";
        setAdmin(data);
      })
      .catch(error => {
        setError(true);
        console.log(error);
      });
  };

  const handleDelete = () => {};
  const handleView = id => {
    setOpenView(true);
    getAdmin(id);
  };

  const adminDetailsUpdate = event => {
    const obj = { ...admin };
    obj[event.target.id] = event.target.value;
    console.log(obj);
    setAdmin(obj);
  };

  const adminUpdate = () => {
    setSaving(true);
    setSaved(false);
    setError(false);
    createAxiosInstance()
      .post(`/api/admin/update`, admin)
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
            Add Admin
          </Button>
        </div>
        <MaterialTable
          title="Admin"
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
        <AdminRegister
          closeSnack={type =>
            type === "success" ? setSaved(false) : setError(false)
          }
          saved={saved}
          error={error}
          saving={saving}
          open={open}
          Close={() => setOpen(false)}
          Save={handleSave}
          vendors={vendors}
        />
        <Admin
          closeSnack={type =>
            type === "success" ? setSaved(false) : setError(false)
          }
          saved={saved}
          error={error}
          saving={saving}
          open={openView}
          Close={() => setOpenView(false)}
          Update={adminUpdate}
          admin={admin}
          updateAdmin={adminDetailsUpdate}
          edit={edit}
          vendors={vendors}
        />
      </div>
    </Paper>
  );
}
