const router = require("express").Router();
const _ = require("lodash");
const shortid = require("shortid");
const Helper = require("../helpers/helper");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const regValidation = [
    check("name", "name is required!").isString(),
    check("email", "email is required!").isEmail(),
    check("phoneNumber", "phone number is required!").isMobilePhone("en-NG"),
    check("gender", "are you male or female!").isString(),
    check("vendor", "pls supply your vendor!").isString(),
    check("password", "please specify a password")
        .isLength({ min: 8 })
        .withMessage("password should be greater than 8")
];

router.post("/register", regValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({
            error: errors.array({
                onlyFirstError: true
            })[0]
        });

    // check for duplicates
    const duplicate = await Admin.findOne({
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    });

    if (duplicate)
        return res.status(400).send({
            error: "Account already exists!"
        });

    // hash the password
    const pword = req.body.password;
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(pword, salt);

    const { name, phoneNumber, gender, password, email, vendor } = req.body;
    const newAdmin = await Admin({
        id: shortid.generate(),
        name,
        phoneNumber,
        gender,
        password,
        vendor,
        email
    });
    if (newAdmin) {
        await newAdmin.save();
        return res.send(newAdmin);
    }

    return res.status(400).send({ error: "An error ocurred while creating a new admin!!" });
});

router.post("/login", async (req, res) => {
    check("email", "please provide your email").isEmail();
    check("password", "please specify the otp to be verified").isString();

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array({ onlyFirstError: true })[0] });

    // check if the phoneNumber and password exists
    const admin = await Admin.findOne({
        email: req.body.email
    });
    if (!admin) return res.status(400).send({ error: "Account does not exist!" });

    const isEqual = await bcrypt.compare(req.body.password, admin.password);

    if (!isEqual) return res.status(404).send({ error: "Incorrect password!" });

    // Generate jwt-token and send
    const token = jwt.sign(
        {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.type,
            vendor: admin.vendor
        },
        process.env.JWT_SECRET,
        { expiresIn: "30m" }
    );
    console.log(token);
    return res.send({ token });
});

router.get("/", async (req, res) => {
    let query = null;
    if(req.query.id){
        query = Admin.findOne({ id: req.query.id });
    }
    else if(req.query.vendorId){
        const vendorId = mongoose.Types.ObjectId.createFromHexString(req.query.vendorId);
        query = Admin.find({ vendor: vendorId });
    }
    else
        query = Admin.find();

    query
    .populate("vendor","vendorName")
        .lean()
        .then(results => results ? res.send(results) : res.status(400).json({ error: "Couldn't retrieve Admins!" })
        )
        .catch(error => res.status(500).send({ error }));
});

module.exports = router;
