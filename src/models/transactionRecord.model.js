const mongoose = require("mongoose");
const { DineroSchema } = require("../helpers/dinero-helper");

const Schema = mongoose.Schema;

const DiscountSchema = new Schema({
  gems: { type: DineroSchema, required: true },
  membership: { type: DineroSchema, required: true },
});

const TransactionRecordSchema = new Schema({
  transactionId: { type: String, required: true },
  date: { type: Date, default: Date.now() },
  items: [{ type: String }],
  servicedBy: { type: Schema.Types.ObjectId, ref: "Merchant", required: true },
  gemsDeducted: { type: Number, required: true },
  gemsAwarded: { type: Number, required: true },
  total: { type: DineroSchema },
  discount: { type: DiscountSchema, required: true },
  user: { type: Schema.Types.ObjectId, ref: "useraccount", required: true },
  vendor: { type: Schema.Types.ObjectId, ref: "Vendor", required: true },
  payable: { type: DineroSchema, required: true }
});

const TransactionRecord = mongoose.model(
  "TransactionRecord",
  TransactionRecordSchema
);

module.exports = TransactionRecord;
