const UserAccount = require("../models/useraccount.model");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const twilio = require("twilio");
const TempUserOtpStore = require("../models/tempuserotpstore.model");
const _ = require("lodash");
const shortid = require("shortid");
const Helper = require("../helpers/helper");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");

const validation = [
    check("name", "name is required!").isString(),
    check("email", "email is required!").isEmail(),
    check("phoneNumber", "phone number is reequired!").isMobilePhone("en-NG"),
    check("ageRange", "Please specify your age range!").isString(),
    check("gender", "are you male or female!").isString(),
    check("password", "please specify a password")
        .isLength({ min: 8 })
        .withMessage("password should be greater than 8")
];

router.post("/register", validation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
        // check for duplicates
        const duplicate = await UserAccount.findOne({
            email: req.body.email,
            phoneNumber: req.body.phoneNumber
        });

        if (duplicate) return res.status(400).send({ error: "Account already exists!" });

        // hash the password
        const pword = req.body.password;
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(pword, salt);

        const { name, phoneNumber, ageRange, gender, password, email } = req.body;
        const newAccount = await UserAccount({
            id: shortid.generate(),
            name,
            phoneNumber,
            ageRange,
            gender,
            password,
            email
        });
        if (newAccount) await newAccount.save();

        // send out an otp message
        SendOtpMessage("")
            .then(async otp => {
                console.log("message sent!");

                // Todo: otp object should be expanded to have expiry stamp
                const result = await TempUserOtpStore({
                    userId: newAccount.id,
                    otpCode: otp
                });

                if (newAccount && result) {
                    await result.save();
                    return res.send(newAccount);
                }

                return res.status(400);
            })
            .catch(error => {
                console.log(error);
                res.status(500).send({
                    error: "An error occurred while preparing your OTP please try again"
                });
            });
    } catch (error) {
        return res.status(400).send({ error });
    }
});

function SendOtpMessage(to) {
    const t = new twilio.Twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTHTOKEN);
    const otp = _.random(10000, 99999, false);
    return t.messages
        .create({
            body: `MONI-OTP :- ${otp}`,
            from: "+12055572732",
            to: "+2349052814862" // todo: change me!
        })
        .then(_ => otp);
}

router.get("/otp/resend", async (req, res) => {
    check("userId", "Please provide userId").isString();
    check("phoneNumber", "Phone Number is required").isString();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }

    // send out an otp message
    SendOtpMessage("")
        .then(otp => {
            console.log("message sent!");

            // delete any otp tied to the user if any exists
            TempUserOtpStore.deleteOne({ userId: req.body.userId })
                .then(async res => {
                    if (res.deletedCount < 1)
                        return res
                            .status(500)
                            .send({ error: "An error ocurred while deleting previous OTP" });

                    // otp object should be expanded to have expiry stamp
                    const result = await TempUserOtpStore({
                        userId: req.body.userId,
                        otpCode: otp
                    });
                    if (result) {
                        await result.save();
                        return res.send({ message: "Otp Sent successfully 😁" });
                    }

                    throw "An error ocurred while creating OTP";
                })
                .catch(error => {
                    throw error;
                });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({
                error: "An error occurred while preparing your OTP please try again"
            });
        });
});

router.post("/verify", async (req, res) => {
    try {
        check("userId", "please provide a user id").isString();
        check("otpCode", "please specify the otp to be verified").isString();
        console.log(req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array() });
        }
        //check if user has been previously verified
        if (await Helper.checkVerifiedStatus(req)) return res.send({ message: "user is already verified!" });

        const otpStore = await TempUserOtpStore.findOne({
            userId: req.body.userId
        });

        if (otpStore.otpCode !== req.body.otpCode) throw "invalid/expired otp";

        console.log("codes accurate!");

        //set verified to true for the user
        UserAccount.updateOne(
            { id: otpStore.userId },
            {
                $set: { verified: true }
            },
            { new: true }
        )
            .then(async result => {
                // delete otp used by the user
                const otpDelete = await TempUserOtpStore.deleteOne({
                    userId: req.body.userId
                });
                if (result && otpDelete) return res.send({ message: "Accurate" });
            })
            .catch(_ => {
                throw `${error}`;
            });
    } catch (error) {
        return res.status(400).send({ error });
    }
});

router.post("/login", async (req, res) => {
    check("phoneNumber", "please provide your phoneNumber").isString();
    check("password", "please specify the otp to be verified").isString();

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array() });
    }
    // check if the phoneNumber and password exists
    const account = await UserAccount.findOne({
        phoneNumber: req.body.phoneNumber
    });
    if (!account) return res.status(400).send({ error: "Account does not exist!" });

    const isEqual = await bcrypt.compare(req.body.password, account.password);

    if (!isEqual) return res.status(404).send({ error: "Incorrect password!" });

    // Generate jwt-token and send
    const token = jwt.sign(
        {
            id: account.id,
            name: account.name,
            email: account.email,
            verified: account.verified,
            _id: account._id
        },
        process.env.JWT_SECRET,
        { expiresIn: "2 days" }
    );
    return res.send({ token });
});

router.post("/pref", async (req, res) => {
    if (!req.body.preferences) return res.status(400).send("Preferences is empty");

    const { preferences, userId } = req.body;
    UserAccount.findOneAndUpdate(
        { id: userId },
        {
            $set: { preferences }
        },
        { new: true }
    )
        .then(result => {
            if (result) return res.json({ message: "success" });
            throw "An error ocurred while creating preferences";
        })
        .catch(error => res.status(400).send({ error }));
});

router.post("/first", async (req, res) => {
    if (!req.query.userId) return res.status(400).send({ error: "Provide userId!!" });
    const { userId } = req.query;

    UserAccount.findOneAndUpdate(
        { id: userId },
        {
            $set: { firstLogin: false }
        },
        {
            new: true
        }
    )
        .then(result =>
            result
                ? res.send({ message: "success" })
                : res.status(404).send({ error: "User does not exist!" })
        )
        .catch(error => {
            console.log(error);
            res.status(400).send({ error });
        });
});

router.get("/firstCheck", async (req, res) => {
    if (!req.query.userId) return res.status(400).send({ error: "Provide userId!!" });
    const { userId } = req.query;

    UserAccount.findOne({ id: userId })
        .then(result =>
            result
                ? res.send({ flag: result.firstLogin })
                : res.status(404).send({ error: "User does not exist!" })
        )
        .catch(error => {
            console.log(error);
            res.status(400).send({ error });
        });
});

router.get("/", async (req,res) => {
    let query = null;
    if(req.query.id){
        const id = mongoose.Types.ObjectId.createFromHexString(req.query.id);
        query = UserAccount.findOne({_id: id});
    }
    else
        query = UserAccount.find();

    query.select({
        id: 1,
        name: 1,
        _id: 1,
        gender: 1,
        email: 1,
        gemPoints: 1,
        phoneNumber: 1,
        membershipType: 1,
        verified: 1,
        totalSpend: 1
    })
        .lean()
        .then(result => {
            if (!result) return res.status(404).send({ error: "There are no users currently!" });
            return res.send(result);
        })
        .catch(error => {
            console.log(error);
            return res.status(404).send("An error ocurred while pulling user data!");
        });
});

module.exports = router;