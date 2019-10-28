const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const offersSchema = new Schema({
    title: { type: String, required: true },
    offerPercentage: { type: Number, required: true },
    imageId: { type: String },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    dateCreated: { type: Date, default: Date.now },

    //Targeted offer options
    membershipType: { type: String, enum: ["all", "blue", "gold", "platinum"], default: "all" },
    ageRange: { type: String },
    preferences: {
        type: Array,
        default: ["Movies", "Restaurant", "NightLife", "Shopping", "Leisure", "Hotel"]
    }
});

const Offer = mongoose.model("Offer", offersSchema);

module.exports = Offer;
