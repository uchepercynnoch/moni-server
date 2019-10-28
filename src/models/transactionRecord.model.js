const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TransactionRecordSchema = new Schema({
    transactionId: { type: String, required: true },
    dateOfTransaction: { type: Date, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "product" }],
    servicedBy: { type: Schema.Types.ObjectId, ref: "Merchant" }, // merchant
    type: { type: String, enum: ["gain", "redeem"] },
    deductedPoints: { type: Number },
    gainedPoints: { type: Number },
    citizen: { type: Schema.Types.ObjectId, ref: "useraccount" },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" }
});

const TransactionRecord = mongoose.model("TransactionRecord", TransactionRecordSchema);

module.exports = TransactionRecord;
