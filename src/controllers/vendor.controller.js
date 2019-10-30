const router = require("express").Router();
const Vendor = require("../models/vendor.model");
const shortid = require("shortid");
const { uploadDestination } = require("../helpers/helper");

//TODO: Add image uploading with multer

router.post("/add", async (req, res) => {
    if (!req.body) return res.status(400).send({ error: "Invalid request parameters" });

    const { vendorName, imageId, config, location, loyaltyPercentage, iamAlias } = req.body;
    const newVendor = await Vendor({
        id: shortid.generate(),
        iamAlias,
        location,
        vendorName,
        imageId,
        config,
        loyaltyPercentage,
        transactions: []
    });

    if (!newVendor) return res.status(500).send({ error: "An error ocurred while adding a vendor." });
    await newVendor.save();
    return res.send(newVendor);
});

//TODO: add jwt middleware
router.get("/", async (req, res) => {
    Vendor.find()
        .select({ _id: 0 })
        .lean()
        .then(results => {
            if (!results) throw "There are no vendors";
            return res.json(results);
        })
        .catch(error => res.status(500).send({ error: "An error while pulling out db data" }));
});

module.exports = router;
