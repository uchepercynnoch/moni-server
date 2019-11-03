import React, { PureComponent } from "react";
import { createAxiosInstance, getUserData } from "../util";
import {
  Typography,
  Paper,
  Chip,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from "@material-ui/core";
import StatCard from "../components/statcard";
import MembershipTag from "./membershipTag";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import SplitButton from "./customdropdown";
import { toDinero } from "../dinero-helper";
import Doc from "../export-helper";
import ExportModal from "../components/export";

export default class AdminChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      data: [],
      untransformedData: [],
      selectedVendor: null,
      open: false
    };
  }

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index
    });
  };

  getVendors() {
    return createAxiosInstance()
      .get("/api/vendor")
      .then(res => res.data);
  }

  componentWillMount() {
    this.getVendors()
      .then(result => {
        console.log(result);
        const vendorArray = this.transformData(result);
        this.setState({
          ...this.state,
          untransformedData: result,
          data: vendorArray,
          selectedVendor: result[0]
        });
      })
      .catch(error => console.log(error));
  }

  transformData(data) {
    const transformedData = data.map(item => {
      console.log(item);
      const obj = {
        vendorName: item.vendorName,
        reservior: item.payable.amount,
        revenue: item.revenue.amount,
        total: item.total.amount
      };
      return obj;
    });
    return transformedData;
  }

  handleSelectionChanged = index => {
    this.setState({
      ...this.state,
      selectedVendor: this.state.untransformedData[index]
    });
  };
  renderTable(ref) {
    return (
      <div ref={ref}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendors</TableCell>
              <TableCell>Expected Revenue</TableCell>
              <TableCell>Actual Revenue</TableCell>
              <TableCell>Reservior</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.untransformedData.map((vendor, key) => (
              <TableRow key={key}>
                <TableCell>{vendor.vendorName}</TableCell>
                <TableCell>
                  {toDinero(vendor.total).toFormat("$0,0.00")}
                </TableCell>
                <TableCell>
                  {toDinero(vendor.revenue).toFormat("$0,0.00")}
                </TableCell>
                <TableCell>
                  {toDinero(vendor.payable).toFormat("$0,0.00")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  renderExportFormat() {
    this.setState({ ...this.state, open: true });
    // console.log(this.state.ref);
    // Doc.createPdf(this.state.ref.current);
  }

  render() {
    const containerStyle = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      flexWrap: "wrap"
    };

    const statCardContainer = {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      height: "100%",
      width: "100%",
      backgroundColor: "#ecf0f1"
    };
    const statsStyle = {
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
      justifyContent: "center",
      height: "100%",
      width: "50%",
      padding: "10px"
    };

    const chipStyle = {
      color: "white",
      backgroundColor: "#070E2E"
    };

    const chartWrapperStyle = {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    };
    const root = {
      display: "flex",
      flexDirection: "row"
    };
    return (
      <div>
        <Button
          style={{ margin: "5px" }}
          size="small"
          color="primary"
          variant="contained"
          aria-label="export"
          onClick={() => this.renderExportFormat()}
        >
          Export
        </Button>
        <div style={containerStyle}>
          {this.state.data.length > 0 ? (
            <>
              <div style={chartWrapperStyle}>
                <BarChart
                  width={500}
                  height={300}
                  data={this.state.data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vendorName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="reservior"
                    fill="#8884d8"
                    background={{ fill: "#eee" }}
                  />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </div>

              <div style={statsStyle}>
                <SplitButton
                  onSelect={this.handleSelectionChanged}
                  style={chipStyle}
                  options={this.state.data}
                />
                {/* <MembershipTag type="blue" label="Blue Membership" /> */}
                <div style={statCardContainer}>
                  <StatCard
                    tag="Expected Revenue"
                    value={toDinero(this.state.selectedVendor.total).toFormat()}
                  />
                  <StatCard
                    tag="Actual Revenue"
                    value={toDinero(
                      this.state.selectedVendor.revenue
                    ).toFormat()}
                  />
                  <StatCard
                    tag="Reservior"
                    value={toDinero(
                      this.state.selectedVendor.reservior
                    ).toFormat()}
                  />
                </div>
              </div>
            </>
          ) : null}
        </div>

        <ExportModal
          Close={() => this.setState({ ...this.state, open: false })}
          open={this.state.open}
          table={ref => this.renderTable(ref)}
        />
      </div>
    );
  }
}
