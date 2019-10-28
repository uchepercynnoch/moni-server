const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    refId: { type: String, required: true },
    name: { type: String },
    code: { type: String },
    description: { type: String },
    unitPrice: {type: Number},
    /** TODO: other important info would be added later */
    imageId: { type: String },
    loyaltyPercentage: { type: Number, default: 1 },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" }
});

const Product = mongoose.model("product", ProductSchema);

module.exports = Product;
