const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageId: { type: String },
    vendor: { type: Schema.Types.ObjectId, ref: "Vendor" },
    dateCreated: { type: Date, default: Date.now }
});

const News = mongoose.model("News", newsSchema);

module.exports = News;
