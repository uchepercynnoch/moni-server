const mongoose = require("mongoose");
const { DineroSchema, toDinero } = require("../helpers/dinero-helper");

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
  email: {type: String, required: true},
  // imageId: { type: String },
  total: { type: DineroSchema, default: toDinero(0).toObject() },
  payable: { type: DineroSchema, default: toDinero(0).toObject() },
  revenue: { type: DineroSchema, default: toDinero(0).toObject() },
  config: { type: configSchema, default: configSchema },
  loyaltyPercentage: { type: Number, default: 1 }
});

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
