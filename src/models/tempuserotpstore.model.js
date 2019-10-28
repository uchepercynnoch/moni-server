const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TempUserOtpStoreSchema = new Schema({
  userId: { type: String, required: true },
  otpCode: { type: String, required: true }
});

const TempUserOtpStore = mongoose.model("tempuserotpstore", TempUserOtpStoreSchema);

module.exports = TempUserOtpStore;
