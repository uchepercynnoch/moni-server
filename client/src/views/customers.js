import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import { Chip, Avatar } from "@material-ui/core";
import { createAxiosInstance, getUserData, isSuperAdmin } from "../util";
import CustomerModal from "../components/customer.modal";
import { red } from "@material-ui/core/colors";

function changeColor(membershipType) {
  if (membershipType === "regular") return "#26de81";
  else if (membershipType === "blue") return "#3867d6";
  else if (membershipType === "gold") return "#f7b731";
  else if (membershipType === "platinum") return "#C5C5C5";
}

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
  { field: "phoneNumber", title: "Phone Number", minWidth: 170 },
  { field: "email", title: "Email", minWidth: 170 },
  {
    field: "membershipType",
    title: "MembershipType",
    minWidth: 170,
    cellStyle: {
      display: "flex",
      justifyContent: "center"
    },
    render: rowData => (
      <Chip
        label={rowData.membershipType}
        size="small"
        style={{
          color: "white",
          backgroundColor: changeColor(rowData.membershipType),
          marginTop: "20px"
        }}
      />
    )
  },
  {
    field: "gender",
    title: "Gender",
    minWidth: 170
  },
  {
    field: "gemPoints",
    title: "Gems💎",
    minWidth: 170
  }
];

function createData(obj) {
  return {
    _id: obj._id,
    id: obj.id,
    name: obj.name,
    email: obj.email,
    phoneNumber: obj.phoneNumber,
    gender: obj.gender,
    gemPoints: obj.gemPoints.currentGems,
    membershipType: obj.membershipType,
    transactions: obj.transactions || []
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

export default function Customer() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [openView, setOpenView] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const [error, setError] = React.useState(false);
  const [customer, setCustomer] = React.useState({
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    gender: "",
    gemPoints: "",
    transactions: []
  });

  useEffect(() => {
    createAxiosInstance()
      .get(`/api/user`)
      .then(res => {
        const customers = [];
        res.data.forEach(data => {
          customers.push(createData(data));
        });
        setRows(customers);
      })
      .catch(error => {
        console.log(error);
        alert(error.response.data.error);
      });
  }, []);

  const getCustomerDetails = _id => {
    Promise.all([getCustomer(_id), getCustomerTransactions(_id)])
      .then(res => {
        let customer = res[0];
        let transactions = res[1];
        let obj = {...customer, transactions};

        let newObj = createData(obj);
        setCustomer(newObj);
      }).catch(error => {
        console.log(error);
        alert(error.response.data.error);
      });
  };

  const getCustomer = (_id) => {
    return createAxiosInstance()
    .get(`/api/user?id=${_id}`)
    .then(res => {
      return res.data;
    });
  }

  const getCustomerTransactions = (_id) => {
    return createAxiosInstance()
      .get(`/api/transaction?userId=${_id}`)
      .then(res => {
        return res.data;
      });
  }

  const handleView = _id => {
    setOpenView(true);
    getCustomerDetails(_id);
  };

  const visibilityIconFontStyle = {
    fontSize: 16,
    color: "green"
  };

  const tableActions = [
    {
      icon: "visibility",
      tooltip: "View",
      onClick: (event, rowData) => {
        handleView(rowData._id);
      },
      iconProps: {
        style: { ...visibilityIconFontStyle }
      }
    }
  ];

  const localizationOptions = {
    header: {
      actions: "Actions"
    }
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <MaterialTable
          title="Customers"
          columns={columns}
          data={rows}
          localization={localizationOptions}
          actions={tableActions}
          options={{
            columnsButton: true,
            actionsColumnIndex: -1,
            size: "small"
          }}
        />
        <CustomerModal
          error={error}
          open={openView}
          Close={() => setOpenView(false)}
          customer={customer}
        />
      </div>
    </Paper>
  );
}
