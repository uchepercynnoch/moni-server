import React from "react";
import {
  Dialog,
  DialogContent,
  Radio,
  DialogActions,
  DialogTitle,
  Button,
  RadioGroup,
  FormControlLabel
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
    const handleChange = (event) => {
      this.setState({...this.state, exportType: event.target.value});
    }
    return (
      <Dialog open={this.props.open} onClose={() => this.props.Close()}>
        <DialogTitle>Export Report</DialogTitle>
        <DialogContent>
          {this.props.table(this.state.ref)}
          <div>
            <RadioGroup  aria-label="exportType" name="exportType" value={this.state.exportType} onChange={handleChange}>
              <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
              <FormControlLabel value="csv" control={<Radio />} label="CSV" />
            </RadioGroup>
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
