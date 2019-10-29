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

  if (!req.body.deviceId)
    return res.status(400).send({ error: "Device id not supplied" });

  merchant.iam = req.body.deviceId;
  merchant.save();

  res.send({ status: "ok" });
});

router.post("/register", validation, async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      phoneNumber,
      gender,
      password,
      vendor
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // todo: make descision on "duplicate" based of a more one unique field
    const duplicate = await Merchant.findOne({
      phoneNumber
	});
	
    if (duplicate)
      return res.status(400).send({ error: "Account already exists!" });

    // hash the password before storing it in the database
    const pword = req.body.password;
    req.body.password = await bcrypt.hash(pword, await bcrypt.genSalt(10));

    const $vendor = await Vendor.findOne({ _id: vendor });
    if (!$vendor)
      return res
        .status(400)
        .json({ error: "Couldn't find a vendor with that id" });
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
        error: "Account could not be created now. Please contact the admin."
      });
    }

    await newMerchant.save();
    return res.send(newMerchant);
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
});

const loginValidation = [
  check("iam", "please your iam id").isString(),
  check("password", "").isString()
];

router.post("/login", loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const merchant = await Merchant.findOne({ iam: req.body.iam });
  if (!merchant)
    return res.status(404).json({ error: "Account does not exist!!" });

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

router.get("/", async (req, res) => {
  const { id, vendorId } = req.query;

  /* find the merchant with this id */
  const findMerchantById = id => {
    console.log("Finding by single id: ", id);
    Merchant.findOne({})
      .where("id")
      .equals(id)
      .populate("transactions")
      .select({ _id: 0 })
      .then(result => {
        result
          ? res.send(result)
          : res
              .status(500)
              .json({ error: " An error ocurred while retrieving merchants!" });
      })
      .catch(error => res.status(400).json({ error }));
  };

  const findAllMerchantsByVendor = vendorId => {
    vendorId = mongoose.Types.ObjectId.createFromHexString(vendorId);
    if (!vendorId) return res.status(400).json({ error: "vendorID required!" });

    Merchant.find({})
      .where("vendor")
      .equals(vendorId)
      .select({ _id: 0 })
      .then(result =>
        result
          ? res.send(result)
          : res
              .status(500)
              .json({ error: " An error ocurred while retrieving merchants!" })
      )
      .catch(error => res.status(400).json({ error }));
  };

  const findAllMerchants = () => {
    console.log("Finding all");
    Merchant.find({}).then(result => res.send(result));
  };

  if (id) {
    findMerchantById(id);
  } else if (vendorId) {
    findAllMerchantsByVendor(vendorId);
  } else {
    findAllMerchants();
  }
});

router.post("/update", async (req, res) => {
  if (!req.body) return res.status(400).json({ error: "Invalid Update!" });

  let {
    id,
    firstname,
    lastname,
    password,
    gender,
    iam,
    phoneNumber
  } = req.body;
  let obj = null;
  if (password.trim() === "")
    obj = { firstname, lastname, gender, iam, phoneNumber };
  else {
    // hash the password
    const pword = password;
    password = await bcrypt.hash(pword, await bcrypt.genSalt(10));
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
        : res
            .status(500)
            .json({ error: " An error ocurred while updating cashier!" });
    })
    .catch(error => res.status(400).json({ error }));
});

module.exports = router;
