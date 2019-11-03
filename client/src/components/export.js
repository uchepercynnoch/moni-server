import React from "react";
import {
  Dialog,
  DialogContent,
  Radio,
  DialogActions,
  DialogTitle,
  Button
} from "@material-ui/core";

export default class ExportModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      exportType: "pdf",
      ref: React.createRef()
    };
  }

  handleExport() {
    if (this.state.exportType === "pdf") {
      console.log("Exporting pdf...");
      return;
    }
    console.log("Exporting csv...");
  }

  render() {
    return (
      <Dialog open={this.props.open} onClose={() => this.props.Close()}>
        <DialogTitle>Export Report</DialogTitle>
        <DialogContent>
          {this.props.table(this.state.ref)}
          <div>
            <Radio labelPlacement="end" label="pdf"></Radio>
            <Radio labelPlacement="end" label="csv"></Radio>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.Close()}>Close</Button>
          <Button
            onClick={() => this.handleExport()}
            color="primary"
            autoFocus
            variant="contained"
          >
            Export
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
