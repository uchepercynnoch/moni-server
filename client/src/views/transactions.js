import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialTable from "material-table";
import { Button, Chip } from "@material-ui/core";
import { createAxiosInstance, getUserData, isSuperAdmin } from "../util";
import TransactionModal from "../components/transaction";
import { DateRangePicker } from "react-dates";
import Moment from "moment";
import _ from "lodash";
import { toDinero } from "../dinero-helper";

const columns = [
    { field: "transactionId", title: "Transaction Id", minWidth: 170 },
    {
        field: "date",
        title: "Date",
        minWidth: 100,
        render: rowData => Moment(rowData.date).format("YYYY-MM-DD")
    },
    {
        field: "servicedBy",
        title: "Cashier",
        minWidth: 170
    },
    {
        field: "membershipType",
        title: "Membership Type",
        minWidth: 170
    },
    {
        field: "gemsAwarded",
        title: "Gems Awarded",
        minWidth: 170
    },
    {
        field: "gemsDeducted",
        title: "Gems Deducted",
        minWidth: 170
    },
    // {
    //     field: "payable",
    //     title: "Payable",
    //     minWidth: 170
    // },
    // {
    //     field: "total",
    //     title: "Total",
    //     minWidth: 170
    // },
    {
        field: "user",
        title: "Customer",
        minWidth: 170
    }
];

const loyaltyTagStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
};

function createData(obj) {
    console.log(obj.servicedBy.iam);
    return {
        transactionId: obj.transactionId,
        date: obj.date,
        servicedBy: obj.servicedBy.iam, // merchant
        membershipType: obj.user.membershipType,
        gemsAwarded: obj.gemsAwarded,
        gemsDeducted: obj.gemsDeducted,
        user: obj.user.name,
        items: obj.items,
        payable: toDinero(obj.payable).toFormat(),
        total: toDinero(obj.total).toFormat(),
        vendor: obj.vendor.vendorName
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

export default function Transaction() {
    const classes = useStyles();
    const [openView, setOpenView] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [fallbackRows, setFallback] = React.useState([]);
    const [error, setError] = React.useState(false);
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);
    const [focused, setFocused] = React.useState(null);
    const [transaction, setTransaction] = React.useState({
        transactionId: "",
        date: "",
        servicedBy: "",
        user: "",
        items: [],
        membershipType: "",
        gemsAwarded: "",
        gemsDeducted: "",
        payable: null,
        total: null,
        vendor: null
    });

    useEffect(() => {
        const url = isSuperAdmin() ? `/api/transaction` : `/api/transaction?vendorId=${getUserData().vendor}`;
        createAxiosInstance()
            .get(url)
            .then(res => {
                const transactions = [];
                if (res.data.length <= 0)
                    return;
                res.data.forEach(data => {
                    transactions.push(createData(data));
                });
                // Sort array by date
                const sortedTransactions = _.orderBy(
                    transactions,
                    o => {
                        return Moment(o.dateOfTransaction).format("YYYY-MM-DD");
                    },
                    ["desc"]
                );
                setEndDate(Moment(sortedTransactions[0].dateOfTransaction));
                setFallback(sortedTransactions);
                setRows(sortedTransactions);
            })
            .catch(error => {
                console.log(error);
                alert(error.response.data.error);
            });
    }, []);

    const getTransaction = id => {
        createAxiosInstance()
            .get(`/api/transaction?id=${id}`)
            .then(res => {
                const obj = createData(res.data);
                console.log(obj);
                setTransaction(obj);
            })
            .catch(error => {
                setError(true);
                console.log(error);
            });
    };

    const handleView = id => {
        setOpenView(true);
        getTransaction(id);
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
                handleView(rowData.transactionId);
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

    const sortByDate = (startDate, endDate) => {
        setStartDate(startDate);
        setEndDate(endDate);

        if (!startDate || !endDate)
            setRows(fallbackRows);

        let result = _.filter(fallbackRows, data => {
            const date = Moment(data.dateOfTransaction);
            const start = Moment(startDate).format("YYYY-MM-DD");
            const end = Moment(endDate).format("YYYY-MM-DD");
                        
            return date.isBetween(start, end) || date.isSame(start) || date.isSame(end);
        });
        setRows(result);
    };

    return (
        <Paper className={classes.root}>
            <div>
                <DateRangePicker
                    startDate={startDate}
                    startDateId="1"
                    endDate={endDate}
                    endDateId="2"
                    onDatesChange={({ startDate, endDate }) => sortByDate(startDate, endDate)}
                    focusedInput={focused}
                    onFocusChange={focused => setFocused(focused)}
                    enableOutsideDays={true}
                    isOutsideRange={() => false}
                />
            </div>
            <div className={classes.tableWrapper}>
                <MaterialTable
                    title="Transactions"
                    columns={columns}
                    data={rows}
                    localization={localizationOptions}
                    actions={tableActions}
                    options={{
                        columnsButton: true,
                        actionsColumnIndex: -1
                    }}
                />
                <TransactionModal
                    closeSnack={type => setError(false)}
                    error={error}
                    open={openView}
                    Close={() => setOpenView(false)}
                    transaction={transaction}
                />
            </div>
        </Paper>
    );
}
