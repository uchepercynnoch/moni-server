const router = require("express").Router();
const mongoose = require("mongoose");
const Transaction = require("../models/transactionRecord.model");
const { check, validationResult } = require("express-validator");
const UserAccount = require("../models/useraccount.model");
const Merchant = require("../models/merchant.model");
const TransactionRecord = require("../models/transactionRecord.model");
const Vendor = require("../models/vendor.model");
const shortid = require("shortid");
const { fetchTransactionFromDB } = require("../helpers/db-helper");
const { toDinero, stripPrecision } = require("../helpers/dinero-helper");
const _ = require("lodash/object");

const NewTransactionValidator = [
  check("userId", "Please supply the customers ID")
    .isString()
    .not()
    .isEmpty(),
  check("iam", "Please supply the merchat IAM")
    .isString()
    .not()
    .isEmpty(),
  check("gemsToDeduct").isNumeric()
];

/* Note: currenlty assumes a 1 GEM -> 1 NGA conversion ratio */
const convertGemsToCash = gemValue => toDinero(gemValue, true);

const computeTransactionBreakdown = ({
  currentGems,
  total,
  gemsToDeduct,
  membershipType,
  loyaltyPercentage
}) => {
  let amountToPay = total;

  /* Todo: use a more complex algorithm, to detect if the user has enough points 
     taking into consideration free gems and claimables */
  if (currentGems < gemsToDeduct) {
    /* Stop the transaction here the user doesn't have enough gems */
    throw new error("User doesn't have enough points to process transaction");
  }

  /* Remove gem points worth from the lump sum */
  const gemDiscount = convertGemsToCash(gemsToDeduct);
  amountToPay = amountToPay.subtract(gemDiscount);

  /* Apply a discount based on membership type */
  const membershipDiscountMap = {
    regular: 0 /* 0% */,
    blue: 5 /* 5% */,
    gold: 10 /* 10% */,
    platinum: 30 /* 30% */
  };
  const discountFactor = membershipDiscountMap[membershipType];
  const membershipDiscount = amountToPay.percentage(discountFactor);
  /* Basically what remains after the membership discount has been applied */
  const payable = amountToPay.percentage(loyaltyPercentage - discountFactor);
  amountToPay = amountToPay.subtract(membershipDiscount);

  /* Compute the number of gem points the user can gain from the transaction */
  const cashToGemFactor = 100;
  const gemsToAward = stripPrecision(amountToPay.divide(cashToGemFactor));

  return {
    payable,
    gemsToAward,
    amountToPay,
    gemsToAward,
    discount: { membershipDiscount, gemDiscount }
  };
};

router.post("/add", NewTransactionValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res
      .status(400)
      .json({ error: errors.array({ onlyFirstError: true })[0] });

  const { userId, iam, transactionId, gemsToDeduct = 0 } = req.body;

  const user = await UserAccount.findOne({ id: userId });
  console.log(`mebership type: ${user.membershipType}`);
  const merchant = await Merchant.findOne({ iam });
  const vendor = await Vendor.findOne({ _id: merchant.vendor });

  const transaction = await fetchTransactionFromDB(
    vendor.config,
    transactionId
  );

  const total = toDinero(
    Number.parseInt(transaction.total.replace(/\./gi, ""))
  );

  let breakdown;

  try {
    const options = {
      total,
      gemsToDeduct,
      membershipType: user.membershipType,
      currentGems: user.gemPoints.currentGems,
      loyaltyPercentage: vendor.loyaltyPercentage
    };
    breakdown = computeTransactionBreakdown(options);
  } catch (error) {
    return res.status(403).send(error);
  }

  const {
    payable,
    gemsToAward,
    amountToPay,
    discount: { membershipDiscount, gemDiscount }
  } = breakdown;
  const totalSpend = toDinero(user.totalSpend).add(amountToPay);

  // Check if user needs a membership upgrade
  const ONE_HUNDRED_THOUSAND = toDinero(10000000);
  const ONE_MILLION = toDinero(100000000);
  const FIVE_MILLION = toDinero(500000000);

  if (
    totalSpend.greaterThanOrEqual(ONE_HUNDRED_THOUSAND) &&
    totalSpend.lessThan(ONE_MILLION)
  )
    user.membershipType = "blue";
  else if (
    totalSpend.greaterThanOrEqual(ONE_MILLION) &&
    totalSpend.lessThan(FIVE_MILLION)
  )
    user.membershipType = "gold";
  else if (totalSpend.greaterThanOrEqual(FIVE_MILLION))
    user.membershipType = "platinum";

  user.totalSpend = totalSpend.toObject();
  user.decrementGems(gemsToDeduct);
  user.incrementGems(gemsToAward);

  /* Update overall payables for vendor */
  vendor.payable = toDinero(vendor.payable)
    .add(amountToPay)
    .toObject();
  vendor.revenue = toDinero(vendor.revenue)
    .add(payable)
    .toObject();

  // Create a transaction record to represent the transaction
  const transactionRecord = new TransactionRecord({
    transactionId: shortid.generate(),
    date: Date.now(),
    user: user._id,
    vendor: vendor._id,
    discount: {
      gems: gemDiscount.toObject(),
      membership: membershipDiscount.toObject()
    },
    /* Todo: skip this field if we're on a 3rd party vendor */
    items: transaction.products,
    payable: payable.toObject(),
    servicedBy: merchant._id,
    total: total.toObject(),
    gemsAwarded: gemsToAward,
    gemsDeducted: gemsToDeduct
  });

  console.log(`gem discount: ${gemDiscount.toFormat("$0,0.00")}`);
  console.log(
    `membership discount: ${membershipDiscount.toFormat("$0,0.00")} `
  );
  console.log(`payable: ${payable.toFormat("$0,0.00")} `);
  console.log(`user pays: ${amountToPay.toFormat("$0,0.00")}`);
  console.log(`user awarded: ${gemsToAward} gems`);
  console.log(`deducted: ${gemsToDeduct} gems`);

  try {
    await Promise.all([
      user.save(),
      vendor.save(),
      merchant.save(),
      transactionRecord.save()
    ]);
    return res.send(
      _.pick(transactionRecord, [
        "payable",
        "gemsAwarded",
        "gemsDeducted",
        "total"
      ])
    );
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  let query = {};

  if (req.query.userId) {
    const userId = mongoose.Types.ObjectId.createFromHexString(
      req.query.userId
    );
    query = { user: userId };
  }

  if (req.query.vendorId) {
    const vendorId = mongoose.Types.ObjectId.createFromHexString(
      req.query.vendorId
    );
    query = { vendor: vendorId };
  }

  let predicator = Transaction.find({ ...query });
  if (req.query.id) {
    predicator = Transaction.findOne({ transactionId: req.query.id });
  }

  try {
    const result = await predicator
      .populate("servicedBy", "iam")
      .populate("user", "name")
      .select({ _id: 0 })
      .lean();

    return res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: "An error ocurred while pulling transactions from the database!"
    });
  }
});

module.exports = router;
