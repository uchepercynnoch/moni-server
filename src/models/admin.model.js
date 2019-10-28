const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdminSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    ageRange: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"] },
    vendor: {type: Schema.Types.ObjectId, ref: "Vendor" },
    type: {type: String, enum: ["admin","super-admin"], default: "admin"},

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
