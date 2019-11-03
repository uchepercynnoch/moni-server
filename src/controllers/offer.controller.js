const router = require("express").Router();
const multer = require("multer");
const Offer = require("../models/offers.model");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

router.post("/", upload.single("offerImage"), async (req, res) => {
    if (!req.file || !req.body.percentage || !req.body.title || !req.body.vendorId)
        return res.status(400).send({ error: "Provide all required fields!" });

        console.log(req.body);

    const offer = {
        title: req.body.title,
        offerPercentage: req.body.percentage,
        imageId: req.file.path,
        membershipType: req.body.membershipType,
        ageRange: req.body.ageRange,
        preferences: req.body.preferences.split(","),
        // vendor: mongoose.Types.ObjectId.createFromHexString(req.body.vendorId)
    };
    console.log(offer);
    const newOffer = await Offer(offer);
    const result = await newOffer.save();

    if (result) return res.send(result);
    return res.status(500).json({ error: "Offer could not be created!" });
});

router.get("/", async (req, res) => {
    let query = null;
    if(req.query.id){
        const id = mongoose.Types.ObjectId.createFromHexString(req.query.id);
        query = Offer.findOne({ _id: id });
    }
    else if(req.query.vendorId){
        const vendorId = mongoose.Types.ObjectId.createFromHexString(req.query.vendorId);
        query = Offer.find({ vendor: vendorId });
    }
    else
        query = Offer.find();

    query
        .lean()
        .then(results =>
            results ? res.send(results) : res.status(400).json({ error: "Couldn't retrieve offers!" })
        )
        .catch(error => res.status(500).send({ error }));
});

router.post("/update", upload.single("offerImage"), async (req, res) => {
    const id = req.query.id;

    const { title, percentage, membershipType, ageRange, preferences } = req.body;

    const offer = await Offer.findOne({ _id: id });

    offer.title = title;
    offer.offerPercentage = percentage;
    offer.membershipType = membershipType;
    offer.ageRange = ageRange;
    offer.preferences = preferences.split(",");
    //fs.unlinkSync(`../../uploads/${offer.imageId}`); TODO delete previous file!
    if(req.file)
        offer.imageId = req.file.path;
    const result = await offer.save();
    if (!result) return res.status(400).json({ error: "An error ocurred while updating offer!" });
    return res.send(result);
});
module.exports = router;
