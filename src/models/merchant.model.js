const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const merchantSchema = new Schema({
    id: { type: String },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    iam: { type: String },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    transactions: { type: Array, default: [] },
    password: { type: String, required: true },
    phoneNumber: { type: Number, required: false },
    gender: { type: String, enum: ["male", "female"] },
    deviceId: { type: String },
    createdAt: { type: Date, default: Date.now },
    lastLogon: { type: Date },
});

const Merchant = mongoose.model("Merchant", merchantSchema);

module.exports = Merchant;
