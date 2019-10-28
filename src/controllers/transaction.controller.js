const router = require("express").Router();
const mongoose = require("mongoose");
const Transaction = require("../models/transactionRecord.model");
const Product = require("../models/product.model");

router.get("/all", async (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: "Pls provide the vendor ID!!" });

    let vendorId = req.query.id;
    vendorId = mongoose.Types.ObjectId.createFromHexString(vendorId);

    Transaction.find({ vendor: vendorId })
        .populate("servicedBy", "iam")
        .populate("citizen", "name")
        .select({ _id: 0 })
        .lean()
        .then(result => {
            console.log(result);
            if (!result) return res.status(404).json({ error: "There are no transactions currently!" });
            return res.json(result);
        })
        .catch(error => {
            console.log(error);
            return res
                .status(500)
                .send({ error: "An error ocurred while pulling transactions from the database!" });
        });
});

router.get("/", async (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: "Pls provide the transaction ID!!" });

    const transactionId = req.query.id;

    Transaction.findOne({ transactionId })
        .populate("servicedBy", "iam")
        .populate("citizen", "name")
        .populate("items")
        .select({ _id: 0 })
        .lean()
        .then(async result => {
            return result ? res.json(result) : res.status(404).json({ error: "transaction Not found!" });
        })
        .catch(error => {
            console.log(error);
            return res
                .status(500)
                .json({ error: "An error ocurred while pulling transaction from the database!" });
        });
});

module.exports = router;
