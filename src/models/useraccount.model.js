const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const loyaltyPointsSchema = new Schema({
    currentPoints: { type: Number, default: 0 },
    accumulatedPoints: { type: Number, default: 0 },
    lastUpdated: { type: Date }
});

const frequencyCountSchema = new Schema({
    count: { type: Number, default: 0 },
    accumulatedCount: { type: Number, default: 0 },
    lastUpdated: { type: Date }
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

    transactions: [{ type: Schema.Types.ObjectId, ref: "TransactionRecord" }],
    accountType: { type: String, default: "regular-user" },

    membershipType: { type: String, enum: ["regular","blue", "gold", "platinum"], default: "regular" },
    loyaltyPoints: { type: loyaltyPointsSchema, default: loyaltyPointsSchema },
    Discounts: { type: Array, default: [] },
    membershipCounter: { type: Number, default: 0 },

    referralCode: { type: String },

    preferences: { type: Array, default: [] },

    deviceId: { type: String },
    firstLogin: { type: Boolean, default: true }
});

userAccountSchema.methods.gainLoyaltyPoints = function(incrementBy) {
    //Update the loyaltyPoints
    this.loyaltyPoints.currentPoints += incrementBy;
    this.loyaltyPoints.accumulatedPoints += incrementBy;
    this.loyaltyPoints.lastUpdated = Date.now();
};

userAccountSchema.methods.redeemPoints = function(deductedBy) {
    if (this.loyaltyPoints.currentPoints > deductedBy) {
        //Update the loyaltyPoints
        this.loyaltyPoints.currentPoints -= deductedBy;
        this.loyaltyPoints.lastUpdated = Date.now();
        return true;
    } else return false;
};

const UserAccount = mongoose.model("useraccount", userAccountSchema);

module.exports = UserAccount;
