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
    transactions: [{ type: Schema.Types.ObjectId, ref: "TransactionRecord" }],
    imageId: { type: String },

    config: { type: configSchema, default: configSchema },

    // percentage to cut from amount spent
    loyaltyPercentage: { type: Number, default: 1 }
});

VendorSchema.methods.GetFrequencyCount = function(membershipType) {
    switch (membershipType) {
        case "blue":
            return this._blueFrequencyCount;
        case "gold":
            return this._goldFrequencyCount;
        case "platinum":
            return this._platinumFrequencyCount;
        default:
            return 0;
    }
};

const Vendor = mongoose.model("Vendor", VendorSchema);

module.exports = Vendor;
