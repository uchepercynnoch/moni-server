const router = require("express").Router();
const multer = require("multer");
const News = require("../models/news.model");
const path = require("path");
const mongoose = require("mongoose");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });

router.post("/", upload.single("newsImage"), async (req, res) => {
    if (!req.file || !req.body.content || !req.body.title || !req.body.vendorId)
        return res.status(400).send({ error: "Provide all required fields!" });

    const news = {
        title: req.body.title,
        content: req.body.content,
        imageId: req.file.path,
        // vendor: mongoose.Types.ObjectId.createFromHexString(req.body.vendorId)
    };
    console.log(news);
    const newNews = await News(news);
    const result = await newNews.save();

    if (result) return res.send(result);
    return res.status(500).json({ error: "News could not be created!" });
});

router.get("/", async (req, res) => {
    let query = null;
    if(req.query.id){
        const id = mongoose.Types.ObjectId.createFromHexString(req.query.id);
        query = News.findOne({ _id: id });
    }
    else if(req.query.vendorId){
        const vendorId = mongoose.Types.ObjectId.createFromHexString(req.query.vendorId);
        query = News.find({ vendor: vendorId });
    }
    else
        query = News.find();

    query
        .lean()
        .then(results =>
            results ? res.send(results) : res.status(400).json({ error: "Couldn't retrieve news!" })
        )
        .catch(error => res.status(500).send({ error }));
});

router.post("/update", upload.single("newsImage"), async (req, res) => {
    const id = req.query.id;

    const { title, content } = req.body;

    const news = await News.findOne({ _id: id });

    news.title = title;
    news.content = content;
    //fs.unlinkSync(`../../uploads/${offer.imageId}`); TODO delete previous file!
    if(req.file)
        news.imageId = req.file.path;

    const result = await news.save();
    if (!result) return res.status(400).json({ error: "An error ocurred while updating news!" });
    return res.send(result);
});

module.exports = router;
