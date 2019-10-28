const router = require("express").Router();
const Product = require("../models/product.model");
const Vendor = require("../models/vendor.model");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const validation = [
    check("name", "name is required!").isString(),
    check("code", "code is required!").isString(),
    check("description", "description is required!").isString(),
    check("loyaltyPercentage", "are you male or female!").isNumeric(),
    check("unitPrice", "Specify unit price!").isNumeric()
];

router.post("/register", validation, async (req, res) => {
    try {
        console.log(req.body);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // check for duplicates
        const duplicate = await Product.findOne({
            name: req.body.name,
            code: req.body.code
        });

        if (duplicate) return res.status(400).send({ error: "Product already exists!" });

        const { name, code, description, loyaltyPercentage, vendor, unitPrice } = req.body;
        const $vendor = await Vendor.findOne({ _id: vendor });
        if (!$vendor) return res.status(400).json({ error: "Invalid Vendor!" });
        const newProduct = await Product({
            refId: shortid.generate(),
            name,
            code,
            description,
            loyaltyPercentage,
            unitPrice,
            vendor: $vendor._id
        });

        if (!newProduct) {
            return res.status(500).json({
                error: "Product could not be created now. Pls contact the admin."
            });
        }

        await newProduct.save();
        return res.send(newProduct);
    } catch (error) {
        return res.status(400).send({ error });
    }
});

router.get("/all", async (req, res) => {
    const vendorId = req.query.id;
    console.log(vendorId);
    const id = mongoose.Types.ObjectId.createFromHexString(vendorId);
    if (!vendorId) return res.status(400).json({ error: "vendorID required!" });

    Product.find({})
        .where("vendor")
        .equals(id)
        .select({ _id: 0 })
        .then(result =>
            result
                ? res.send(result)
                : res.status(500).json({ error: " An error ocurred while retrieving merchants!" })
        )
        .catch(error => res.status(400).json({ error }));
});

router.get("/", async (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Id required!" });

    Product.findOne({})
        .where("refId")
        .equals(id)
        .select({ _id: 0 })
        .then(result => {
            result
                ? res.send(result)
                : res.status(500).json({ error: " An error ocurred while retrieving products!" });
        })
        .catch(error => res.status(400).json({ error }));
});

router.post("/update", async (req, res) => {
    if (!req.body) return res.status(400).json({ error: "Invalid Update!" });

    let { id, name, code, description, loyaltyPercentage, unitPrice } = req.body;

    Product.findOneAndUpdate(
        { refId: id },
        {
            $set: {
                name,
                code,
                description,
                loyaltyPercentage,
                unitPrice
            }
        },
        { new: true }
    )
        .then(result => {
            console.log(result);
            result
                ? res.send(result)
                : res.status(500).json({ error: " An error ocurred while updating product!" });
        })
        .catch(error => res.status(400).json({ error }));
});

module.exports = router;
