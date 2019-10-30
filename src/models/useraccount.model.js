const mongoose = require("mongoose");
const moment = require("moment");
const { DineroSchema, toDinero } = require("../helpers/dinero-helper");

const Schema = mongoose.Schema;

const gemPointsSchema = new Schema({
  currentGems: { type: Number, default: 0 },
  accumulatedGems: { type: Number, default: 0 }
});

const userAccountSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  ageRange: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"] },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  accountType: { type: String, default: "regular-user" },
  membershipType: {
    type: String,
    enum: ["regular", "blue", "gold", "platinum"],
    default: "regular"
  },
  gemPoints: { type: gemPointsSchema, default: gemPointsSchema },
  Discounts: { type: Array, default: [] },
  membershipCounter: { type: Number, default: 0 },
  referralCode: { type: String },
  preferences: { type: Array, default: [] },
  deviceId: { type: String },
  firstLogin: { type: Boolean, default: true },
  totalSpend: { type: DineroSchema, default: toDinero(0).toObject() }
});

userAccountSchema.methods.incrementGems = function(factor) {
  this.gemPoints.currentGems += factor;
  this.gemPoints.accumulatedGems += factor;
};

userAccountSchema.methods.decrementGems = function(factor) {
  this.gemPoints.currentGems -= factor;
};

const UserAccount = mongoose.model("useraccount", userAccountSchema);

module.exports = UserAccount;
