const router = require("express").Router();
const Vendor = require("../models/vendor.model");
const shortid = require("shortid");
const { uploadDestination, parseObjectId } = require("../helpers/helper");

//TODO: Add image uploading with multer

router.post("/add", async (req, res) => {
    if (!req.body) return res.status(400).send({ error: "Invalid request parameters" });

    const { vendorName, imageId, email, location, loyaltyPercentage, iamAlias } = req.body;
    const newVendor = await Vendor({
        id: shortid.generate(),
        iamAlias,
        location,
        vendorName,
        imageId,
        email,
        loyaltyPercentage,
        transactions: []
    });

    if (!newVendor) return res.status(500).send({ error: "An error ocurred while adding a vendor." });
    await newVendor.save();
    return res.send(newVendor);
});

//TODO: add jwt middleware
router.get("/", async (req, res) => {
    let query = null;
    if (req.query.id)
        query = Vendor.findOne({ _id: parseObjectId(req.query.id) });
    else 
        query = Vendor.find();
        
    query
        .then(result => {
            console.log(result);
            if (!result) throw "There are no vendors";
            return res.json(result);
            })
            .catch(error => res.status(500).send({ error: "An error while pulling out db data" }));
});

module.exports = router;
