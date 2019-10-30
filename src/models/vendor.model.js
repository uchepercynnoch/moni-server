const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const configSchema = Schema({
  host: { type: String, default: "" },
  user: { type: String, default: "" },
  password: { type: String, default: "" },
  database: { type: String, default: "" }
});

const VendorSchema = new Schema({
  id: { type: String, required: true },
  vendorName: { type: String, required: true },
  location: { type: String, required: true },
  iamAlias: { type: String, required: true },
  imageId: { type: String },
  /* It's actually a dinero object in json format, we can't use Number here */
  payable: { type: String },
  revenue: { type: String },
  config: { type: configSchema, default: configSchema },
  loyaltyPercentage: { type: Number, default: 1 }
});

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
