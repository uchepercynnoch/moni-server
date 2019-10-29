const router = require("express").Router();
const mysql = require("mysql");
const { check, validationResult } = require("express-validator");
const UserAccount = require("../models/useraccount.model");
const Merchant = require("../models/merchant.model");
const Vendor = require("../models/vendor.model");
const Product = require("../models/product.model");
const TransactionRecord = require("../models/transactionRecord.model");
const shortid = require("shortid");
const moment = require("moment");

const Validation = [
    check("userId", "Please supply the customers ID")
        .isString()
        .not()
        .isEmpty(),
    check("iam", "Please supply the merchat IAM")
        .isString()
        .not()
        .isEmpty()
];

router.post("/gain", Validation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array({ onlyFirstError: true })[0] });

    const { userId, iam, transactionId } = req.body;

    const userAccount = await UserAccount.findOne({ id: userId });
    const merchant = await Merchant.findOne({ iam });
    const vendor = await Vendor.findOne({ _id: merchant.vendor });

    createConnection(vendor.config, transactionId, async result => {
        const transaction = result;
        await gainAction(vendor, userAccount, merchant, transaction);

        try {
            const saved = await Promise.all([userAccount.save(),await merchant.save()])
            // Update both ends here! probably socket io
            if (saved) return res.send(userAccount);
        }
        catch(error) {
            res.status(500).send({error: Object.toString(error)})
        }
    });
});

router.post("/redeem", Validation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ error: errors.array({ onlyFirstError: true })[0] });

    const { userId, iam, transactionId } = req.body;

    const userAccount = await UserAccount.findOne({ id: userId });
    const merchant = await Merchant.findOne({ iam });
    const vendor = await Vendor.findOne({ _id: merchant.vendor });

    createConnection(vendor.config, transactionId, async result => {
        const transaction = result;
        const result2 = await redeemAction(vendor, userAccount, merchant, transaction);
        if (!result2) return res.json({ error: "Not Enough Points!" });
        const saved1 = await userAccount.save();
        const saved2 = await merchant.save();
        // Update both ends here! probably socket io

        if (saved1 && saved2) return res.send({ saved1, saved2 });
    });
});
function Transform(data) {
    const obj = { refId: "", total: 0, products: [] };
    obj.refId = data.ref;
    obj.total = data.total;
    data.items.forEach(item => {
        const product = item.name;
        obj.products.push(product);
    });
    return obj;
}

async function gainAction(vendor, userAccount, merchant, transactionDetails) {
    let pointsGained = 0;

    const points = calculatePoints(vendor.loyaltyPercentage, transactionDetails.total);
    console.log("Points ", points);
    userAccount.gainLoyaltyPoints(points);
    pointsGained += points;

    const transactionRecord = new TransactionRecord({
        transactionId: shortid.generate(),
        dateOfTransaction: moment().format("LLLL"),
        items: [],
        servicedBy: merchant._id,
        type: "gain",
        gainedPoints: pointsGained,
        citizen: userAccount._id,
        vendor: vendor._id
    });
    for (const item of transactionDetails.products) {
        const product = await Product.findOne({ name: item });
        if (product) transactionRecord.items.push(product._id);
        else transactionRecord.items.push(item);
    }

    await transactionRecord.save();
    userAccount.transactions.push(transactionRecord);
    merchant.transactions.push(transactionRecord);

    // update cashier analytics
    merchant.customersAttendedTo += 1;
    merchant.totalGemsGainedForCustomers += pointsGained;

    //increment the membership counter
    userAccount.membershipCounter += pointsGained;
    //check if membership needs an upgrade
    MembershipLevelCheck(userAccount);
}

async function redeemAction(vendor, userAccount, merchant, transactionDetails) {
    const pointsTobeDeducted = transactionDetails.total;
    console.log("deducted ", pointsTobeDeducted);

    const result = userAccount.redeemPoints(pointsTobeDeducted);
    console.log(result);
    if (!result) return false;
    //Update In-House Transaction Record
    const transactionRecord = new TransactionRecord({
        transactionId: shortid.generate(),
        dateOfTransaction: moment().format("LLLL"),
        items: [],
        servicedBy: merchant._id,
        type: "redeem",
        deductedPoints: pointsTobeDeducted,
        citizen: userAccount._id,
        vendor: vendor._id
    });
    console.log(transactionRecord);
    for (const item of transactionDetails.products) {
        const product = await Product.findOne({ name: item });
        if (product) transactionRecord.items.push(product._id);
        else transactionRecord.items.push(item);
    }

    await transactionRecord.save();
    userAccount.transactions.push(transactionRecord);
    merchant.transactions.push(transactionRecord);

    // update cashier analytics
    merchant.customersAttendedTo += 1;
    merchant.totalGemsRedeemedForCustomers += pointsTobeDeducted;

    //increment the membership counter
    userAccount.membershipCounter -= pointsTobeDeducted;

    return true;
}

function MembershipLevelCheck(useraccount) {
    if (useraccount.membershipCounter >= 100000 && useraccount.membershipCounter < 1000000) {
        useraccount.membershipType = "blue";
    } else if (useraccount.membershipCounter >= 1000000 && useraccount.membershipCounter < 6000000) {
        useraccount.membershipType = "gold";
    } else if (useraccount.membershipCounter >= 6000000) {
        useraccount.membershipType = "platinum";
    }
}

const calculatePoints = (percentage, amount) =>  Math.ceil((percentage / 100) * amount);

function createConnection(config, transactionId, dataGotten) {
    try {
        let result = null;
        var connection = mysql.createConnection({
            host: config.host,
            user: config.user,
            password: config.password,
            database: config.database
        });

        connection.connect();
        connection.query(`SELECT * FROM monipos.sales WHERE ref = "${transactionId}"`, function(
            error,
            results,
            fields
        ) {
            if (error) throw error;
            const obj = JSON.parse(results[0].data);
            dataGotten(Transform(obj));
        });
        connection.end();
    } catch (error) {
        console.log(`ERROR: Invalid TransactionID`);
        dataGotten(null);
    }
}

module.exports = router;
