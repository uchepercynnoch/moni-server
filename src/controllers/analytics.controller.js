const router = require("express").Router();
const Transaction = require("../models/transactionRecord.model");
const mongoose = require("mongoose");

router.get("/stats", async (req, res) => {
    const vendor = mongoose.Types.ObjectId.createFromHexString(req.query.id);

    Transaction.find({ vendor })
        .lean()
        .then(results => {
            if (results) {
                let totalPointsEarned = 0;
                let totalPointsRedeemed = 0;
                let totalSales = 0;

                for (const transaction of results) {
                    totalPointsEarned += transaction.gainedPoints || 0;
                    totalPointsRedeemed += transaction.deductedPoints || 0;
                    totalSales += 1;
                }

                const obj = { totalPointsEarned, totalPointsRedeemed, totalSales };
                console.log(obj);
                return res.json(obj);
            }

            return res.status(400).json({ totalPointsEarned, totalPointsRedeemed, totalSales });
        })
        .catch(error => res.status(500).json({ error }));
});

module.exports = router;
