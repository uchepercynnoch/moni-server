const router = require("express").Router();
const Merchant = require("../models/merchant.model");
const Vendor = require("../models/vendor.model");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const validation = [
    check("firstname", "firstname is required!").isString(),
    check("lastname", "lastname is required!").isString(),
    check("phoneNumber", "phone number is required!").isMobilePhone("en-NG"),
    check("gender", "are you male or female!").isString(),
    check("vendor", "supply vendor ID").isString(),
    check("password", "please specify a password")
        .isLength({ min: 8 })
        .withMessage("password should be greater than 8")
];

router.post("/setDeviceId", async () => {
    console.log(req.body);

    const merchant = await Merchant.findOne({
        iam: req.body.iam
    });

    if (!merchant) return res.status(404).send({ error: "User not found" });

    if (!req.body.deviceId) return res.status(400).send({ error: "Device id not supplied" });

    merchant.iam = req.body.deviceId;
    merchant.save();

    res.send({ status: "ok" });
});

router.post("/register", validation, async (req, res) => {
    try {
        console.log(req.body);
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // check for duplicates
        const duplicate = await Merchant.findOne({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phoneNumber: req.body.phoneNumber,
            deviceId: req.body.deviceId
        });

        if (duplicate) return res.status(400).send({ error: "Account already exists!" });

        // hash the password
        const pword = req.body.password;
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(pword, salt);

        const { firstname, lastname, phoneNumber, gender, password, vendor } = req.body;
        const $vendor = await Vendor.findOne({ _id: vendor });
        if (!$vendor) return res.status(400).json({ error: "Invalid Vendor!" });
        const newMerchant = await Merchant({
            id: shortid.generate(),
            firstname,
            lastname,
            phoneNumber,
            gender,
            password,
            vendor,
            iam: `${firstname}.${lastname}@${$vendor.iamAlias}`.toLowerCase()
        });

        if (!newMerchant) {
            return res.status(500).json({
                error: "Account could not be created now. Pls contact the admin."
            });
        }

        await newMerchant.save();
        return res.send(newMerchant);
    } catch (error) {
        return res.status(400).send({ error });
    }
});
const loginValidation = [check("iam", "please your iam id").isString(), check("password", "").isString()];

router.post("/login", loginValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const merchant = await Merchant.findOne({ iam: req.body.iam });
    if (!merchant) return res.status(404).json({ error: "Account does not exist!!" });

    const isEqual = await bcrypt.compare(req.body.password, merchant.password);
    if (!isEqual) return res.status(400).json({ error: "Incorrect password!" });

    merchant.lastLogon = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");

    await merchant.save();
    // Generate jwt-token and send
    const token = jwt.sign(
        {
            iam: merchant.iam,
            id: merchant.id,
            outlet: merchant.outlet
        },
        process.env.JWT_SECRET,
        { expiresIn: "2 days" }
    );
    return res.send({ token });
});

router.get("/all", async (req, res) => {
    const vendorId = req.query.id;
    console.log(vendorId);
    const id = mongoose.Types.ObjectId.createFromHexString(vendorId);
    if (!vendorId) return res.status(400).json({ error: "vendorID required!" });

    Merchant.find({})
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

    Merchant.findOne({})
        .where("id")
        .equals(id)
        .populate("transactions")
        .select({ _id: 0 })
        .then(result => {
            result
                ? res.send(result)
                : res.status(500).json({ error: " An error ocurred while retrieving merchants!" });
        })
        .catch(error => res.status(400).json({ error }));
});

router.post("/update", async (req, res) => {
    if (!req.body) return res.status(400).json({ error: "Invalid Update!" });

    let { id, firstname, lastname, password, gender, iam, phoneNumber } = req.body;
    let obj = null;
    if (password.trim() === "") obj = { firstname, lastname, gender, iam, phoneNumber };
    else {
        // hash the password
        const pword = password;
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(pword, salt);
        obj = { firstname, lastname, password, gender, iam, phoneNumber };
    }

    Merchant.findOneAndUpdate(
        { id },
        {
            $set: {
                ...obj
            }
        },
        { new: true }
    )
        .then(result => {
            result
                ? res.send(result)
                : res.status(500).json({ error: " An error ocurred while updating cashier!" });
        })
        .catch(error => res.status(400).json({ error }));
});

module.exports = router;
